import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account | Celebration Finds",
  description: "Create your Celebration Finds account to save designs and manage orders.",
};

export default function RegisterPage() {
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
            Create an Account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 shadow-xl space-y-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
