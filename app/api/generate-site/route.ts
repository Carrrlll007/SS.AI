import { NextResponse } from 'next/server';
import type { StudioShapeSite } from '@/lib/types';

// Allow overriding the Gemini model; default to a widely available model. We will try multiple endpoints.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const systemPrompt =
  'You are StudioShape’s AI site generator. Analyze the user’s description of their business, audience, and goals. ' +
  'Think step by step about the business, main audience, primary goal (leads, bookings, sales, portfolio), and tone. ' +
  'Choose a layoutPreset from: "minimal", "product", "portfolio", "dark". ' +
  'Produce a complete StudioShapeSite object with concise, high-quality copy. ' +
  'Use hex colors for theme values and keep the copy realistic and benefit-driven. ' +
  'Respond with ONLY valid JSON matching the StudioShapeSite TypeScript shape. No markdown, no extra keys.';

async function callGemini(prompt: string, siteId?: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key');
  }
  const fullPrompt = `${systemPrompt}\n\nUser prompt:\n${prompt || 'Generate a StudioShapeSite for a new project.'}`;
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
  ];

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: fullPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.6,
    },
  };

  const errors: string[] = [];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`Endpoint ${url} => ${errorText}`);
        continue;
      }

      const completion = await response.json();
      const text = completion?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        errors.push(`Endpoint ${url} => empty content`);
        continue;
      }
      const parsed: StudioShapeSite = JSON.parse(text);
      if (siteId) parsed.id = siteId;
      return parsed;
    } catch (err: any) {
      errors.push(`Endpoint ${url} => ${err?.message || 'unknown error'}`);
      continue;
    }
  }

  throw new Error(`Gemini request failed. Tried multiple endpoints/models. Errors: ${errors.join(' | ')}`);
}

export async function POST(request: Request) {
  try {
    const { prompt, siteId } = await request.json();
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);

    if (!hasGemini) {
      return NextResponse.json({ error: 'No AI provider configured: set GEMINI_API_KEY' }, { status: 500 });
    }

    const config = await callGemini(prompt, siteId);

    return NextResponse.json({ config });
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Unexpected error generating site';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
