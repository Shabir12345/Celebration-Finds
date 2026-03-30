"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { Loader2, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForgotPasswordForm() {
  const { supabase } = useSession();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-[#F5F2EB] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#1A4338]" />
        </div>
        <h2 className="font-serif text-2xl text-slate-800">Check Your Inbox</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          We&apos;ve sent a password reset link to <strong className="text-slate-800">{email}</strong>.
          It may take a few minutes to arrive.
        </p>
        <div className="pt-6">
          <Link
            href="/account/login"
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1A4338] transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Email Address <span className="text-[#1A4338]">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={cn(
            "w-full h-12 px-4 border bg-white text-sm text-slate-800 outline-none transition-all",
            error ? "border-red-400" : "border-slate-200 focus:border-[#1A4338] focus:ring-1 focus:ring-[#1A4338]/20"
          )}
        />
      </div>

      {error && (
        <p className="text-[11px] text-red-500 font-medium bg-red-50 border border-red-100 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Sending link…" : "Send Reset Link"}
      </button>

      <div className="text-center pt-2">
        <Link
          href="/account/login"
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1A4338] transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </form>
  );
}
