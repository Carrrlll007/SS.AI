import { NextResponse } from 'next/server';
import type { StudioShapeSite } from '@/lib/types';

const GEMINI_MODEL = 'gemini-1.5-flash-latest';
const OPENAI_MODEL = 'gpt-4o-mini';

const systemPrompt =
  'You are StudioShape’s AI site generator. Analyze the user’s description of their business, audience, and goals. ' +
  'Think step by step about the business, main audience, primary goal (leads, bookings, sales, portfolio), and tone. ' +
  'Choose a layoutPreset from: "minimal", "product", "portfolio", "dark". ' +
  'Produce a complete StudioShapeSite object with concise, high-quality copy. ' +
  'Use hex colors for theme values and keep the copy realistic and benefit-driven. ' +
  'Respond with ONLY valid JSON matching the StudioShapeSite TypeScript shape. No markdown, no extra keys.';

async function callOpenAI(prompt: string, siteId?: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key');
  }
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt || 'Generate a StudioShapeSite for a new project.' },
  ];
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.6,
      messages,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }
  const completion = await response.json();
  const content = completion?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No AI content returned');
  const parsed: StudioShapeSite = JSON.parse(content);
  if (siteId) parsed.id = siteId;
  return parsed;
}

async function callGemini(prompt: string, siteId?: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key');
  }
  const fullPrompt = `${systemPrompt}\n\nUser prompt:\n${prompt || 'Generate a StudioShapeSite for a new project.'}`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
        },
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${errorText}`);
  }
  const completion = await response.json();
  const text = completion?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No Gemini content returned');
  const parsed: StudioShapeSite = JSON.parse(text);
  if (siteId) parsed.id = siteId;
  return parsed;
}

export async function POST(request: Request) {
  try {
    const { prompt, siteId } = await request.json();
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

    if (!hasGemini && !hasOpenAI) {
      return NextResponse.json({ error: 'No AI provider configured' }, { status: 500 });
    }

    const config = hasGemini
      ? await callGemini(prompt, siteId)
      : await callOpenAI(prompt, siteId);

    return NextResponse.json({ config });
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : 'Unexpected error generating site';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
