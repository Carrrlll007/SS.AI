import React from 'react';
import { SiteSection } from '@/lib/aishape/model';

export default function AboutSection({ section }: { section: SiteSection }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">About</p>
      <h3 className="text-xl font-semibold">{section.title || 'About us'}</h3>
      <p className="text-slate-300">{section.text || 'Tell your story here.'}</p>
    </section>
  );
}
