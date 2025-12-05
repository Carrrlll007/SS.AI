import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = process.env.N8N_CHAT_URL || process.env.NEXT_PUBLIC_N8N_CHAT_URL;
  if (!url) {
    return NextResponse.json({ error: 'N8N_CHAT_URL is not set on the server' }, { status: 500 });
  }

  let body: { message?: string; sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: body.message,
        sessionId: body.sessionId,
      }),
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || `Upstream error ${upstream.status}` },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data ?? { message: 'No data returned from SHAPEAI' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to reach SHAPEAI upstream' },
      { status: 500 }
    );
  }
}
