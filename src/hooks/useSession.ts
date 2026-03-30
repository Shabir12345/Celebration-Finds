"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";

// Lazy singleton
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("Supabase env vars not set — auth features disabled.");
      return null;
    }
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

interface SessionState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

/**
 * Subscribes to Supabase auth state changes and returns the current session.
 * Safe to use before Supabase env vars are configured.
 */
export function useSession() {
  const [state, setState] = useState<SessionState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setState({ user: null, session: null, loading: false });
      return;
    }

    // Get current session on mount
    sb.auth.getSession().then(({ data }) => {
      setState({
        user: data.session?.user ?? null,
        session: data.session ?? null,
        loading: false,
      });
    });

    // Subscribe to auth changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
  };

  return { ...state, signOut, supabase: getSupabase() };
}
