import React from 'react';
import { SiteSection } from '@/lib/aishape/model';

export default function BlogSection({ section }: { section: SiteSection }) {
  const items = section.items || [
    { id: 'b1', title: 'Sample post', text: 'A brief excerpt of your article.' },
    { id: 'b2', title: 'Another post', text: 'Another short excerpt.' },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Blog</p>
      <h3 className="text-xl font-semibold">{section.title || 'Blog'}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-sm text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
