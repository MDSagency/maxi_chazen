"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToAnchor } from "@/lib/anchor";

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const timer = window.setTimeout(() => {
      scrollToAnchor(hash);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
