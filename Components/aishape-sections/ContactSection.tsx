import React from 'react';
import { SiteSection } from '@/lib/aishape/model';

export default function ContactSection({ section }: { section: SiteSection }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Contact</p>
      <h3 className="text-xl font-semibold">{section.title || 'Get in touch'}</h3>
      <p className="text-slate-300">{section.subtitle || 'Drop a line or book a call.'}</p>
      <button className="mt-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
        {section.ctaLabel || 'Contact us'}
      </button>
    </section>
  );
}
