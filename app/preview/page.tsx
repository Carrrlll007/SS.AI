'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import SiteRenderer from '@/Components/site/SiteRenderer';
import { buildDefaultStudioShapeSite } from '@/lib/dataStore';

const demoSite = buildDefaultStudioShapeSite('demo-preview', 'StudioShape Demo');

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-30" />
      <div className="relative mx-auto max-w-5xl px-6 py-12 space-y-10">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
          <h1 className="text-3xl font-bold text-white">Preview before you publish</h1>
          <p className="text-slate-300 max-w-3xl">
            Iterate with confidence. StudioShape gives you a live preview of your theme, sections, and copy -
            so stakeholders can sign off before anything ships. We handle the responsive behavior and hosting
            details behind the scenes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-panel border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Live confidence</CardTitle>
              <CardDescription className="text-slate-400">
                Preview exactly what visitors will see across hero, features, text, and stats.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              No surprises on launch day: layout, spacing, and CTAs stay locked to your theme.
            </CardContent>
          </Card>

          <Card className="glass-panel border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Content-first workflow</CardTitle>
              <CardDescription className="text-slate-400">
                Edit messaging and goals while StudioShape keeps the structure intact.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              You focus on copy and business outcomes; we take care of the code and scalability.
            </CardContent>
          </Card>
        </div>

        <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live demo</p>
              <p className="text-sm text-white">StudioShape demo layout</p>
            </div>
            <Link href="/start">
              <Button variant="outline" className="border-white/20 bg-white/5 text-xs">
                Start shaping
              </Button>
            </Link>
          </div>
          <div className="max-h-[80vh] overflow-auto">
            <SiteRenderer site={demoSite} />
          </div>
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
