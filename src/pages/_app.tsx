import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        updateSupabaseCookie(event, session);
        if (session) {
          router.push("/app");
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  });

  async function updateSupabaseCookie(
    event: AuthChangeEvent,
    session: Session | null
  ) {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  }

  return <Component {...pageProps} />;
}

export default MyApp;
