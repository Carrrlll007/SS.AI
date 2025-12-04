'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { defaultStudioShapeTheme, createSite, updateSite, updateSiteConfig } from '@/lib/dataStore';
import type { LayoutPreset, StudioShapeSite, StudioShapeTheme } from '@/lib/types';

type Mode = 'simple' | 'advanced';

type WizardState = {
  siteType: 'launch' | 'portfolio' | 'saas' | 'info';
  layoutPreset: LayoutPreset;
  brandName: string;
  tagline: string;
  description: string;
  goal: string;
  audience: string;
  tone: 'friendly' | 'professional' | 'bold' | 'playful';
  vibe: 'minimal' | 'bold' | 'dark';
};

const siteTypePresets: Record<WizardState['siteType'], LayoutPreset> = {
  launch: 'product',
  portfolio: 'portfolio',
  saas: 'minimal',
  info: 'minimal',
};

const getAssistantHint = (step: number): string => {
  const hints = [
    "Not sure? Choose 'Product launch page' if you're announcing something new.",
    'Use a short, memorable tagline - the hero subtitle should explain the value in one sentence.',
    'Think about the single most important outcome: leads, bookings, or showcasing your work.',
    'Pick a tone and vibe that match your audience. Dark + bold works well for product launches.',
    'Review your inputs, then generate. You can fine-tune everything in the editor afterward.',
  ];
  return hints[step] || hints[0];
};

const deriveTheme = (state: WizardState): StudioShapeTheme => {
  const base = defaultStudioShapeTheme();
  if (state.vibe === 'dark') {
    return { ...base, background: '#050914', primaryColor: '#8b5cf6', accentColor: '#22d3ee', textColor: '#e2e8f0' };
  }
  if (state.vibe === 'bold') {
    return { ...base, primaryColor: '#f97316', accentColor: '#22d3ee', background: '#0b1224', textColor: '#e2e8f0' };
  }
  return base;
};

const buildFeatures = (state: WizardState) => {
  const goal = state.goal.toLowerCase();
  const audience = state.audience || 'your audience';
  const base = [
    { title: 'Launch-ready layout', description: 'Clean, responsive blocks tuned for fast publishing.', icon: 'rocket' },
    { title: 'On-brand design', description: 'Theme guardrails keep typography and colors consistent.', icon: 'shield' },
    { title: 'Content-first', description: `Focus on messaging for ${audience}; StudioShape handles structure.`, icon: 'sparkles' },
  ];
  if (goal.includes('lead')) {
    base.push({ title: 'Lead capture ready', description: 'CTA-first layout to collect responses quickly.', icon: 'chart' });
  } else if (goal.includes('portfolio')) {
    base.push({ title: 'Show your work', description: 'Highlight wins and projects with a clear story.', icon: 'layout' });
  } else if (goal.includes('booking')) {
    base.push({ title: 'Book more calls', description: 'CTA and stats tuned for trust and quick scheduling.', icon: 'check' });
  }
  return base.slice(0, 4);
};

const buildStats = () => [
  { label: 'Sections ready', value: '24+' },
  { label: 'Time to publish', value: '< 2 min' },
  { label: 'Performance', value: '96+ score' },
];

const buildConfigFromState = (siteId: string, state: WizardState): StudioShapeSite => {
  const layoutPreset = state.layoutPreset || siteTypePresets[state.siteType];
  const theme = deriveTheme(state);
  const primaryCta =
    state.goal.toLowerCase().includes('lead') || state.goal.toLowerCase().includes('booking')
      ? 'Get started'
      : state.siteType === 'portfolio'
      ? 'View work'
      : 'Learn more';
  const secondaryCta =
    state.siteType === 'portfolio' ? 'Contact' : state.goal.toLowerCase().includes('lead') ? 'Contact' : 'See preview';

  return {
    id: siteId,
    name: state.brandName || 'StudioShape Site',
    layoutPreset,
    theme,
    sections: {
      hero: {
        title: state.brandName || 'Shape your next website in minutes.',
        subtitle: state.tagline || state.description || 'Launch a clean, responsive page without touching code.',
        primaryCtaLabel: primaryCta,
        secondaryCtaLabel: secondaryCta,
      },
      features: {
        items: buildFeatures(state),
      },
      story: {
        heading: state.tagline ? `Why ${state.brandName || 'this brand'}` : `${state.brandName || 'Your'} story`,
        paragraphs: [
          state.description ||
            'Tell your audience exactly what matters - StudioShape keeps the structure and theme consistent.',
          `Goal: ${state.goal || 'Share your message'}. Audience: ${state.audience || 'your visitors'}. StudioShape manages code, layout, and scalability so you can focus on outcomes.`,
        ],
      },
      stats: {
        items: buildStats(),
      },
    },
  };
};

const StepTitle = ({ step, label }: { step: number; label: string }) => (
  <div className="flex items-center gap-2 text-slate-200">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
      {step}
    </span>
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default function StartPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('simple');
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [state, setState] = useState<WizardState>({
    siteType: 'launch',
    layoutPreset: 'product',
    brandName: 'StudioShape Site',
    tagline: '',
    description: '',
    goal: 'Collect leads',
    audience: 'Early customers',
    tone: 'professional',
    vibe: 'dark',
  });

  const steps = useMemo(
    () => [
      'What are you building?',
      'Brand & positioning',
      'Goal & audience',
      'Design & tone',
      'Review & generate',
    ],
    []
  );

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const generateSite = async () => {
    setIsGenerating(true);
    try {
      const site = await createSite(state.brandName || 'StudioShape Site');
      const config = buildConfigFromState(site.id, state);
      await updateSiteConfig(site.id, config);
      await updateSite(site.id, {
        name: state.brandName || 'StudioShape Site',
        theme: { primaryColor: config.theme.primaryColor, font: 'font-display' },
      });
      router.push(`/sites/${site.id}/edit`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toneLabel = (tone: WizardState['tone']) =>
    ({ friendly: 'Friendly', professional: 'Professional', bold: 'Bold', playful: 'Playful' }[tone]);

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-30" />
      <div className="relative mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
            <h1 className="text-3xl font-bold text-white">Start shaping with guided steps</h1>
            <p className="text-slate-300">
              Answer a few questions and we&apos;ll generate a ready-to-edit site with your layout preset, hero,
              features, and theme.
            </p>
          </div>
          <Tabs value={mode} onValueChange={(val) => setMode(val as Mode)}>
            <TabsList>
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr,0.4fr]">
          <div className="space-y-4">
            <Card className="glass-panel border border-white/10">
              <CardHeader className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-3">
                  {steps.map((label, idx) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                        idx === step ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {idx + 1}. {label}
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 0 && (
                  <div className="space-y-4">
                    <StepTitle step={1} label="What are you building?" />
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { key: 'launch', title: 'Product launch page', preset: 'product' },
                        { key: 'saas', title: 'SaaS marketing page', preset: 'minimal' },
                        { key: 'portfolio', title: 'Personal portfolio', preset: 'portfolio' },
                        { key: 'info', title: 'Simple info site', preset: 'minimal' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              siteType: item.key as WizardState['siteType'],
                              layoutPreset: item.preset as LayoutPreset,
                            }))
                          }
                          className={`rounded-2xl border px-4 py-3 text-left transition hover:border-white/40 ${
                            state.siteType === item.key ? 'border-brand-400 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-200'
                          }`}
                        >
                          <div className="text-sm font-semibold">{item.title}</div>
                          <div className="text-xs text-slate-400">Preset: {item.preset}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <StepTitle step={2} label="Brand & positioning" />
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Brand / site name</label>
                        <Input
                          value={state.brandName}
                          onChange={(e) => setState((prev) => ({ ...prev, brandName: e.target.value }))}
                          placeholder="e.g., Acme Launch"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Tagline</label>
                        <Input
                          value={state.tagline}
                          onChange={(e) => setState((prev) => ({ ...prev, tagline: e.target.value }))}
                          placeholder="One-liner that explains the value"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Short description</label>
                      <Textarea
                        value={state.description}
                        onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what you are building and why it matters."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <StepTitle step={3} label="Goal & audience" />
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Primary goal</label>
                        <Select
                          value={state.goal}
                          onValueChange={(val) => setState((prev) => ({ ...prev, goal: val }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Collect leads">Collect leads</SelectItem>
                            <SelectItem value="Get bookings">Get bookings</SelectItem>
                            <SelectItem value="Show portfolio">Show portfolio</SelectItem>
                            <SelectItem value="Explain a product">Explain a product</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Audience</label>
                        <Input
                          value={state.audience}
                          onChange={(e) => setState((prev) => ({ ...prev, audience: e.target.value }))}
                          placeholder="e.g., early adopters, clients"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <StepTitle step={4} label="Design & tone" />
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Tone of voice</label>
                        <Select
                          value={state.tone}
                          onValueChange={(val) => setState((prev) => ({ ...prev, tone: val as WizardState['tone'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Visual vibe</label>
                        <Select
                          value={state.vibe}
                          onValueChange={(val) => setState((prev) => ({ ...prev, vibe: val as WizardState['vibe'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Vibe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="bold">Bold color</SelectItem>
                            <SelectItem value="dark">Dark mode</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {mode === 'advanced' && (
                      <div className="space-y-2 text-slate-300 text-sm">
                        <p>
                          Tone: {toneLabel(state.tone)}. Vibe: {state.vibe}. Layout preset:{' '}
                          {state.layoutPreset || siteTypePresets[state.siteType]}.
                        </p>
                        <p>These choices influence your theme colors and default CTA labels.</p>
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <StepTitle step={5} label="Review & generate" />
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 space-y-2">
                      <div className="flex justify-between">
                        <span>Site type</span>
                        <span className="text-slate-300">{`${state.siteType} -> ${state.layoutPreset}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Brand</span>
                        <span className="text-slate-300">{state.brandName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tagline</span>
                        <span className="text-slate-300">{state.tagline || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Goal</span>
                        <span className="text-slate-300">{state.goal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Audience</span>
                        <span className="text-slate-300">{state.audience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tone / vibe</span>
                        <span className="text-slate-300">{toneLabel(state.tone)} / {state.vibe}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={prevStep} disabled={step === 0}>
                    Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button onClick={nextStep}>Next</Button>
                  ) : (
                    <Button onClick={generateSite} disabled={isGenerating}>
                      {isGenerating ? 'Generating...' : 'Generate my site'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass-panel border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Assistant</CardTitle>
                <CardDescription className="text-slate-400">
                  Guided tips for each step. A real AI could plug in here later.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-200 text-sm">
                {getAssistantHint(step)}
              </CardContent>
            </Card>

            <Card className="glass-panel border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Current selections</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-2 text-sm">
                <div>Layout preset: {state.layoutPreset}</div>
                <div>Goal: {state.goal}</div>
                <div>Tone: {toneLabel(state.tone)}</div>
                <div>Vibe: {state.vibe}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

