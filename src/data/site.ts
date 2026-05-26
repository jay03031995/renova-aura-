export const EEAT = [
  { letter: "E", title: "Experience You Can See", desc: "Three MD-Dermatology specialists with a combined 29+ years of clinical experience treating Indian skin and hair." },
  { letter: "E", title: "Expertise That's Earned", desc: "Every procedure (injectables, lasers, hair restoration, surgery) is performed personally by an MD dermatologist." },
  { letter: "A", title: "Authoritative Protocols", desc: "Treatments calibrated for Indian skin types. Cosmelan, MNRF, HIFU and laser protocols rooted in clinical evidence." },
  { letter: "T", title: "Trust & Transparency", desc: "Honest written plans. Realistic outcomes. No high-pressure upselling, ever. Long-term skin health, not quick fixes." },
];

export type Result = {
  id: string;
  name: string;
  cat: string;
  weeks: string;
  sessions: string;
  patient: string;
  concern: string;
  img: string;
};

export const RESULTS: Result[] = [
  { id: "r1", name: "Acne Scar Reduction (MNRF)", cat: "Acne Scars", weeks: "16 weeks", sessions: "3 sessions, 4 wks apart", patient: "Adult patient", concern: "Rolling + box scars", img: "https://dermaheal.co.in/assets/DermaHeal/Acne%20Scar%20(2).jpg" },
  { id: "r2", name: "Cosmelan for Melasma", cat: "Pigmentation", weeks: "12 weeks", sessions: "1 mask + home care", patient: "Adult patient", concern: "Hyperpigmentation", img: "https://dermaheal.co.in/assets/DermaHeal/hyperpig%20(6).jpg" },
  { id: "r3", name: "Hair PRP Protocol", cat: "Hair Loss", weeks: "24 weeks", sessions: "6 sessions monthly", patient: "Adult patient", concern: "Diffuse thinning crown", img: "https://dermaheal.co.in/assets/DermaHeal/hair%20loss%20(8).jpg" },
  { id: "r4", name: "Anti-wrinkle Therapy (Botox)", cat: "Anti-Ageing", weeks: "2 weeks", sessions: "Single visit", patient: "Adult patient", concern: "Forehead lines + glabella", img: "https://dermaheal.co.in/assets/DermaHeal/Botox.jpg" },
];

export const RESULT_CATS = ["All", "Acne Scars", "Pigmentation", "Hair Loss", "Anti-Ageing"];

export const TESTIMONIALS = [
  { q: "I had tried multiple clinics for my melasma before Dermaheal. Dr. Arora actually explained what was happening to my skin and built a plan around it. Three months in, the difference is undeniable.", name: "Meera Sharma", detail: "Cosmelan Program · Dwarka" },
  { q: "What stood out was the honesty in the consultation. They talked me out of one treatment I'd asked for because it wasn't right for me. That kind of integrity is rare in aesthetics.", name: "Karthik Verma", detail: "Acne Management · Dwarka" },
  { q: "Six sessions of Hair PRP and the regrowth speaks for itself. The team genuinely cares, every follow-up was unhurried and detailed.", name: "Ananya Singh", detail: "Hair PRP · Dwarka" },
];

export const FAQS = [
  { q: "Are your treatments safe for Indian skin tones?", a: "Yes. Every laser, peel and injectable we offer is calibrated for higher-melanin skin. Our protocols are developed in-house and our dermatologists are trained specifically on Indian skin types. If a treatment isn't safe for your skin, we'll tell you and recommend a better-suited alternative." },
  { q: "What does a first consultation include?", a: "A one-on-one session with one of our MD dermatologists. We assess your skin or hair concern, discuss medical history, and share a written treatment plan with realistic timelines. There is no obligation to book any procedure." },
  { q: "How is the cost of a treatment determined?", a: "Your dermatologist shares a complete, itemised plan during your consultation once your skin has been assessed. Plans are shared before any treatment begins, never high-pressure, never surprise-billed. We are happy to share an estimate range on WhatsApp before you book." },
  { q: "Where is Dermaheal located?", a: "Dermaheal Skin & Hair Clinic is at C-712, Ramphal Chowk, Block D, Sector 7 Dwarka, near Shiksha Bharti School, New Delhi 110075. We are easily reachable from across West Delhi and Gurgaon." },
  { q: "What are your clinic hours?", a: "Monday to Saturday, 10:00 AM to 7:30 PM. Sunday, 10:00 AM to 7:00 PM. Same-day slots are usually available, call +91 80809 10191 or WhatsApp us to check availability." },
  { q: "What is the typical downtime after a treatment?", a: "Most of our treatments, medifacials, chemical peels, laser toning, IPL, have zero downtime. MNRF, thread lifts and certain laser procedures have 3 to 7 days of social downtime. We always tell you what to expect and plan the procedure around your schedule." },
];

export const TRUST_ITEMS = [
  { icon: "shield", text: "MD Dermatologist led" },
  { icon: "award", text: "FDA-approved devices" },
  { icon: "check", text: "USFDA-cleared injectables" },
  { icon: "sparkle", text: "Calibrated for Indian skin" },
  { icon: "calendar", text: "6-month outcome support" },
];

export const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  "Hair Transplant": [
    { label: "FUE Hair Transplant", href: "/procedures/hair-transplant/fue-hair-transplant" },
    { label: "DHI Hair Transplant", href: "/procedures/hair-transplant/dhi-hair-transplant" },
    { label: "FUT Hair Transplant", href: "/procedures/hair-transplant/fut-hair-transplant" },
    { label: "Beard Transplant", href: "/procedures/hair-transplant/beard-transplant" },
    { label: "PRP for Hair Loss", href: "/procedures/hair-transplant/prp-hair-treatment" },
    { label: "All Hair Procedures", href: "/procedures/hair-transplant" },
  ],
  "Plastic Surgery": [
    { label: "Rhinoplasty", href: "/procedures/plastic-surgery/rhinoplasty" },
    { label: "Blepharoplasty", href: "/procedures/plastic-surgery/blepharoplasty" },
    { label: "Facelift", href: "/procedures/plastic-surgery/facelift" },
    { label: "Liposuction", href: "/procedures/plastic-surgery/liposuction" },
    { label: "Botox / Fillers", href: "/procedures/plastic-surgery/botox" },
    { label: "All Procedures", href: "/procedures/plastic-surgery" },
  ],
  Clinic: [
    { label: "Our Doctors", href: "/doctors" },
    { label: "Patient Results", href: "/results" },
    { label: "Patient Stories", href: "/#testimonials" },
    { label: "FAQs", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],
  Resources: [
    { label: "Book a Consultation", href: "/#book" },
    { label: "All Procedures", href: "/procedures" },
  ],
};
