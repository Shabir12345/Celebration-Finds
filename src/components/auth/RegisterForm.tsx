"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  redirectTo?: string;
}

export default function RegisterForm({ redirectTo = "/account" }: RegisterFormProps) {
  const { supabase } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple password strength
  const isLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strength = [isLength, hasUpper, hasNumber].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Usually signUp automatically signs the user in unless email confirmation is required.
    // In many default Supabase setups, it requires confirmation. We'll direct them or show a message.
    router.replace(redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            First Name <span className="text-[#1A4338]">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full h-12 px-4 border border-slate-200 focus:border-[#1A4338] bg-white text-sm text-slate-800 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Last Name <span className="text-[#1A4338]">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full h-12 px-4 border border-slate-200 focus:border-[#1A4338] bg-white text-sm text-slate-800 outline-none transition-all"
          />
        </div>
      </div>

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
          className="w-full h-12 px-4 border border-slate-200 focus:border-[#1A4338] bg-white text-sm text-slate-800 outline-none transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Password <span className="text-[#1A4338]">*</span>
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full h-12 px-4 pr-12 border border-slate-200 focus:border-[#1A4338] bg-white text-sm text-slate-800 outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength indicator */}
        {password.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex gap-1 h-1 w-full">
              <div className={cn("flex-1 rounded-full", strength >= 1 ? "bg-amber-400" : "bg-slate-200")} />
              <div className={cn("flex-1 rounded-full", strength >= 2 ? "bg-green-400" : "bg-slate-200")} />
              <div className={cn("flex-1 rounded-full", strength >= 3 ? "bg-[#1A4338]" : "bg-slate-200")} />
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-slate-500">
              <span className={isLength ? "text-[#1A4338]" : ""}>
                <Check className="w-3 h-3 inline mr-1" /> At least 8 characters
              </span>
              <span className={hasUpper ? "text-[#1A4338]" : ""}>
                <Check className="w-3 h-3 inline mr-1" /> 1 uppercase letter
              </span>
              <span className={hasNumber ? "text-[#1A4338]" : ""}>
                <Check className="w-3 h-3 inline mr-1" /> 1 number
              </span>
            </div>
          </div>
        )}
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
        {loading ? "Creating Account…" : "Create Account"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/account/login" className="text-[#1A4338] font-bold hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
}
