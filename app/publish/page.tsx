'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

export default function PublishPage() {
  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-30" />
      <div className="relative mx-auto max-w-5xl px-6 py-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
          <h1 className="text-3xl font-bold text-white">Publish faster, without a dev team</h1>
          <p className="text-slate-300 max-w-3xl">
            You set the messaging and goals - StudioShape handles the build, responsive layout, and the
            underlying site config. Go live in minutes with consistent performance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-panel border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Launch-ready defaults</CardTitle>
              <CardDescription className="text-slate-400">
                Clean markup, mobile-first spacing, and brand-safe CTAs baked in.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Publishing is instant - no deployments to manage, no staging servers to keep in sync.
            </CardContent>
          </Card>

          <Card className="glass-panel border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Ops handled for you</CardTitle>
              <CardDescription className="text-slate-400">
                Hosting, configuration, and scaling concerns are abstracted away.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Add more pages and sections without worrying about infrastructure drift or broken layouts.
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
