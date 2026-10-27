'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate recovery link dispatch
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#001237] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#18243D_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-4">
        <CivoraLogo size="md" showTagline={true} href="/" theme="dark" className="justify-center" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Encode_Sans_Condensed',sans-serif] uppercase pt-2">
          Administrative Password Recovery
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Enter your certified work email to receive cryptographic password reset instructions for the Civora Control Plane.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-2xl bg-[#18243D]/90 border border-slate-700/80 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10 space-y-6">
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white">Reset Link Dispatched</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an authorized administrator account exists for <span className="text-[#4FAAA7] font-semibold">{email}</span>, an authenticated reset dispatch has been queued.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <Button href="/login" variant="teal" size="md" className="w-full justify-center">
                  Return to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="recovery-email" className="block text-xs font-semibold text-slate-300">
                  Certified Administrator Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="babatunde.fashola@civora.internal"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#001237]/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4FAAA7] focus:ring-1 focus:ring-[#4FAAA7] transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full justify-center font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-xs"
              >
                Dispatch Reset Token
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4FAAA7]" />
          <span>Statutory 256-Bit HSM Key Management &bull; Civora Trust Core</span>
        </div>
      </div>
    </div>
  );
}
