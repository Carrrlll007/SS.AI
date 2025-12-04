import React from 'react';
import { SiteSection } from '@/lib/aishape/model';

export default function GallerySection({ section }: { section: SiteSection }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Gallery</p>
      <h3 className="text-xl font-semibold">{section.title || 'Gallery'}</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {(section.items || new Array(6).fill(null)).map((item, idx) => (
          <div key={item?.id || idx} className="h-20 rounded-lg bg-white/10" />
        ))}
      </div>
    </section>
  );
}
