"use client";

import { useEffect } from "react";
import { trackEvent, type TrackEvent } from "@/lib/analytics";

export function LocationPageView({ area, city }: { area: string; city: string }) {
  useEffect(() => { trackEvent({ event: "page_view", area, city }); }, [area, city]);
  return null;
}

export function TrackedLink({ event, area, city, label, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { event: TrackEvent; area: string; city: string; label?: string }) {
  return <a {...props} onClick={(e) => { trackEvent({ event, area, city, label }); props.onClick?.(e); }}>{children}</a>;
}
