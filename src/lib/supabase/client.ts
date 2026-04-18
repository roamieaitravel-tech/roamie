"use client";

import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client or handle the missing variables gracefully during build
    return createBrowserClient("http://localhost:54321", "fake-key");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
