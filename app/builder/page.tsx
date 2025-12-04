'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateTemplatesFromPrompt } from '@/lib/aishape/templates';
import { SiteTemplate, SiteSectionType, SiteSection, AishapeSessionState } from '@/lib/aishape/model';
import { AishapeChat } from '@/Components/AishapeChat';
import HeroSection from '@/Components/aishape-sections/HeroSection';
import FeaturesSection from '@/Components/aishape-sections/FeaturesSection';
import AboutSection from '@/Components/aishape-sections/AboutSection';
import PricingSection from '@/Components/aishape-sections/PricingSection';
import ContactSection from '@/Components/aishape-sections/ContactSection';
import GallerySection from '@/Components/aishape-sections/GallerySection';
import BlogSection from '@/Components/aishape-sections/BlogSection';
import FaqSection from '@/Components/aishape-sections/FaqSection';
import TestimonialsSection from '@/Components/aishape-sections/TestimonialsSection';
import { Button } from '@/Components/ui/button';

const sectionComponents: Record<SiteSectionType, React.ComponentType<{ section: SiteSection }>> = {
  hero: HeroSection,
  features: FeaturesSection,
  about: AboutSection,
  pricing: PricingSection,
  contact: ContactSection,
  gallery: GallerySection,
  blog: BlogSection,
  faq: FaqSection,
  testimonials: TestimonialsSection,
};

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const promptParam = searchParams?.get('prompt') || '';
  const [templates, setTemplates] = useState<SiteTemplate[]>([]);
  const [session, setSession] = useState<AishapeSessionState>({
    currentTemplate: null,
    history: [],
    changeLog: [],
  });

  useEffect(() => {
    const tpls = generateTemplatesFromPrompt(promptParam);
    setTemplates(tpls);
  }, [promptParam]);

  const selectedTemplate = session.currentTemplate;

  const handleSelectTemplate = (tpl: SiteTemplate) => {
    setSession((prev) => ({
      ...prev,
      currentTemplate: tpl,
      history: prev.history,
    }));
  };

  const handleSiteConfigChange = (next: SiteTemplate) => {
    setSession((prev) => ({
      ...prev,
      history: prev.currentTemplate ? [...prev.history, prev.currentTemplate] : prev.history,
      currentTemplate: next,
    }));
  };

  const handleUndo = () => {
    setSession((prev) => {
      if (prev.history.length === 0 || !prev.currentTemplate) return prev;
      const history = [...prev.history];
      const last = history.pop() as SiteTemplate;
      return {
        ...prev,
        currentTemplate: last,
        history,
      };
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">AISHAPE</p>
            <h1 className="text-3xl font-bold text-white">Choose a template to start</h1>
            <p className="text-slate-300">Pick a template, then chat with AISHAPE to refine it live.</p>
          </div>

          {!selectedTemplate && (
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((tpl) => (
                <div key={tpl.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-md shadow-brand-900/30 space-y-3">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">{tpl.name}</p>
                    <p className="text-sm text-slate-300">{tpl.description}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {tpl.sections.map((s) => s.type).join(' · ')}
                  </p>
                  <Button className="w-full" onClick={() => handleSelectTemplate(tpl)}>
                    Use this template
                  </Button>
                </div>
              ))}
            </div>
          )}

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Previewing</p>
                  <p className="text-lg font-semibold text-white">{selectedTemplate.name}</p>
                </div>
                <Button variant="outline" onClick={handleUndo} disabled={session.history.length === 0}>
                  Undo last change
                </Button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-brand-900/30">
                <div className="space-y-6">
                  {selectedTemplate.sections.map((section) => {
                    const Comp = sectionComponents[section.type];
                    return <Comp key={section.id} section={section} />;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <aside className="w-full border-l border-white/10 bg-slate-900/80 md:w-80 lg:w-96">
        {selectedTemplate ? (
          <AishapeChat siteConfig={selectedTemplate} onSiteConfigChange={handleSiteConfigChange} onUndo={handleUndo} />
        ) : (
          <div className="p-4 text-sm text-slate-300">
            Select a template to start chatting with AISHAPE.
          </div>
        )}
      </aside>
    </div>
  );
}
