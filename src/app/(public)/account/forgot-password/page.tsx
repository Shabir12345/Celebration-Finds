import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password | Celebration Finds",
  description: "Reset your Celebration Finds account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-md space-y-10">
        {/* Logo / Brand */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-slate-800 tracking-tight">
              Celebration Finds
            </span>
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            Reset Password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 shadow-xl space-y-8">
          <p className="text-sm text-slate-500 leading-relaxed text-center">
            Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
