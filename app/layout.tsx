import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudioShape - shape, preview, and launch simple sites fast',
  description:
    'StudioShape lets you assemble clean, responsive pages from reusable sections with live preview and a consistent theme.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  )
}

