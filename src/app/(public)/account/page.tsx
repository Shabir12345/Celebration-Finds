import { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Account | Celebration Finds",
  description: "Manage your Celebration Finds orders and account settings.",
};

export default function AccountPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white pt-40 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-16">
          {/* Header */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A4338]">
              Account Dashboard
            </p>
            <h1 className="font-serif text-4xl font-bold text-slate-800 tracking-tight">
              Welcome back.
            </h1>
          </div>

          {/* Quick links grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "My Orders", desc: "View and track your custom orders.", href: "#" },
              { label: "Saved Designs", desc: "Return to your saved GiftBuilder configurations.", href: "#" },
              { label: "Address Book", desc: "Manage your shipping addresses.", href: "#" },
              { label: "Account Settings", desc: "Update email, password, and preferences.", href: "#" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block p-6 border border-slate-100 hover:border-[#1A4338] transition-all hover:-translate-y-0.5 group space-y-2"
              >
                <h2 className="font-serif text-xl font-medium text-slate-800 group-hover:text-[#1A4338] transition-colors">
                  {link.label}
                </h2>
                <p className="text-xs text-slate-400">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
