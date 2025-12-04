'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sendMessageToShapeAI } from '@/lib/shapeaiClient';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export function ShapeAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useMemo(
    () =>
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Math.random().toString(36).slice(2)}`,
    []
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendMessageToShapeAI(text, sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `(Error: ${err?.message || 'Failed to reach SHAPEAI'})` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSend();
  };

  return (
    <div className="flex h-full w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
        Chat with SHAPEAI
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4 text-sm text-slate-900"
      >
        {messages.length === 0 && (
          <p className="text-slate-500">Ask me about websites, math, or strategy.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 ${
                m.role === 'user'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-slate-900 shadow-sm border border-slate-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-xs text-slate-500">Thinking…</div>}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-slate-200 px-4 py-3">
        <input
          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
