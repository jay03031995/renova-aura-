"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds the `visible` class to `.reveal` elements as they scroll into view,
 * mirroring the design's IntersectionObserver-driven reveal animation.
 * Re-runs on route change so client-navigated pages animate too.
 */
export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    els.forEach((el) => {
      if (!el.classList.contains("visible")) io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
