"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log simulated analytics page views in development
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    console.log(`[Analytics] PageView tracked: ${url}`);
    
    // In production, you would trigger Vercel Analytics or Google Analytics here:
    // va.track('pageview', { url });
  }, [pathname, searchParams]);

  return null;
}
