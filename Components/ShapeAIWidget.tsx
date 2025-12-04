'use client';

import React, { useState } from 'react';
import { ShapeAIChat } from './ShapeAIChat';

export function ShapeAIWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-600"
        >
          {open ? 'Close SHAPEAI' : 'Chat with SHAPEAI'}
        </button>
      </div>
      {open && (
        <div className="fixed bottom-16 right-5 z-40 h-[480px] w-[360px]">
          <ShapeAIChat />
        </div>
      )}
    </>
  );
}
