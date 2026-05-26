/**
 * Clinic-level facts. ALL VALUES BELOW ARE PLACEHOLDERS for the
 * RenovaAura launch — replace each with the real address, phones,
 * social handles and hours before going live.
 */
export const CLINIC = {
  name: "RenovaAura",
  tagline:
    "Hair Transplant · Plastic Surgery · Dermatology · Wellness · Aesthetics",
  phone: "+91 00000 00000",
  phone2: "+91 00000 00001",
  email: "hello@renovaaura.com",
  address: "Address — to be confirmed",
  hours: "Mon to Sat 10:00 AM to 7:30 PM · Sun by appointment",
  cities: ["New Delhi"],
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
