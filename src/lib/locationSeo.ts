type LocationSeoInput = {
  area: string;
  city: string;
  treatment?: string;
  doctor?: string;
  customKeywords?: string[] | string | null;
};

export function locationSeoKeywords({ area, city, treatment, doctor, customKeywords }: LocationSeoInput) {
  const service = treatment ?? "skin hair and cosmetic treatment";
  const safeCustomKeywords = Array.isArray(customKeywords)
    ? customKeywords
    : typeof customKeywords === "string"
      ? customKeywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
      : [];
  return Array.from(new Set([
    ...safeCustomKeywords,
    `${service} near ${area}`,
    `${service} in ${area}`,
    `skin clinic near ${area}`,
    `dermatologist near ${area}`,
    `skin specialist near ${area}`,
    `hair dermatologist near ${area}`,
    `skin and hair clinic near ${area}`,
    `skin treatment near ${area}`,
    `cosmetic clinic near ${area}`,
    `dermatologist in ${city}`,
    `skin clinic in ${city}`,
    "dermatologist near me",
    "skin clinic near me",
    "skin specialist near me",
    doctor ? `${doctor} ${service}` : "RenovaAura",
  ]));
}

export const indexableRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};
