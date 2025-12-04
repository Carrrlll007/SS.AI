'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { PasswordInput } from '@/Components/ui/password-input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 px-4 py-10 text-slate-900">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-400 text-lg font-bold text-white shadow-md shadow-brand-300/50">
              SS
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">StudioShape</p>
              <p className="text-sm font-semibold text-slate-800">Create. Preview. Launch.</p>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900">Sign up</h1>
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-brand-600 hover:underline">
                Log in
              </Link>
            </p>
            <p className="text-slate-600">
              Focus on content, design, and strategy — StudioShape handles code, layout, hosting, and scalability.
            </p>
          </div>
        </div>

        <Card className="rounded-3xl border-slate-200 bg-white shadow-xl shadow-slate-300/40">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-slate-900">Get started for free</CardTitle>
            <CardDescription className="text-slate-600">
              No credit card required. Switch to the full Studio anytime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Button className="w-full rounded-xl py-3 text-base" type="button" onClick={handleGoogle}>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span className="flex-1 border-t border-slate-200" />
              <span>OR USE YOUR EMAIL</span>
              <span className="flex-1 border-t border-slate-200" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-brand-500"
                />
              </div>
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
              <PasswordInput
                id="confirm"
                name="confirm"
                label="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
              />
              <Button type="submit" className="w-full rounded-xl py-3 text-base shadow-lg shadow-brand-200/60">
                Create account
              </Button>
            </form>

            <p className="text-xs text-slate-500">
              By signing up, you agree to our{' '}
              <a href="#" className="font-semibold text-slate-700 hover:underline">
                Terms of Use
              </a>{' '}
              and acknowledge you have read our{' '}
              <a href="#" className="font-semibold text-slate-700 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <p className="text-[11px] text-slate-400">
              This site may be protected by basic security checks to prevent abuse.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
