import type { NextApiRequest, NextApiResponse } from 'next';

interface AuditResult {
  url: string;
  score: number;
  checks: {
    label: string;
    pass: boolean;
    detail: string;
  }[];
  summary: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 SEOAuditBot/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    const html = await response.text();
    const checks: AuditResult['checks'] = [];
    let score = 0;

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
    if (h1Pass) score += 15;

    // 4. H2 count
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h2Pass = h2Count >= 2;
    checks.push({
      label: 'H2 Headings (min 2)',
      pass: h2Pass,
      detail: `${h2Count} H2 tags found`,
    });
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
    if (altPass) score += 10;
    else if (imgsWithAlt.length > 0) score += 5;

    // 6. Canonical tag
    const canonPass = /<link[^>]+rel=["']canonical["']/i.test(html);
    checks.push({
      label: 'Canonical Tag Present',
      pass: canonPass,
      detail: canonPass ? 'Canonical URL is specified' : 'No canonical tag found',
    });
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
    if (ogPass) score += 10;

    // 8. HTTPS
    const httpsPass = targetUrl.startsWith('https://');
    checks.push({
      label: 'HTTPS Protocol',
      pass: httpsPass,
      detail: httpsPass ? 'Site uses HTTPS' : 'Site is not using HTTPS',
    });
    if (httpsPass) score += 10;

    // 9. Structured data
    const schemaPass = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
    checks.push({
      label: 'Structured Data (JSON-LD)',
      pass: schemaPass,
      detail: schemaPass ? 'Structured data detected' : 'No JSON-LD schema found',
    });
    if (schemaPass) score += 5;

    const finalScore = Math.min(score, 100);
    const passing = checks.filter(c => c.pass).length;
    const summary = finalScore >= 80
      ? `Excellent! ${passing}/${checks.length} checks passed. Your page is well-optimized.`
      : finalScore >= 60
      ? `Good. ${passing}/${checks.length} checks passed. Some improvements recommended.`
      : `Needs work. Only ${passing}/${checks.length} checks passed. Review the failed items.`;

    return res.status(200).json({
      url: targetUrl,
      score: finalScore,
      checks,
      summary,
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
