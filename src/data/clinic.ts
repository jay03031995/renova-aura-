/**
 * Clinic-level facts. The address is confirmed; phone, email, and social
 * handles are still placeholders — replace before launch.
 */
export const CLINIC = {
  name: "RenovaAura",
  tagline:
    "Hair Transplant · Plastic Surgery · Dermatology · Wellness · Aesthetics",
  phone: "+91 00000 00000",
  phone2: "+91 00000 00001",
  email: "hello@renovaaura.com",
  address:
    "First Floor, Plot No C/3, Block B, Surya Niketan, Anand Vihar, New Delhi, Delhi, 110092",
  // Structured pieces used for schema.org JSON-LD and Google Maps queries.
  addressParts: {
    streetAddress: "First Floor, Plot No C/3, Block B, Surya Niketan",
    locality: "Anand Vihar",
    region: "New Delhi",
    postalCode: "110092",
    country: "IN",
  },
  /** Free-form Google Maps query for the embed + link-out. */
  mapsQuery:
    "RenovaAura+Surya+Niketan+Anand+Vihar+Delhi+110092",
  hours: "Mon to Sat 10:00 AM to 7:30 PM · Sun by appointment",
  cities: ["Anand Vihar", "New Delhi"],
  shopUrl: "https://renovaaura.com",
  social: {
    instagram: "https://instagram.com/renovaaura",
    youtube: "https://youtube.com/@renovaaura",
    linkedin: "https://linkedin.com/company/renovaaura",
  },
};

const digits = (s: string) => s.replace(/[^0-9]/g, "");

export const telHref = (phone: string = CLINIC.phone) =>
  "tel:" + phone.replace(/\s/g, "");

export const waHref = (text?: string) => {
  const base = "https://wa.me/91" + digits(CLINIC.phone).slice(-10);
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};
