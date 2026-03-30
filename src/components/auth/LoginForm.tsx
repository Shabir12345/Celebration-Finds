"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = "/account" }: LoginFormProps) {
  const { supabase } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Your email or password doesn't match our records. Please try again."
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.replace(redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
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

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Password <span className="text-[#1A4338]">*</span>
          </label>
          <Link
            href="/account/forgot-password"
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1A4338] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={cn(
              "w-full h-12 px-4 pr-12 border bg-white text-sm text-slate-800 outline-none transition-all",
              error ? "border-red-400" : "border-slate-200 focus:border-[#1A4338] focus:ring-1 focus:ring-[#1A4338]/20"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-500 font-medium bg-red-50 border border-red-100 px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/account/register" className="text-[#1A4338] font-bold hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
}
