"use client";

import posthog from "posthog-js";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

type Props = { children: ReactNode };

export function PostHogProvider({ children }: Props) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: true
    });
    return () => {
      posthog.reset();
    };
  }, []);

  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}

