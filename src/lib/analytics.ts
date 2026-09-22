export type TrackEvent = "page_view" | "appointment_start" | "appointment_submit" | "call_click" | "whatsapp_click" | "directions_click" | "cta_click";

export type TrackingPayload = {
  event: TrackEvent;
  path?: string;
  area?: string;
  city?: string;
  treatmentCategory?: "skin" | "hair" | "cosmetic";
  label?: string;
};

export function getUtmParams() {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  const stored = sessionStorage.getItem("renovaaura-utm");
  const previous = stored ? JSON.parse(stored) as Record<string, string> : {};
  const utm = {
    utmSource: query.get("utm_source") || previous.utmSource || "",
    utmMedium: query.get("utm_medium") || previous.utmMedium || "",
    utmCampaign: query.get("utm_campaign") || previous.utmCampaign || "",
    utmTerm: query.get("utm_term") || previous.utmTerm || "",
    utmContent: query.get("utm_content") || previous.utmContent || "",
  };
  sessionStorage.setItem("renovaaura-utm", JSON.stringify(utm));
  return utm;
}

export function trackEvent(payload: TrackingPayload) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    ...payload,
    path: payload.path || window.location.pathname,
    referrer: document.referrer,
    ...getUtmParams(),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
  } else {
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  }
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", payload.event, payload);
}
