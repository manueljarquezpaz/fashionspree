"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScriptsInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Every time the route changes, re-run the legacy main.js logic
    if (typeof window !== "undefined" && (window as any).reInitTheme) {
      (window as any).reInitTheme();
    }
  }, [pathname]);

  return null;
}
