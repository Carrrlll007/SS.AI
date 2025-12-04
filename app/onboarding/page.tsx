'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Welcome! I am AISHAPE, your co-pilot. I will stay with you as you build your site. Ask me anything or describe what you want to create.',
      },
    ]);
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const preview = `Starter template for: ${prompt.trim()}`;
    setGeneratedPreview(preview);
    router.push(`/sites/${encodeURIComponent('new')}/edit?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: Message = { role: 'user', content: chatInput.trim() };
    const botMsg: Message = {
      role: 'assistant',
      content: `I am AISHAPE. I will help refine your layout and copy. For now, I echo: ${chatInput.trim()}`,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to AISHAPE</h1>
          <p className="text-slate-600">Your AI co-pilot for building your website step by step.</p>
          <p className="text-sm text-slate-500">You can always change everything later. AISHAPE is here to help you refine your design.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.8fr]">
          <div className="space-y-4">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-md">
              <CardHeader className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-sm font-bold text-white">
                  AI
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900">How AISHAPE works</CardTitle>
                  <CardDescription className="text-slate-600">A quick walkthrough of your main controls.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-700">
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Describe the website you want.</li>
                  <li>AISHAPE generates a starter template.</li>
                  <li>You customize layout and content in the editor.</li>
                  <li>Use the chat anytime to ask for changes or guidance.</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">What kind of website do you want to build?</CardTitle>
                <CardDescription className="text-slate-600">
                  Describe your goal, audience, and any style preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A modern portfolio site for a photographer with a dark theme and a gallery page..."
                  className="min-h-[140px]"
                />
                <Button
                  className="w-full rounded-xl py-3 text-base"
                  disabled={!prompt.trim()}
                  onClick={handleGenerate}
                >
                  Generate Starter Site
                </Button>
                {generatedPreview && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    Preview of your generated template: {generatedPreview}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="h-full rounded-2xl border-slate-200 bg-white shadow-md flex flex-col">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">AISHAPE Chat</CardTitle>
              <CardDescription className="text-slate-600">
                Chat stays with you as you build your site.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-3 pt-4">
              <div className="flex-1 space-y-3 overflow-auto rounded-xl border border-slate-100 p-3">
                {messages.map((m, idx) => (
                  <div
                    key={`${m.role}-${idx}`}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'assistant'
                        ? 'bg-slate-100 text-slate-800'
                        : 'ml-auto bg-gradient-to-r from-brand-500 to-cyan-400 text-white'
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AISHAPE anything..."
                  className="flex-1"
                />
                <Button type="button" onClick={handleSend} disabled={!chatInput.trim()}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
