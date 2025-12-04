import React from 'react';
import { SiteSection } from '@/lib/aishape/model';

export default function TestimonialsSection({ section }: { section: SiteSection }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Testimonials</p>
      <h3 className="text-xl font-semibold">{section.title || 'Testimonials'}</h3>
      <div className="space-y-2">
        {(section.items || []).map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-sm text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
