"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wraps protected pages. Shows a skeleton while loading session.
 * Redirects to `/account/login` if not authenticated.
 */
export default function AuthGuard({
  children,
  redirectTo = "/account/login",
}: AuthGuardProps) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
        <div className="space-y-6 w-full max-w-md p-8">
          {/* Skeleton */}
          <div className="h-8 w-40 bg-slate-200 animate-pulse rounded-sm" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 animate-pulse rounded-sm" />
            <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded-sm" />
            <div className="h-4 w-1/2 bg-slate-100 animate-pulse rounded-sm" />
          </div>
          <div className="h-12 bg-slate-200 animate-pulse rounded-sm" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
