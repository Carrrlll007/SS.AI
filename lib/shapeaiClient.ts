// lib/shapeaiClient.ts
// Minimal client for sending messages to the SHAPEAI n8n webhook.

export async function sendMessageToShapeAI(
  message: string,
  sessionId: string
): Promise<string> {
  const url = process.env.NEXT_PUBLIC_N8N_CHAT_URL || process.env.N8N_CHAT_URL;
  if (!url) {
    throw new Error('N8N_CHAT_URL (or NEXT_PUBLIC_N8N_CHAT_URL) is not set');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Leave data null; we will handle below.
  }

  if (!res.ok) {
    const errText =
      (data && (data.error || data.message || data.detail)) || `HTTP ${res.status}`;
    throw new Error(`SHAPEAI error: ${errText}`);
  }

  const reply =
    (data && (data.text || data.output || data.message || data.response)) ?? '';

  if (!reply) {
    console.warn('Unexpected SHAPEAI response shape:', data);
    throw new Error('No reply from SHAPEAI');
  }

  return reply;
}
