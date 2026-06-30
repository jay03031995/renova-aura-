/**
 * Clinic-level facts. The address and phone are confirmed; email and social
 * handles are still placeholders — replace before launch.
 */
export const CLINIC = {
  name: "RenovaAura",
  tagline:
    "Hair Transplant · Plastic Surgery · Dermatology · Wellness · Aesthetics",
  phone: "+91 92052 20070",
  email: "info@renovaaura.com",
  address: "C-3, 1st floor, Anand Vihar, New Delhi, 110092",
  // Structured pieces used for schema.org JSON-LD and Google Maps queries.
  addressParts: {
    streetAddress: "C-3, 1st floor",
    locality: "Anand Vihar",
    region: "New Delhi",
    postalCode: "110092",
    country: "IN",
  },
  /** Free-form Google Maps query for the embed + link-out. */
  mapsQuery:
    "RenovaAura+C-3+1st+floor+Anand+Vihar+New+Delhi+110092",
  hours: "Mon to Sat 10:00 AM to 7:30 PM · Sun: 10:00 AM to 2:00 PM",
  cities: ["Anand Vihar", "New Delhi"],
  shopUrl: "https://renovaaura.com",
  social: {
    instagram: "https://instagram.com/renovaaura",
    youtube: "https://youtube.com/@renovaaura",
    linkedin: "https://linkedin.com/company/renovaaura",
  },
};

const digits = (s: string) => s.replace(/[^0-9]/g, "");

/**
 * Default pre-filled WhatsApp greeting — on-brand and lists the full service
 * line so every chat opens warmly and advertises what RenovaAura offers.
 * Single source of truth: pass a custom string to waHref() to override.
 */
export const WHATSAPP_GREETING =
  "Hi RenovaAura 👋 I'd like to know more about your treatments — Hair Transplant, Plastic Surgery, Dermatology, Wellness & Aesthetics. Could you help me book a consultation?";

export const telHref = (phone: string = CLINIC.phone) =>
  "tel:" + phone.replace(/\s/g, "");

export const waHref = (
  text: string = WHATSAPP_GREETING,
  phone: string = CLINIC.phone,
) => {
  const base = "https://wa.me/91" + digits(phone).slice(-10);
  return `${base}?text=${encodeURIComponent(text)}`;
};
