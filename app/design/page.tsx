'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-30" />
      <div className="relative mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
          <h1 className="text-3xl font-bold text-white">Design with on-brand blocks</h1>
          <p className="text-slate-300 max-w-3xl">
            Focus on content and strategy - StudioShape supplies the on-brand layouts, reusable sections,
            responsive behavior, and the theme guardrails so you do not chase stray CSS.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-panel border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Reusable sections</CardTitle>
              <CardDescription className="text-slate-400">
                Mix heroes, features, text, and stats without reinventing layouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Everything stays on-brand: typography, colors, spacing, and buttons are consistent across
              every section and page.
            </CardContent>
          </Card>

          <Card className="glass-panel border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Your content first</CardTitle>
              <CardDescription className="text-slate-400">
                Write the story, set the goals, and let StudioShape handle the presentation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              We take care of the code, layout responsiveness, and hosting model so you can stay in the flow.
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Link href="/start">
            <Button>Start shaping</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-white/20 bg-white/5">
              Open Studio
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
