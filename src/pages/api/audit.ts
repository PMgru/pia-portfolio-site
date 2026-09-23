import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface AuditResult {
  url: string;
  score: number;
  checks: {
    label: string;
    pass: boolean;
    detail: string;
  }[];
  summary: string;
  executiveSummary?: string;
  actionPlan?: string[];
  pageSpeed?: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url, openrouter_api_key } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const parsedUrl = new URL(targetUrl);
    const origin = parsedUrl.origin;

    const [htmlRes, robotsRes, sitemapRes] = await Promise.allSettled([
      fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 SEOAuditBot/1.0' },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) })
    ]);

    if (htmlRes.status === 'rejected') {
      throw new Error('Failed to reach website');
    }

    const html = await htmlRes.value.text();
    const checks: AuditResult['checks'] = [];
    let score = 0;
    let maxScore = 0;

    // Technical Checks (Robots & Sitemap)
    const robotsPass = robotsRes.status === 'fulfilled' && robotsRes.value.ok;
    checks.push({
      label: 'Robots.txt Present',
      pass: robotsPass,
      detail: robotsPass ? 'robots.txt found' : 'Missing or unreachable robots.txt'
    });
    maxScore += 5;
    if (robotsPass) score += 5;

    const sitemapPass = sitemapRes.status === 'fulfilled' && sitemapRes.value.ok;
    checks.push({
      label: 'XML Sitemap Present',
      pass: sitemapPass,
      detail: sitemapPass ? 'sitemap.xml found' : 'Missing or unreachable sitemap.xml'
    });
    maxScore += 5;
    if (sitemapPass) score += 5;

    // 1. Title tag
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const titleLen = title.length;
    const titlePass = titleLen >= 30 && titleLen <= 60;
    checks.push({
      label: 'Title Tag (30–60 chars)',
      pass: titlePass,
      detail: title ? `"${title}" (${titleLen} chars)` : 'No title tag found',
    });
    maxScore += 15;
    if (titlePass) score += 15;
    else if (title) score += 7;

    // 2. Meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    const desc = descMatch ? descMatch[1].trim() : '';
    const descLen = desc.length;
    const descPass = descLen >= 120 && descLen <= 160;
    checks.push({
      label: 'Meta Description (120–160 chars)',
      pass: descPass,
      detail: desc ? `${descLen} characters` : 'No meta description found',
    });
    maxScore += 15;
    if (descPass) score += 15;
    else if (desc) score += 7;

    // 3. H1 tag
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    const h1Pass = h1Count === 1;
    checks.push({
      label: 'Single H1 Tag',
      pass: h1Pass,
      detail: h1Count === 0 ? 'No H1 found' : h1Count === 1 ? `H1: "${h1Match?.[1]?.replace(/<[^>]+>/g,'').trim().slice(0,60)}"` : `${h1Count} H1 tags found (should be 1)`,
    });
    maxScore += 15;
    if (h1Pass) score += 15;

    // 4. H2 count
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h2Pass = h2Count >= 2;
    checks.push({
      label: 'H2 Headings (min 2)',
      pass: h2Pass,
      detail: `${h2Count} H2 tags found`,
    });
    maxScore += 10;
    if (h2Pass) score += 10;

    // 5. Images with alt tags
    const allImgs = (html.match(/<img[^>]+>/gi) || []);
    const imgsWithAlt = allImgs.filter(img => /alt=["'][^"']+["']/i.test(img));
    const altPass = allImgs.length > 0 && imgsWithAlt.length === allImgs.length;
    checks.push({
      label: 'All Images Have Alt Text',
      pass: altPass,
      detail: allImgs.length === 0 ? 'No images found' : `${imgsWithAlt.length}/${allImgs.length} images have alt text`,
    });
    maxScore += 10;
    if (altPass) score += 10;
    else if (imgsWithAlt.length > 0) score += 5;

    // 6. Canonical tag
    const canonPass = /<link[^>]+rel=["']canonical["']/i.test(html);
    checks.push({
      label: 'Canonical Tag Present',
      pass: canonPass,
      detail: canonPass ? 'Canonical URL is specified' : 'No canonical tag found',
    });
    maxScore += 10;
    if (canonPass) score += 10;

    // 7. Open Graph tags
    const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
    const ogDesc = /<meta[^>]+property=["']og:description["']/i.test(html);
    const ogPass = ogTitle && ogDesc;
    checks.push({
      label: 'Open Graph Tags (og:title, og:description)',
      pass: ogPass,
      detail: ogPass ? 'OG tags present' : `Missing: ${!ogTitle ? 'og:title ' : ''}${!ogDesc ? 'og:description' : ''}`,
    });
    maxScore += 10;
    if (ogPass) score += 10;

    // 8. HTTPS
    const httpsPass = targetUrl.startsWith('https://');
    checks.push({
      label: 'HTTPS Protocol',
      pass: httpsPass,
      detail: httpsPass ? 'Site uses HTTPS' : 'Site is not using HTTPS',
    });
    maxScore += 10;
    if (httpsPass) score += 10;

    // 9. Structured data
    const schemaPass = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
    checks.push({
      label: 'Structured Data (JSON-LD)',
      pass: schemaPass,
      detail: schemaPass ? 'Structured data detected' : 'No JSON-LD schema found',
    });
    maxScore += 5;
    if (schemaPass) score += 5;

    // 10. Mobile Viewport
    const viewportPass = /<meta[^>]+name=["']viewport["']/i.test(html);
    checks.push({
      label: 'Mobile Viewport',
      pass: viewportPass,
      detail: viewportPass ? 'Viewport meta tag present' : 'Missing viewport meta tag (Not Mobile Friendly)',
    });
    maxScore += 10;
    if (viewportPass) score += 10;

    // 11. HTML Language
    const langMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
    const langPass = !!langMatch;
    checks.push({
      label: 'Language Declaration',
      pass: langPass,
      detail: langPass ? `Language set to "${langMatch[1]}"` : 'Missing <html lang="..."> attribute',
    });
    maxScore += 5;
    if (langPass) score += 5;

    // 12. Favicon
    const faviconPass = /<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(html);
    checks.push({
      label: 'Favicon Presence',
      pass: faviconPass,
      detail: faviconPass ? 'Favicon detected' : 'No Favicon linked in head',
    });
    maxScore += 5;
    if (faviconPass) score += 5;

    // 13. Word Count & Text/HTML Ratio
    const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;
    const cleanText = bodyHtml.replace(/<script[^>]*>.*?<\/script>/gis, '')
                              .replace(/<style[^>]*>.*?<\/style>/gis, '')
                              .replace(/<[^>]+>/g, ' ')
                              .replace(/\s+/g, ' ').trim();
    
    const wordCount = cleanText.split(' ').filter(w => w.length > 0).length;
    const textRatio = html.length > 0 ? Math.round((cleanText.length / html.length) * 100) : 0;
    
    const wordCountPass = wordCount >= 300;
    checks.push({
      label: 'Word Count',
      pass: wordCountPass,
      detail: wordCountPass ? `${wordCount} words (Good)` : `${wordCount} words (Low content, aim for 300+)`,
    });
    maxScore += 10;
    if (wordCountPass) score += 10;
    else if (wordCount >= 100) score += 5;

    const ratioPass = textRatio >= 10;
    checks.push({
      label: 'Text-to-HTML Ratio',
      pass: ratioPass,
      detail: `${textRatio}% text ratio (Ideal is 10%+)`,
    });
    maxScore += 5;
    if (ratioPass) score += 5;

    // 14. Links Analysis
    const aTags = html.match(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
    let internalLinks = 0;
    let externalLinks = 0;
    aTags.forEach(tag => {
      const match = tag.match(/href=["']([^"']+)["']/i);
      if (match) {
        const href = match[1];
        if (href.startsWith('http') && !href.includes(origin)) {
          externalLinks++;
        } else if (!href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
          internalLinks++;
        }
      }
    });

    checks.push({
      label: 'Internal vs External Links',
      pass: internalLinks > 0,
      detail: `${internalLinks} Internal, ${externalLinks} External Links`,
    });
    maxScore += 5;
    if (internalLinks > 0) score += 5;

    // Calculate Final Score (Percentage of Max)
    const finalScore = Math.min(Math.round((score / maxScore) * 100), 100);
    const passing = checks.filter(c => c.pass).length;
    const summary = finalScore >= 80
      ? `Excellent! ${passing}/${checks.length} checks passed. Your page is well-optimized.`
      : finalScore >= 60
      ? `Good. ${passing}/${checks.length} checks passed. Some improvements recommended.`
      : `Needs work. Only ${passing}/${checks.length} checks passed. Review the failed items.`;

    let executiveSummary = "";
    let actionPlan: string[] = [];

    // --- AI GENERATION ---
    const requestKey = typeof openrouter_api_key === 'string' && openrouter_api_key.trim() ? openrouter_api_key.trim() : '';
    const activeOpenRouterKey = requestKey || (OPENROUTER_API_KEY !== 'your_openrouter_api_key_here' ? OPENROUTER_API_KEY : null);
    const hasDirectGeminiKey = GEMINI_API_KEY && GEMINI_API_KEY !== 'undefined';

    if (hasDirectGeminiKey || activeOpenRouterKey) {
      const aiPrompt = `You are a world-class Technical SEO Director. I just ran an SEO audit on a client's website: ${targetUrl}
The score is ${finalScore}/100.
Here are the raw audit results:
${JSON.stringify(checks, null, 2)}

Respond with EXACTLY a JSON object with this exact structure, nothing else:
{
  "executiveSummary": "A punchy, 2-3 sentence professional summary of their SEO health addressing them directly (use 'your website'). Mention specific strengths and critical weaknesses found.",
  "actionPlan": [
    "Most critical, highly specific action to fix a failed check.",
    "Second most important action.",
    "Third action (or a growth suggestion if they passed everything)."
  ]
}`;

      try {
        let aiJsonStr = '';

        if (hasDirectGeminiKey) {
          try {
            const res = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
              contents: [{ parts: [{ text: aiPrompt }] }],
              generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
            }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
            aiJsonStr = res.data.candidates[0].content.parts[0].text;
          } catch (e) { console.warn('Gemini AI Audit failed'); }
        }

        if (!aiJsonStr && activeOpenRouterKey) {
          const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-1.5-flash',
            messages: [{ role: 'user', content: aiPrompt }],
            temperature: 0.2
          }, {
            headers: { 
              'Authorization': `Bearer ${activeOpenRouterKey}`,
              'HTTP-Referer': 'https://pialmahmud.com',
              'X-Title': 'Pial Portfolio SEO Audit'
            },
            timeout: 20000
          });
          aiJsonStr = res.data.choices[0].message.content;
        }

        if (aiJsonStr) {
          // Sometimes AI returns markdown code block, clean it up
          aiJsonStr = aiJsonStr.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(aiJsonStr);
          if (parsed.executiveSummary) executiveSummary = parsed.executiveSummary;
          if (parsed.actionPlan && Array.isArray(parsed.actionPlan)) actionPlan = parsed.actionPlan;
        }
      } catch (err: any) {
        console.error('AI Audit generation failed:', err.response?.data || err.message);
      }
    }

    return res.status(200).json({
      url: targetUrl,
      score: finalScore,
      checks,
      summary,
      executiveSummary,
      actionPlan
    } as AuditResult);

  } catch (e: any) {
    // If fetch fails (CORS, timeout), return a partial audit
    return res.status(200).json({
      url: targetUrl,
      score: 0,
      checks: [{
        label: 'Page Accessibility',
        pass: false,
        detail: `Could not reach page: ${e.message || 'Connection failed or timed out'}`,
      }],
      summary: 'Could not crawl the page. Check if the URL is publicly accessible.',
    });
  }
}
