'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import SiteRenderer from '@/Components/site/SiteRenderer';
import { getContentSuggestions } from '@/lib/agents/contentAgent';
import { getDesignSuggestions } from '@/lib/agents/designAgent';
import { getSeoSuggestions } from '@/lib/agents/seoAgent';
import { getStrategySuggestions } from '@/lib/agents/strategyAgent';
import {
  buildDefaultStudioShapeSite,
  getSiteById,
  updateSite,
  updateSiteConfig,
} from '@/lib/dataStore';
import type { StudioShapeSite, StudioShapeTheme, LayoutPreset } from '@/lib/types';

type Mode = 'simple' | 'advanced';
type AssistTab = 'content' | 'design' | 'seo' | 'strategy';

const presetOptions: LayoutPreset[] = ['minimal', 'product', 'portfolio', 'dark'];

export default function EditSitePage() {
  const params = useParams();
  const siteId = (params?.siteId as string) || '';
  const [mode, setMode] = useState<Mode>('simple');
  const [assistTab, setAssistTab] = useState<AssistTab>('content');
  const [siteConfig, setSiteConfig] = useState<StudioShapeSite | null>(null);
  const [siteName, setSiteName] = useState<string>('StudioShape Site');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const site = siteId ? await getSiteById(siteId) : null;
      if (!mounted) return;
      setSiteName(site?.name || 'StudioShape Site');
      if (site?.config) {
        setSiteConfig(site.config);
      } else if (site) {
        setSiteConfig(buildDefaultStudioShapeSite(site.id, site.name));
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [siteId]);

  const updateConfig = (updater: (prev: StudioShapeSite) => StudioShapeSite) => {
    if (!siteConfig) return;
    setSiteConfig((prev) => (prev ? updater(prev) : prev));
    setStatus('idle');
  };

  const handleHeroChange = (field: keyof StudioShapeSite['sections']['hero'], value: string) => {
    updateConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        hero: { ...prev.sections.hero, [field]: value },
      },
    }));
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
    updateConfig((prev) => {
      const items = [...prev.sections.features.items];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        sections: { ...prev.sections, features: { ...prev.sections.features, items } },
      };
    });
  };

  const handleStatsChange = (index: number, field: 'label' | 'value', value: string) => {
    updateConfig((prev) => {
      const items = [...prev.sections.stats.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, sections: { ...prev.sections, stats: { items } } };
    });
  };

  const handleThemeChange = (field: keyof StudioShapeTheme, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }));
  };

  const handleLayoutChange = (preset: LayoutPreset) => {
    updateConfig((prev) => ({
      ...prev,
      layoutPreset: preset,
    }));
  };

  const handleStoryChange = (heading: string, paragraphs: string[]) => {
    updateConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        story: { heading, paragraphs },
      },
    }));
  };

  const simpleFeatureItems = useMemo(() => siteConfig?.sections.features.items.slice(0, 3) || [], [siteConfig]);
  const simpleStats = useMemo(() => siteConfig?.sections.stats.items.slice(0, 3) || [], [siteConfig]);
  const contentSuggestions = useMemo(
    () => (siteConfig ? getContentSuggestions(siteConfig) : []),
    [siteConfig]
  );
  const designSuggestions = useMemo(
    () => (siteConfig ? getDesignSuggestions(siteConfig) : []),
    [siteConfig]
  );
  const seoSuggestions = useMemo(() => (siteConfig ? getSeoSuggestions(siteConfig) : []), [siteConfig]);
  const strategySuggestions = useMemo(
    () => (siteConfig ? getStrategySuggestions(siteConfig) : []),
    [siteConfig]
  );

  const save = async () => {
    if (!siteConfig || !siteId) return;
    setIsSaving(true);
    try {
      await updateSiteConfig(siteId, siteConfig);
      await updateSite(siteId, {
        name: siteName,
        theme: { primaryColor: siteConfig.theme.primaryColor, font: 'font-display' },
      });
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!siteConfig || !siteId || !aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, siteId: siteConfig.id }),
      });
      if (!res.ok) {
        throw new Error('Generation failed');
      }
      const data = await res.json();
      const aiConfig = data?.config as StudioShapeSite | undefined;
      if (!aiConfig) {
        throw new Error('Invalid AI response');
      }
      const mergedConfig: StudioShapeSite = {
        ...siteConfig,
        ...aiConfig,
        id: siteConfig.id,
        name: aiConfig.name || siteConfig.name,
        layoutPreset: aiConfig.layoutPreset || siteConfig.layoutPreset,
        theme: aiConfig.theme || siteConfig.theme,
        sections: {
          hero: aiConfig.sections?.hero || siteConfig.sections.hero,
          features: {
            items:
              aiConfig.sections?.features?.items && aiConfig.sections.features.items.length > 0
                ? aiConfig.sections.features.items
                : siteConfig.sections.features.items,
          },
          story: {
            heading: aiConfig.sections?.story?.heading || siteConfig.sections.story.heading,
            paragraphs:
              aiConfig.sections?.story?.paragraphs && aiConfig.sections.story.paragraphs.length > 0
                ? aiConfig.sections.story.paragraphs
                : siteConfig.sections.story.paragraphs,
          },
          stats: {
            items:
              aiConfig.sections?.stats?.items && aiConfig.sections.stats.items.length > 0
                ? aiConfig.sections.stats.items
                : siteConfig.sections.stats.items,
          },
        },
      };

      setSiteName(mergedConfig.name);
      setSiteConfig(mergedConfig);
      await updateSiteConfig(siteId, mergedConfig);
      await updateSite(siteId, {
        name: mergedConfig.name,
        theme: { primaryColor: mergedConfig.theme.primaryColor, font: 'font-display' },
      });
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setAiError('Something went wrong generating your site. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!siteConfig) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading site...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
            <h1 className="text-2xl font-semibold text-white">Edit site</h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="max-w-xs border-white/10 bg-white/5"
              placeholder="Site name"
            />
            <Button onClick={save} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
            {status === 'saved' && <span className="text-xs text-emerald-400">Saved</span>}
            {status === 'error' && <span className="text-xs text-rose-400">Error saving</span>}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[420px,1fr]">
          <div className="space-y-4">
            <Card className="glass-panel border border-white/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl text-white">Editor</CardTitle>
                <CardDescription className="text-slate-400">
                  Switch between simple and advanced controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={mode} onValueChange={(val) => setMode(val as Mode)}>
                  <TabsList>
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="simple" className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Hero</p>
                      <Input
                        value={siteConfig.sections.hero.title}
                        onChange={(e) => handleHeroChange('title', e.target.value)}
                        placeholder="Hero title"
                      />
                      <Textarea
                        value={siteConfig.sections.hero.subtitle}
                        onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                        placeholder="Short subtitle"
                      />
                      <Input
                        value={siteConfig.sections.hero.primaryCtaLabel}
                        onChange={(e) => handleHeroChange('primaryCtaLabel', e.target.value)}
                        placeholder="Primary CTA"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Features (first 3)</p>
                      {simpleFeatureItems.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-white/10 p-3 space-y-2">
                          <Input
                            value={item.title}
                            onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                            placeholder="Title"
                          />
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                            placeholder="Description"
                            className="h-16"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Story</p>
                      <Input
                        value={siteConfig.sections.story.heading}
                        onChange={(e) =>
                          handleStoryChange(e.target.value, siteConfig.sections.story.paragraphs)
                        }
                        placeholder="Story heading"
                      />
                      <Textarea
                        value={siteConfig.sections.story.paragraphs[0] || ''}
                        onChange={(e) =>
                          handleStoryChange(siteConfig.sections.story.heading, [
                            e.target.value,
                            siteConfig.sections.story.paragraphs[1] || '',
                          ])
                        }
                        placeholder="Paragraph one"
                        className="h-20"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Stats</p>
                      {simpleStats.map((stat, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-2">
                          <Input
                            value={stat.label}
                            onChange={(e) => handleStatsChange(idx, 'label', e.target.value)}
                            placeholder="Label"
                          />
                          <Input
                            value={stat.value}
                            onChange={(e) => handleStatsChange(idx, 'value', e.target.value)}
                            placeholder="Value"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Layout preset</p>
                      <Select
                        value={siteConfig.layoutPreset}
                        onValueChange={(val) => handleLayoutChange(val as LayoutPreset)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose preset" />
                        </SelectTrigger>
                        <SelectContent>
                          {presetOptions.map((preset) => (
                            <SelectItem key={preset} value={preset}>
                              {preset}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Hero</p>
                      <Input
                        value={siteConfig.sections.hero.title}
                        onChange={(e) => handleHeroChange('title', e.target.value)}
                        placeholder="Hero title"
                      />
                      <Textarea
                        value={siteConfig.sections.hero.subtitle}
                        onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                        placeholder="Hero subtitle"
                        className="h-20"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={siteConfig.sections.hero.primaryCtaLabel}
                          onChange={(e) => handleHeroChange('primaryCtaLabel', e.target.value)}
                          placeholder="Primary CTA"
                        />
                        <Input
                          value={siteConfig.sections.hero.secondaryCtaLabel}
                          onChange={(e) => handleHeroChange('secondaryCtaLabel', e.target.value)}
                          placeholder="Secondary CTA"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Features</p>
                      {siteConfig.sections.features.items.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-white/10 p-3 space-y-2">
                          <Input
                            value={item.title}
                            onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                            placeholder="Title"
                          />
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                            placeholder="Description"
                            className="h-16"
                          />
                          <Input
                            value={item.icon || ''}
                            onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                            placeholder="Icon (lucide key, e.g., rocket)"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: {
                              ...prev.sections,
                              features: {
                                ...prev.sections.features,
                                items: [
                                  ...prev.sections.features.items,
                                  { title: 'New feature', description: 'Describe it', icon: 'sparkles' },
                                ],
                              },
                            },
                          }))
                        }
                      >
                        Add feature
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Story</p>
                      <Input
                        value={siteConfig.sections.story.heading}
                        onChange={(e) =>
                          handleStoryChange(e.target.value, siteConfig.sections.story.paragraphs)
                        }
                        placeholder="Story heading"
                      />
                      <Textarea
                        value={siteConfig.sections.story.paragraphs.join('\n\n')}
                        onChange={(e) =>
                          handleStoryChange(
                            siteConfig.sections.story.heading,
                            e.target.value.split('\n\n')
                          )
                        }
                        className="min-h-[140px]"
                        placeholder="Paragraphs (separate with blank line)"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Stats</p>
                      {siteConfig.sections.stats.items.map((stat, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-2">
                          <Input
                            value={stat.label}
                            onChange={(e) => handleStatsChange(idx, 'label', e.target.value)}
                            placeholder="Label"
                          />
                          <Input
                            value={stat.value}
                            onChange={(e) => handleStatsChange(idx, 'value', e.target.value)}
                            placeholder="Value"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            sections: {
                              ...prev.sections,
                              stats: {
                                items: [...prev.sections.stats.items, { label: 'New stat', value: 'Value' }],
                              },
                            },
                          }))
                        }
                      >
                        Add stat
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Theme</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={siteConfig.theme.primaryColor}
                          onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                          placeholder="Primary color"
                        />
                        <Input
                          value={siteConfig.theme.secondaryColor}
                          onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                          placeholder="Secondary color"
                        />
                        <Input
                          value={siteConfig.theme.accentColor}
                          onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                          placeholder="Accent color"
                        />
                        <Input
                          value={siteConfig.theme.background}
                          onChange={(e) => handleThemeChange('background', e.target.value)}
                          placeholder="Background"
                        />
                        <Input
                          value={siteConfig.theme.textColor}
                          onChange={(e) => handleThemeChange('textColor', e.target.value)}
                          placeholder="Text color"
                        />
                        <Input
                          value={siteConfig.theme.fontFamily}
                          onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                          placeholder="Font family"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="glass-panel border border-white/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-white text-base">AI site generator</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Describe your business, audience, and goal. We will generate hero, features, story, stats, and theme.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="I run a yoga studio in Brussels and need a calm site with class schedule, pricing, and a 'Book a class' button."
                  className="min-h-[120px]"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleGenerate} disabled={isGenerating || !aiPrompt.trim()}>
                    {isGenerating ? 'Generating...' : 'Generate site with AI'}
                  </Button>
                  {aiError && <span className="text-xs text-rose-300">{aiError}</span>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-3xl border border-white/10">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live preview</p>
                  <p className="text-sm text-white">{siteName}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {siteConfig.layoutPreset} preset
                </span>
              </div>
              <div className="max-h-[80vh] overflow-auto">
                <SiteRenderer site={siteConfig} />
              </div>
            </div>

            <Card className="glass-panel border border-white/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-white text-base">StudioShape Assist</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Suggestions for content, design, SEO, and launch strategy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={assistTab} onValueChange={(val) => setAssistTab(val as AssistTab)}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content">
                    <SuggestionList items={contentSuggestions} />
                  </TabsContent>
                  <TabsContent value="design">
                    <SuggestionList items={designSuggestions} />
                  </TabsContent>
                  <TabsContent value="seo">
                    <SuggestionList items={seoSuggestions} />
                  </TabsContent>
                  <TabsContent value="strategy">
                    <SuggestionList items={strategySuggestions} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionList({ items }: { items: string[] }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-400">No suggestions yet.</p>;
  }
  return (
    <ul className="space-y-2 text-sm text-slate-200 pt-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5">
          <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" aria-hidden />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
