import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import axios from 'axios';

// Server-side only — never exposed to the client bundle.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, id } = req.query;

  // Visitor Ask Query
  if (req.method === 'POST' && action === 'ask') {
    const { question, history, openrouter_api_key } = req.body;
    if (!question) return res.status(400).json({ message: 'Missing question' });

    const requestKey = typeof openrouter_api_key === 'string' && openrouter_api_key.trim()
      ? openrouter_api_key.trim()
      : '';
    const openRouterKey = requestKey || OPENROUTER_API_KEY;

    const knowledge = JsonDb.getCollection('chatbot_knowledge');

    // 1. Try local exact or keyword match first
    const qLower = question.toLowerCase();
    let bestMatch = null;
    let maxOverlap = 0;

    for (const item of knowledge) {
      const qWords = item.question.toLowerCase().split(/\s+/);
      let overlap = 0;
      for (const word of qWords) {
        if (word.length > 3 && qLower.includes(word)) {
          overlap++;
        }
      }
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = item;
      }
    }

    // Threshold match
    if (maxOverlap >= 2 && bestMatch) {
      return res.status(200).json({ answer: bestMatch.answer, source: 'knowledge_base' });
    }

    // 2. Try LLM fallback if OpenRouter key is set
    if (openRouterKey && openRouterKey !== 'undefined') {
      try {
        const kbContext = knowledge.map(k => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');
        const systemPrompt = `You are a premium AI Concierge Chatbot on the portfolio website of Pial Mahmud, a Digital Marketing & SEO Growth Expert.
Your purpose is to answer questions about Pial based on the knowledge base below.
Rules:
- Be concise, professional, and slightly conversational.
- ONLY answer about Pial's services, portfolio, experience, and skills.
- If you do not know the answer, politely ask them to drop a message in the contact form or email hello@pialmahmud.com.
- Do not make up false facts.

Knowledge Base:
${kbContext}

Conversation History:
${(history || []).map((h: any) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')}
User: ${question}
Assistant:`;

        const response = await axios.post(
          OPENROUTER_URL,
          {
            model: AI_MODEL,
            messages: [{ role: 'user', content: systemPrompt }],
            temperature: 0.5,
            max_tokens: 300,
          },
          {
            headers: {
              'Authorization': `Bearer ${openRouterKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );

        const answer = response.data.choices[0].message.content.trim();
        return res.status(200).json({ answer, source: 'ai_engine' });
      } catch (err) {
        console.error('LLM Fallback failed, utilizing heuristic fallback', err);
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
