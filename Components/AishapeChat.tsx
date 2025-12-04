'use client';

import React, { useState } from 'react';
import { SiteTemplate } from '@/lib/aishape/model';
import { applyUserInstructionToSite, suggestImprovements } from '@/lib/aishape/engine';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type AishapeChatProps = {
  siteConfig: SiteTemplate;
  onSiteConfigChange: (next: SiteTemplate) => void;
  onUndo?: () => void;
};

const id = () => Math.random().toString(36).slice(2, 10);

export function AishapeChat({ siteConfig, onSiteConfigChange, onUndo }: AishapeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm AISHAPE. Tell me what you want to change (text, sections, theme) and I'll update the page for you. You can also say things like 'make it more minimal' or 'add a pricing section'.",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: id(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);

    const lower = input.toLowerCase();
    const result =
      lower.includes('improve') ||
      lower.includes('professional') ||
      lower.includes('playful') ||
      lower.includes('minimal') ||
      lower.includes('premium') ||
      lower.includes('luxury')
        ? suggestImprovements(input, siteConfig)
        : applyUserInstructionToSite(input, siteConfig);

    onSiteConfigChange(result.updatedTemplate);

    const assistant: ChatMessage = {
      id: id(),
      role: 'assistant',
      content: result.assistantMessage,
    };
    setMessages((prev) => [...prev, assistant]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">AISHAPE Chat</p>
          <p className="text-xs text-slate-300">Persistent assistant while you build.</p>
        </div>
        {onUndo && (
          <Button variant="outline" size="sm" onClick={onUndo}>
            Undo
          </Button>
        )}
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
              m.role === 'assistant'
                ? 'bg-white/5 text-slate-100'
                : 'ml-auto bg-gradient-to-r from-brand-500 to-cyan-400 text-white'
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-white/10 p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AISHAPE anything..."
          className="flex-1"
        />
        <Button type="button" onClick={handleSend} disabled={!input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
