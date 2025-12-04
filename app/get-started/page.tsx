'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

const steps = [
  'Describe your business, audience, and the action you want visitors to take.',
  'Pick a layout style: product, portfolio, minimal, or dark.',
  'Let the AI build your first version with hero, features, story, and stats.',
  'Customize sections, theme, and copy with the Studio editor.',
  'Connect a domain and publish when you are ready.',
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-25" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start">
        <div className="space-y-4 lg:w-1/2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-lg font-bold text-white shadow-brand-900/40 shadow">
              SS
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">StudioShape</p>
              <p className="text-sm font-semibold text-white">Create. Preview. Launch.</p>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white">Get started with StudioShape</h1>
          <p className="text-lg text-slate-300">
            Answer a few questions or write a short brief. We will generate a site for you, then you can refine it in the Studio.
            You focus on content, design, and strategy — StudioShape handles the code, layout, hosting, and scalability.
          </p>
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Flow</p>
            <div className="space-y-2 text-slate-200">
              {steps.map((item, idx) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <Card className="rounded-3xl border-white/10 bg-white/5 shadow-xl shadow-brand-900/50">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-white">Ready to shape?</CardTitle>
              <CardDescription className="text-slate-300">
                Jump into the Studio to create or edit your sites. You can always return to this flow for a new project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full rounded-xl py-3 text-base" href="/dashboard">
                Open Studio
              </Button>
              <p className="text-sm text-slate-300 text-center">
                Already created a site? Go to your dashboard to keep editing or previewing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
