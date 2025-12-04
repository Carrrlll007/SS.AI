'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import SiteRenderer from '@/Components/site/SiteRenderer';
import { buildDefaultStudioShapeSite } from '@/lib/dataStore';

const demoSite = buildDefaultStudioShapeSite('demo-preview', 'StudioShape Demo');

export default function PreviewDemoPage() {
  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-30" />
      <div className="relative mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
          <h1 className="text-3xl font-bold text-white">See a live StudioShape page</h1>
          <p className="text-slate-300 max-w-3xl">
            This demo shows a real StudioShape site rendered with reusable sections, the dark brand theme,
            and live preview. You focus on content, design, and strategy; StudioShape takes care of code,
            layout, hosting, and scalability.
          </p>
        </div>

        <Card className="glass-panel border border-white/10">
          <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-white text-lg">Live demo preview</CardTitle>
              <CardDescription className="text-slate-400">
                Hero, features, story, and stats rendered with your theme guardrails.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/start">
                <Button size="sm">Start shaping</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="border-white/20 bg-white/5 text-xs">
                  Open Studio
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[80vh] overflow-auto">
              <SiteRenderer site={demoSite} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
