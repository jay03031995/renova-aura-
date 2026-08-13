export const SITE_URL = "https://www.renovaaura.com";

export function normalizeSiteUrl(url: string | undefined | null) {
  const source = url?.trim() || SITE_URL;

  try {
    const parsed = new URL(source);
    parsed.protocol = "https:";
    if (parsed.hostname === "renovaaura.com") {
      parsed.hostname = "www.renovaaura.com";
    }
    parsed.pathname = parsed.pathname.replace(/\/$/, "");
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return SITE_URL;
  }
}

export function normalizeCanonicalUrl(url: string | undefined | null) {
  if (!url) return SITE_URL;

  try {
    const parsed = new URL(url, SITE_URL);
    parsed.protocol = "https:";
    if (parsed.hostname === "renovaaura.com") {
      parsed.hostname = "www.renovaaura.com";
    }
    parsed.pathname = parsed.pathname.replace(/\/$/, "") || "/";
    return parsed.toString();
  } catch {
    return SITE_URL;
  }
}
