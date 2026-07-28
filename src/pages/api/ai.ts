import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/auth';
import axios from 'axios';

// Server-side only — never exposed to the client bundle.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Only authenticated admins can trigger AI generation (it spends quota).
  if (!requireAdmin(req, res)) return;

  const { type, content, context, openrouter_api_key } = req.body;
  const requestKey = typeof openrouter_api_key === 'string' && openrouter_api_key.trim()
    ? openrouter_api_key.trim()
    : '';
  const apiKey = requestKey || OPENROUTER_API_KEY;

  if (!type) {
    return res.status(400).json({ message: 'Missing generation type' });
  }

  // 1. Try to fetch from LLM if API Key is present
  if (apiKey && apiKey !== 'undefined') {
    try {
      let prompt = '';
      if (type === 'seo_meta') {
        prompt = `You are a world-class SEO specialist. Optimize this content for Search Engines. Generate a high-CTR Meta Title (under 60 characters) and Meta Description (under 160 characters) based on this page text: "${content}". Focus on keyword: "${context || 'Digital Marketing'}". Output as raw JSON with keys: "meta_title" and "meta_description" only. Do not include markdown formatting or extra text.`;
      } else if (type === 'refine_content') {
        prompt = `You are a premium B2B copywriter. Re-write and improve the following text for clarity, authority, and emotional impact: "${content}". Context/Target: "${context || 'General Portfolio Page'}". Keep the tone modern and highly professional.`;
      } else if (type === 'suggest_ideas') {
        prompt = `You are a digital growth marketing strategist. Generate 5 premium blog post ideas or portfolio sections that Pial Mahmud (an AI-powered digital marketing and SEO expert) can write. Provide titles and short descriptions for each. Format as a bulleted list.`;
      } else if (type === 'generate_blog') {
        prompt = `You are a senior SEO content strategist and writer. Write a complete, SEO-optimized blog post titled: "${content}". Target keyword: "${context || content}". The article must: 1) Start with a compelling introduction, 2) Include at least 3 H2 headings and 2 H3 subheadings, 3) Be minimum 800 words, 4) Include a conclusion with a call-to-action, 5) Be written in a professional yet engaging tone for a business audience. Format the output in clean HTML using <h2>, <h3>, and <p> tags only.`;
      } else {
        prompt = `Write a professional digital marketing bio paragraph about Pial Mahmud based on these keywords: "${content}". Keep it engaging and authority-building.`;
      }

      const response = await axios.post(
        OPENROUTER_URL,
        {
          model: AI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 7000,
        }
      );

      const aiText = response.data.choices[0].message.content.trim();
      return res.status(200).json({ result: aiText, source: 'ai_copilot' });
    } catch (e) {
      console.error('OpenRouter call failed, falling back to mock generator', e);
    }
  }

  // 2. Mock Generator Fallback (Ensures 100% functionality without API keys)
  let result = '';

  if (type === 'seo_meta') {
    const focusKeyword = context || 'SEO Expert';
    result = JSON.stringify({
      meta_title: `Pial Mahmud | Leading AI-Powered ${focusKeyword} & Digital Marketer`,
      meta_description: `Optimize search performance with Pial Mahmud. Scaling businesses using data-driven ${focusKeyword} frameworks and conversion optimization strategies.`
    });
  } else if (type === 'refine_content') {
    result = `Pial Mahmud is a next-generation Digital Growth Architect and AI Marketing Strategist. By combining technical SEO, intent-driven content structures, and advanced conversion psychology, he engineers digital conversion paths that drive measurable pipeline revenue.`;
  } else if (type === 'suggest_ideas') {
    result = `1. "The Semantic Shift: Master Entity-Based SEO for 2026 search engines."
2. "Why Traditional Keywords Are Stagnating: A guide to vector-intent search indexing."
3. "The E-E-A-T Blueprint: How to build high-authority guest-outreach structures that search engines trust."
4. "Conversion Loops: Engineering micro-interactions to double organic page click-to-leads."
5. "AI-Driven Attribution: Modeling client paths across Google Search Console and dynamic retargeting paths."`;
  } else if (type === 'generate_blog') {
    const keyword = context || content || 'Digital Marketing';
    result = `<h2>Introduction: Why ${keyword} Matters in 2025</h2>
<p>In an era where digital competition intensifies daily, mastering <strong>${keyword}</strong> has become essential for sustainable business growth. Brands that fail to adapt are quickly outpaced by competitors who leverage data-driven strategies and AI-powered tools to capture market share.</p>
<p>This comprehensive guide breaks down proven methodologies that top-performing companies use to dominate search rankings, increase qualified traffic, and convert visitors into loyal customers.</p>

<h2>The Foundation: Building a Data-Driven ${keyword} Strategy</h2>
<p>Every successful campaign begins with a solid strategic foundation. Without clear goals, measurable KPIs, and audience insights, even the most creative tactics will underperform.</p>
<h3>1. Define Your Target Audience</h3>
<p>Before launching any campaign, conduct deep audience research. Analyze demographics, behavioral patterns, search intent, and pain points. Tools like Google Analytics, SEMrush, and Ahrefs provide invaluable data on what your audience searches for and how they consume content.</p>
<h3>2. Keyword Research and Topic Clustering</h3>
<p>Modern SEO goes beyond individual keywords. Topic clustering — grouping related keywords around a central pillar topic — signals topical authority to search engines. Map out your content architecture before writing a single word.</p>

<h2>Advanced Tactics to Accelerate Results</h2>
<p>Once your foundation is set, layer in advanced techniques that amplify your results exponentially.</p>
<h3>Leveraging AI Tools for Scale</h3>
<p>AI-powered platforms now enable marketers to analyze competitive landscapes, identify content gaps, and optimize existing pages at unprecedented speed. Integrating these tools into your workflow is no longer optional — it's a competitive necessity.</p>
<p>From automated internal linking recommendations to real-time SERP analysis, AI transforms how teams prioritize and execute their ${keyword} efforts.</p>

<h2>Measuring Success: KPIs That Actually Matter</h2>
<p>Vanity metrics like raw traffic numbers tell an incomplete story. Focus instead on metrics directly tied to business outcomes: organic conversion rate, customer acquisition cost via organic, and revenue attributed to content marketing.</p>
<p>Set up proper attribution models in Google Analytics to trace customer journeys from first organic touch to final conversion. This data empowers you to double down on what works and eliminate wasteful spend.</p>

<h2>Conclusion: Take Action Today</h2>
<p>The gap between brands that invest in <strong>${keyword}</strong> strategically and those that treat it as an afterthought grows wider each month. The search landscape rewards expertise, consistency, and user-focused content.</p>
<p>Ready to transform your digital presence? <strong>Contact Pial Mahmud today</strong> for a personalized growth strategy audit and discover exactly what it takes to dominate your niche online.</p>`;
  } else {
    result = `As an elite Digital Marketer and SEO Growth Specialist, Pial Mahmud leverages next-gen artificial intelligence tools, programmatic topic clusters, and conversion-centered web architectures to double organic visitor acquisitions and scale business margins.`;
  }

  return res.status(200).json({ result, source: 'local_copilot' });
}
