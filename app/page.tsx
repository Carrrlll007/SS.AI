'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ArrowRight, Sparkles, Wand2, Layout, Palette } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import type { StudioShapeSite } from '@/lib/types';

const steps = [
  { title: 'Pick a workspace', body: 'Sign up to StudioShape and set your brand basics in minutes.' },
  { title: 'Describe your goals', body: 'Share your business, audience, and the primary action you want.' },
  { title: 'Generate with AI', body: 'Let StudioShape create your layout, hero, features, story, and stats.' },
  { title: 'Customize sections', body: 'Edit copy, reorder blocks, and lock in theme guardrails.' },
  { title: 'Preview instantly', body: 'See changes live with your chosen preset and theme.' },
  { title: 'Publish and connect', body: 'Share your site, connect a domain, and stay on-brand.' },
  { title: 'Optimize and grow', body: 'Use stats, SEO tips, and iterations to keep improving.' },
];

const templateCards = [
  { title: 'Product launch', tag: 'Landing', accent: 'from-brand-500 to-cyan-400' },
  { title: 'Creative portfolio', tag: 'Portfolio', accent: 'from-emerald-500 to-teal-400' },
  { title: 'SaaS starter', tag: 'SaaS', accent: 'from-indigo-500 to-purple-500' },
  { title: 'Local services', tag: 'Services', accent: 'from-amber-500 to-orange-400' },
];

const FeatureBubble = ({ label }: { label: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100 ring-1 ring-white/15">
    <Sparkles className="h-4 w-4 text-brand-200" />
    {label}
  </div>
);

export default function Home() {
  const router = useRouter();
  const [shapePrompt, setShapePrompt] = useState(
    'Build a bold landing page for SHAPEAI that explains how it designs and ships multi-agent sites.'
  );
  const [shapeConfig, setShapeConfig] = useState<StudioShapeSite | null>(null);
  const [shapeMessages, setShapeMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [shapeLoading, setShapeLoading] = useState(false);
  const [shapeError, setShapeError] = useState<string | null>(null);

  const handleHeroSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/signup');
  };

  const handleShapeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = shapePrompt.trim();
    if (!prompt) return;

    setShapeLoading(true);
    setShapeError(null);
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setShapeError(data?.error || 'Something went wrong calling SHAPEAI.');
        return;
      }
      const config = data?.config as StudioShapeSite;
      setShapeConfig(config);
      setShapeMessages((prev) => [
        ...prev,
        { role: 'user', text: prompt },
        {
          role: 'assistant',
          text:
            `Layout: ${config.layoutPreset}. Hero: ${config.sections?.hero?.title || 'n/a'}. ` +
            `Features: ${config.sections?.features?.items?.length || 0} highlights.`,
        },
      ]);
    } catch (err: any) {
      setShapeError(typeof err?.message === 'string' ? err.message : 'Unexpected SHAPEAI error.');
    } finally {
      setShapeLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-30" />
      <div className="pointer-events-none absolute left-1/3 top-0 h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-[180px]" />
      <div className="pointer-events-none absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[160px]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-lg font-bold text-white shadow-brand-900/40 shadow">
              SS
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">StudioShape</p>
              <p className="text-sm font-semibold text-white">Create. Preview. Launch.</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden rounded-full px-4 md:inline-flex" href="/signup">
              Get Started
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
              href="/dashboard"
            >
              Open Studio
            </Button>
            <button
              aria-label="Menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-100 hover:bg-white/10 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-12 pt-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Create a website without limits</p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Bring your ideas to life with StudioShape
          </h1>
          <p className="text-lg text-slate-300">
            A modern AI site builder that centers content, design, and strategy - not code. Shape reusable sections,
            lock in your theme, and preview every change instantly.
          </p>
          <form onSubmit={handleHeroSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-12 rounded-full border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus-visible:ring-brand-400"
              required
            />
            <Button type="submit" className="h-12 rounded-full px-5 text-base">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="text-sm text-slate-400">Start for free. No credit card required.</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-200">
            <span className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">Live preview</span>
            <span className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">AI-assisted layouts</span>
            <span className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">On-brand themes</span>
          </div>
        </div>

        <div className="flex-1">
          <Card className="rounded-3xl border-white/10 bg-white/5 shadow-2xl shadow-brand-900/40">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg text-white">Preview your site</CardTitle>
              <CardDescription className="text-slate-300">
                Live updates with your chosen preset, theme, and content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>StudioShape preview</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px]">Midnight Glow</span>
                </div>
                <div className="mt-4 space-y-3 rounded-xl bg-white/5 p-4">
                  <div className="h-2 w-28 rounded-full bg-white/30" />
                  <div className="h-3 w-3/4 rounded-full bg-white/20" />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-12 rounded-lg bg-white/10" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <FeatureBubble label="AI layout suggestion" />
                <FeatureBubble label="Theme: Midnight Glow" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SHAPEAI live builder & conversation */}
      <section className="bg-slate-900/80 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">ShapeAI live</p>
            <h3 className="text-3xl font-bold text-white">Chat with SHAPEAI to build your site</h3>
            <p className="text-slate-300">
              Describe your business, audience, and goal. SHAPEAI will propose a layout, hero copy, features, and story in seconds.
            </p>
            <form onSubmit={handleShapeSubmit} className="space-y-3">
              <textarea
                className="w-full rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white placeholder:text-slate-400 focus-visible:ring-brand-400"
                rows={4}
                value={shapePrompt}
                onChange={(e) => setShapePrompt(e.target.value)}
                placeholder="Tell SHAPEAI about your project..."
              />
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={shapeLoading} className="rounded-full px-5">
                  {shapeLoading ? 'Thinking...' : 'Ask SHAPEAI'}
                </Button>
                <Button
                  asChild
                  href="/builder"
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Open visual builder
                </Button>
              </div>
              {shapeError && <p className="text-sm text-rose-300">Warning: {shapeError}</p>}
            </form>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Conversation</p>
              {shapeMessages.length === 0 ? (
                <p className="text-sm text-slate-300">No conversation yet. Ask SHAPEAI to start.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-auto pr-1">
                  {shapeMessages.map((msg, idx) => (
                    <div
                      key={`${msg.role}-${idx}`}
                      className={`rounded-xl p-3 text-sm ${
                        msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-brand-500/15 text-brand-50'
                      }`}
                    >
                      <span className="font-semibold uppercase tracking-[0.1em] text-xs mr-2">
                        {msg.role === 'user' ? 'You' : 'SHAPEAI'}
                      </span>
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Card className="rounded-3xl border-white/10 bg-white/5 p-4 shadow-xl shadow-brand-900/40">
            <CardHeader className="space-y-1">
              <CardTitle className="text-white">Generated layout snapshot</CardTitle>
              <CardDescription className="text-slate-300">
                Live output from SHAPEAI. Wire it into the builder or publish as-is.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shapeConfig ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-200 mb-1">Hero</p>
                    <p className="text-lg font-semibold">{shapeConfig.sections?.hero?.title}</p>
                    <p className="text-slate-200">{shapeConfig.sections?.hero?.subtitle}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/80">
                      <span className="rounded-full bg-white/10 px-3 py-1">Primary: {shapeConfig.sections?.hero?.primaryCtaLabel}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1">Secondary: {shapeConfig.sections?.hero?.secondaryCtaLabel}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-200 mb-3">Top features</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(shapeConfig.sections?.features?.items || []).slice(0, 4).map((item, idx) => (
                        <div key={`${item.title}-${idx}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="text-xs text-slate-200">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-200 mb-2">Story</p>
                    <div className="space-y-2 text-sm text-slate-200">
                      {(shapeConfig.sections?.story?.paragraphs || []).slice(0, 3).map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
                  Ask SHAPEAI to generate a layout and preview will appear here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Secondary AI CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <Card className="flex flex-col gap-4 rounded-3xl border-white/10 bg-white/5 p-6 shadow-xl shadow-brand-900/40 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">AI website builder</p>
            <h3 className="text-2xl font-semibold text-white">Create your site in minutes with StudioShape AI</h3>
            <p className="text-slate-300">
              Describe your project and let StudioShape generate your layout, copy, and theme. Refine in the Studio with live preview.
            </p>
          </div>
          <Button asChild className="rounded-full px-5" href="/signup">
            <span className="flex items-center gap-2">
              Start with AI <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </Card>
      </section>

      {/* Steps */}
      <section className="bg-slate-900/80 py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">How it works</p>
            <h2 className="text-3xl font-bold text-white">How StudioShape works</h2>
            <p className="text-slate-300">
              Follow a guided flow from first idea to publish-ready site. No code, no blank canvas.
            </p>
          </div>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex gap-4 p-4 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white ring-1 ring-white/20">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-white">{step.title}</p>
                  <p className="text-sm text-slate-300">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild className="rounded-full px-6" href="/signup">
            Get Started
          </Button>
        </div>
      </section>

      {/* AI builder */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500/20 via-purple-600/20 to-slate-900 py-12">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-400/40 blur-3xl" aria-hidden />
        <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-purple-400/30 blur-3xl" aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">AI builder</p>
            <h3 className="text-3xl font-bold text-white">Create your site in minutes with our AI builder</h3>
            <p className="text-slate-200">
              Describe what you want — StudioShape turns it into a layout, sections, and starter copy tailored to your goal.
              Stay in control with presets, tone, and theme.
            </p>
            <div className="flex flex-wrap gap-2">
              <FeatureBubble label="AI copy" />
              <FeatureBubble label="AI layout" />
            </div>
            <Button asChild className="rounded-full bg-white px-6 text-slate-900 hover:bg-slate-100" href="/signup">
              <span className="flex items-center gap-2">
                Start with AI <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
          <div className="flex-1">
            <Card className="rounded-2xl border-white/10 bg-white/5 shadow-lg shadow-brand-900/50">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wand2 className="h-5 w-5 text-brand-200" />
                  Assistant
                </CardTitle>
                <CardDescription className="text-slate-200">
                  A guided prompt to jump-start your layout and copy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                  “I run a small studio and need a simple site with a bookings page.”
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100">
                    Layout preset: <span className="font-semibold text-white">Product</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-100">
                    Tone: <span className="font-semibold text-white">Professional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-black py-14 text-white">
        <div className="mx-auto max-w-6xl space-y-6 px-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Templates</p>
            <h3 className="text-3xl font-bold">Or start from a professional template</h3>
            <p className="max-w-3xl text-slate-200">
              Choose a preset StudioShape layout and customize it in minutes — no code, fully responsive.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full bg-white px-5 text-slate-900 hover:bg-slate-100" href="/signup">
              Browse presets
            </Button>
            <Select defaultValue="Landing">
              <SelectTrigger className="w-56 border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Landing">Landing page</SelectItem>
                <SelectItem value="Portfolio">Portfolio</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Ecommerce">E-commerce (coming soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {templateCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div
                  className={`mb-4 h-32 rounded-xl bg-gradient-to-br ${card.accent} opacity-90`}
                  aria-hidden
                />
                <p className="text-sm uppercase tracking-[0.18em] text-slate-200">{card.tag}</p>
                <p className="text-lg font-semibold text-white">{card.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customize and assistants */}
      <section className="bg-slate-950 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Customize</p>
            <h3 className="text-3xl font-bold text-white">Customize to make it your own</h3>
            <p className="text-slate-300">
              Rearrange sections, tweak typography and colors, and lock in your theme. StudioShape keeps everything on-brand and responsive.
            </p>
            <Card className="rounded-2xl border-white/10 bg-white/5">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Layout className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-white">Section-based editing</p>
                  <p className="text-sm text-slate-300">Drag, reorder, and restyle without touching code.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Assist</p>
            <h3 className="text-3xl font-bold text-white">Built-in assistants for content, design, and growth</h3>
            <div className="space-y-3">
              {[
                { title: 'Content suggestions', icon: Sparkles },
                { title: 'Design and theme hints', icon: Palette },
                { title: 'SEO tips', icon: ArrowRight },
                { title: 'Launch strategy recommendations', icon: Wand2 },
              ].map((item) => (
                <Card key={item.title} className="rounded-xl border-white/10 bg-white/5">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-white">{item.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <Button asChild className="w-full rounded-2xl py-4 text-lg" href="/signup">
            <span className="flex items-center justify-center gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
        </div>
      </section>
    </main>
  );
}
