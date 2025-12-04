'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 glass-panel rounded-3xl border border-white/10 p-8 shadow-xl shadow-brand-900/40">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">StudioShape</p>
          <h1 className="text-3xl font-semibold text-white">Log in</h1>
          <p className="text-sm text-slate-400">Use Google to sign in to StudioShape.</p>
        </div>
        <Button
          className="w-full rounded-xl py-3 text-base"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          Continue with Google
        </Button>
        <p className="text-xs text-slate-400">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-brand-200 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
