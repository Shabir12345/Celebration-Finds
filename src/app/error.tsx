'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="space-y-6 max-w-2xl">
        <h1 className="font-serif text-5xl md:text-8xl font-bold text-accent tracking-tighter leading-none">
          Oops, <span className="italic text-primary">something</span> happened.
        </h1>
        <p className="font-sans text-slate-500 max-w-lg mx-auto font-medium tracking-wide leading-relaxed">
          We encountered an unexpected error while trying to load this celebration. Let's get you back on track.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => reset()}
          className="px-12 py-6 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-2xl hover:-translate-y-1"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-12 py-6 bg-white text-accent border border-slate-200 font-bold uppercase tracking-widest text-[10px] hover:border-accent transition-all shadow-sm hover:-translate-y-1"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
