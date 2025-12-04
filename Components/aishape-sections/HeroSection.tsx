import React from 'react';
import { SiteSection } from '@/lib/aishape/model';

export default function HeroSection({ section }: { section: SiteSection }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Hero</p>
      <h2 className="text-2xl font-bold">{section.title || 'Hero title'}</h2>
      <p className="text-slate-300">{section.subtitle || 'Add a subtitle to your hero section.'}</p>
      {section.ctaLabel && (
        <button className="mt-3 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
          {section.ctaLabel}
        </button>
      )}
    </section>
  );
}
