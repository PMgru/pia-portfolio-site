import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import axios from 'axios';

// Server-side only — never exposed to the client bundle.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, id } = req.query;

  // Visitor Ask Query
  if (req.method === 'POST' && action === 'ask') {
    const { question, history, openrouter_api_key } = req.body;
    if (!question) return res.status(400).json({ message: 'Missing question' });

    const requestKey = typeof openrouter_api_key === 'string' && openrouter_api_key.trim()
      ? openrouter_api_key.trim()
      : '';
    const apiKey = requestKey || GEMINI_API_KEY;

    const knowledge = JsonDb.getCollection('chatbot_knowledge');

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    // Determine the active keys
    // If user provided a key via frontend, use it for OpenRouter. Otherwise fallback to env.
    const activeOpenRouterKey = requestKey || (OPENROUTER_API_KEY !== 'your_openrouter_api_key_here' ? OPENROUTER_API_KEY : null);
    
    // We only try Tier 1 if we have a direct Gemini env key
    const hasDirectGeminiKey = GEMINI_API_KEY && GEMINI_API_KEY !== 'undefined';

    console.log('--- CHATBOT DEBUG ---');
    console.log('Frontend provided key:', requestKey ? 'YES' : 'NO');
    console.log('ENV OpenRouter key:', OPENROUTER_API_KEY ? 'YES' : 'NO');
    console.log('Active OpenRouter key:', activeOpenRouterKey ? 'YES' : 'NO');
    console.log('Has Direct Gemini key:', hasDirectGeminiKey ? 'YES' : 'NO');
    console.log('---------------------');

    // If neither key is available, we can't do AI
    if (!hasDirectGeminiKey && !activeOpenRouterKey) {
      // Fallback to heuristic immediately if no keys
    } else {
      try {
        const kbContext = knowledge.map(k => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');
        const systemPrompt = `You are an elite, highly persuasive human Sales Executive & Concierge for Pial Mahmud, a Top 1% SEO & Digital Marketing Expert. You act completely human—warm, empathetic, extremely smart, confident, and highly consultative. Your sole objective is to CONVERT visitors into paying clients and drive sales.

Core Rules & Behavior:
1. EXTREME HUMAN LIKENESS: Never mention you are an AI, bot, or virtual assistant. You are a real human sales expert on Pial's team. Use conversational, friendly, empathetic, and persuasive language. Show excitement for their business growth.
2. SMART CONSULTATION: Build trust instantly. If they ask about services, don't just list them; explain the VALUE and how Pial's data-driven strategies guarantee ROI and exponential business growth.
3. PROFESSIONAL SELLING: Do not just give dry information. Always guide the conversation towards closing a deal, booking a consultation, or starting a project.
4. AUTHORIZED TO NEGOTIATE & OFFER DISCOUNTS: You have full authority to negotiate pricing and strategically offer custom discounts (e.g., 10% to 30% off, or a free initial audit) to close a deal on the spot. If the client seems hesitant, asks about pricing, or complains about budget, immediately offer a tailored discount. Frame it as a "special limited-time offer" you are applying for them today.
5. OBJECTION HANDLING: Like an expert salesman, smoothly handle objections. If they say it's too expensive, pivot to the ROI and offer a discount.
6. KNOWLEDGE & PIVOTING: Base your facts on the Knowledge Base. If you don't know something, confidently pivot to how Pial can solve their problems and urge them to take action.
7. ACTION-ORIENTED CLOSING: Keep responses engaging, punchy, and concise. Always end every message with a strong call-to-action (e.g., "Shall we lock in this 20% discount for you right now?", "Can I set up a quick 15-min discovery call with Pial to get started?").
8. LEAD CAPTURE: If they are ready to buy or accept a discount, ask for their email/phone number to follow up.
9. BREVITY: Keep your responses extremely short, punchy, and impactful (1 to 3 sentences max). Do NOT write long paragraphs.

Knowledge Base:
${kbContext}

Conversation History:
${(history || []).map((h: any) => `${h.sender === 'user' ? 'Client' : "Pial's Assistant"}: ${h.text}`).join('\n')}
Client: ${question}
Pial's Assistant:`;

        const messagesForOpenRouter = [
           { role: 'system', content: systemPrompt }
        ];

        let answer = null;
        let finalSource = '';

        // TIER 1: Direct Google API (gemini-flash-latest) - Only if we have the specific direct key
        if (hasDirectGeminiKey) {
          try {
            const res1 = await axios.post(
              `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
              {
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 100 }
              },
              { headers: { 'Content-Type': 'application/json' }, timeout: 15000 } // Back to 15s because 8s is timing out!
            );
            answer = res1.data.candidates[0].content.parts[0].text.trim();
            finalSource = 'ai_engine_tier_1_gemini';
          } catch (err1: any) {
            console.warn('Tier 1 (Direct Gemini) failed:', err1?.response?.data || err1.message);
          }
        }

        // TIER 2: OpenRouter (google/gemini-1.5-flash)
        if (!answer && activeOpenRouterKey) {
          try {
            const res2 = await axios.post(
              'https://openrouter.ai/api/v1/chat/completions',
              {
                model: 'google/gemini-1.5-flash',
                messages: messagesForOpenRouter,
                temperature: 0.7,
                max_tokens: 100
              },
              {
                headers: {
                  'Authorization': `Bearer ${activeOpenRouterKey}`,
                  'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                  'Content-Type': 'application/json'
                },
                timeout: 12000
              }
            );
            answer = res2.data.choices[0].message.content.trim();
            finalSource = 'ai_engine_tier_2_or_gemini';
          } catch (err2: any) {
            console.warn('Tier 2 (OR Gemini) failed:', err2?.response?.data || err2.message);

            // TIER 3: OpenRouter (Llama 3.1 8B Free)
            try {
              const res3 = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                  model: 'meta-llama/llama-3.1-8b-instruct:free',
                  messages: messagesForOpenRouter,
                  temperature: 0.7,
                  max_tokens: 100
                },
                {
                  headers: {
                    'Authorization': `Bearer ${activeOpenRouterKey}`,
                    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                    'Content-Type': 'application/json'
                  },
                  timeout: 12000
                }
              );
              answer = res3.data.choices[0].message.content.trim();
              finalSource = 'ai_engine_tier_3_or_llama';
            } catch (err3: any) {
              console.warn('Tier 3 (OR Llama) failed:', err3?.response?.data || err3.message);
            }
          }
        }

        if (answer) {
          return res.status(200).json({ answer, source: finalSource });
        }
        console.error('All AI Tiers failed, utilizing heuristic fallback');
      } catch (fatalErr: any) {
        console.error('Fatal error during AI cascade evaluation', fatalErr.message);
      }
    }

    // 3. Intelligent fallback using local KB context matching
    const fallbackAnswers = [
      "I'd love to help you with that! Pial is an expert in technical SEO (boosting Gloria Tech by 340%) and growth marketing. Could you specify if you are looking to increase search traffic or optimize paid ads?",
      "Pial Mahmud offers customized growth strategies starting at $999/month. You can schedule a free 15-minute consultation directly in the contact form at the bottom of the page!",
      "For details regarding specific services like dynamic retargeting or technical audits, check the 'Services' section or send Pial a direct message.",
      "If you'd like to get in touch, you can email Pial directly at hello@pialmahmud.com or WhatsApp him at +8801718223748."
    ];
    const defaultAnswer = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
    return res.status(200).json({ answer: defaultAnswer, source: 'heuristic_engine' });
  }

  // Knowledge base CRUD (Admin only). GET stays public so the chatbot widget
  // and admin can read entries; every mutation requires an admin session.
  if (req.method === 'GET') {
    const knowledge = JsonDb.getCollection('chatbot_knowledge');
    return res.status(200).json(knowledge);
  }

  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const newK = JsonDb.insert('chatbot_knowledge', req.body);
    return res.status(201).json(newK);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.update('chatbot_knowledge', id, req.body);
    if (!success) return res.status(404).json({ message: 'Knowledge entry not found' });
    return res.status(200).json({ message: 'Knowledge updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.delete('chatbot_knowledge', id);
    if (!success) return res.status(404).json({ message: 'Knowledge entry not found' });
    return res.status(200).json({ message: 'Knowledge deleted successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
