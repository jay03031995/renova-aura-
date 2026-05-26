export type Doctor = {
  slug: string;
  name: string;
  title: string;
  img: string; // d1 | d2 | d3
  focus: string; // home-card "patients seen" line
  years: number;
  homeBio: string;
  short: string; // doctors-listing eyebrow
  listBio: string;
  statCreds: { n: string; sup?: string; l: string }[];
  listExpertise: string[];
  tagline: string;
  detailBio: string;
  credentials: { i: string; t: string; d: string }[];
  timeline: { y: string; t: string; d?: string }[];
  expertise: string[];
  treatments: { i: string; n: string; c: string }[];
  quotes: { q: string; n: string; d: string }[];
};

export const DOCTORS: Doctor[] = [
  {
    slug: "navjot-arora",
    name: "Dr. Navjot Singh Arora",
    title: "Founder & Chief Dermatologist",
    img: "d1",
    focus: "Skin · Hair · Nail",
    years: 14,
    homeBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Expertise in cosmetic dermatology, acne & scar management, advanced laser procedures and hair restoration.",
    short: "Cosmetic dermatology · Acne & scars · Hair restoration",
    listBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. As the founder of Dermaheal, Dr. Arora has built one of Dwarka's most trusted dermatology practices over the last 14 years. His approach is anchored in honest assessments, ethical recommendations, and clinically calibrated outcomes for Indian skin.",
    statCreds: [
      { n: "14", sup: "yrs", l: "Practising" },
      { n: "9k", sup: "+", l: "Patients seen" },
      { n: "MD", l: "Dermatology" },
    ],
    listExpertise: [
      "Acne & Scar Management",
      "Hair Transplant (FUE)",
      "Anti-Wrinkle Therapy",
      "Laser Procedures",
      "Skin Cancer Screening",
      "Cosmetic Dermatology",
    ],
    tagline:
      "Skin health is medical first, cosmetic second. My job is to get the science right and let the results follow.",
    detailBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. As the founder of Dermaheal, Dr. Arora has built one of Dwarka's most trusted dermatology practices over the last 14 years. His clinical work spans cosmetic dermatology, scar revision, and hair restoration, with a reputation for honest assessments and a no-upsell philosophy.",
    credentials: [
      { i: "MD", t: "MD Dermatology, Venereology & Leprosy", d: "Specialised post-graduate training in clinical and cosmetic dermatology." },
      { i: "FUE", t: "Hair Transplant Certification", d: "Advanced training in Follicular Unit Extraction (FUE) hair restoration." },
      { i: "✦", t: "Cosmetic Dermatology Fellowship", d: "Specialised training in advanced laser and injectable procedures." },
    ],
    timeline: [
      { y: "2012", t: "MBBS, Bachelor of Medicine, Bachelor of Surgery" },
      { y: "2016", t: "MD, Dermatology, Venereology & Leprosy" },
      { y: "2018", t: "Fellowship in Cosmetic Dermatology", d: "Advanced training in laser dermatology and aesthetic medicine." },
      { y: "2020", t: "Founded Dermaheal Skin & Hair Clinic", d: "Established the flagship practice in Sector 7 Dwarka, Delhi." },
      { y: "Today", t: "14+ years of clinical practice", d: "Over 9,000 patients treated across skin, hair and aesthetic concerns." },
    ],
    expertise: [
      "Acne & Acne Scars",
      "Hair Transplant (FUE)",
      "Anti-Wrinkle Therapy (Botox)",
      "Dermal Fillers",
      "MNRF Treatment",
      "Cosmelan Protocol",
      "Laser Resurfacing",
      "Skin Cancer Screening",
      "Q-Switch Laser",
      "Cosmetic Dermatology",
    ],
    treatments: [
      { i: "❋", n: "Hair Transplant", c: "Hair Restoration" },
      { i: "✦", n: "Hair PRP", c: "Hair Restoration" },
      { i: "◐", n: "Anti-Wrinkle (Botox)", c: "Injectables" },
      { i: "✶", n: "Dermal Fillers", c: "Injectables" },
      { i: "⟡", n: "MNRF Treatment", c: "Lasers" },
      { i: "◍", n: "Acne Scar Reduction", c: "Peels" },
    ],
    quotes: [
      { q: "I've been with Dr. Arora for two years. He never recommends anything I don't actually need, that alone is rare.", n: "Priya M.", d: "Acne Management" },
      { q: "My FUE transplant looks completely natural a year on. The hairline he designed matches my face perfectly.", n: "Rohit K.", d: "FUE Hair Transplant" },
      { q: "Honest consult. Detailed plan. No pressure. I drive across Delhi for my monthly visit.", n: "Aarti S.", d: "Cosmelan Program" },
    ],
  },
  {
    slug: "jasmine-kohli",
    name: "Dr. Jasmine Kohli",
    title: "Dermatology Consultant",
    img: "d2",
    focus: "Aesthetic · Anti-Ageing",
    years: 10,
    homeBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Cosmetologist and dermato-surgeon focused on anti-ageing, skin rejuvenation and pigmentation treatments.",
    short: "Anti-ageing · Pigmentation · Aesthetic medicine",
    listBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Dr. Kohli is a board-certified cosmetologist and dermato-surgeon whose work focuses on age-related skin concerns, melasma protocols and aesthetic injectables. Her philosophy: subtle, natural-looking enhancements that respect individual proportions.",
    statCreds: [
      { n: "10", sup: "yrs", l: "Practising" },
      { n: "6k", sup: "+", l: "Patients seen" },
      { n: "MD", l: "Dermatology" },
    ],
    listExpertise: [
      "Anti-Ageing & Wrinkles",
      "Dermal Fillers",
      "Cosmelan / Dermamelan",
      "Skin Rejuvenation",
      "Chemical Peels",
      "PRP & Regenerative",
    ],
    tagline:
      "I think of every patient like family. Subtle, natural, age-appropriate, those are the words that guide my work.",
    detailBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Dr. Kohli is a board-certified cosmetologist and dermato-surgeon whose work focuses on age-related skin concerns, melasma protocols and aesthetic injectables. Her philosophy emphasises subtle, natural-looking enhancements that respect individual proportions and skin biology.",
    credentials: [
      { i: "MD", t: "MD Dermatology, Venereology & Leprosy", d: "Specialised post-graduate training in clinical and cosmetic dermatology." },
      { i: "Aest", t: "Aesthetic Medicine Certification", d: "Advanced training in dermal fillers, botulinum toxin and threads." },
      { i: "✦", t: "Pigmentation Specialist", d: "Cosmelan, Dermamelan and laser pigmentation protocols." },
    ],
    timeline: [
      { y: "2014", t: "MBBS, Bachelor of Medicine, Bachelor of Surgery" },
      { y: "2018", t: "MD, Dermatology, Venereology & Leprosy" },
      { y: "2019", t: "Certified in Aesthetic Medicine", d: "Specialised training in fillers, Botox and thread lift procedures." },
      { y: "2022", t: "Joined Dermaheal as Senior Consultant", d: "Leads the anti-ageing and pigmentation practice at the clinic." },
      { y: "Today", t: "10+ years of clinical practice", d: "Over 6,000 patients treated with a focus on natural-look aesthetics." },
    ],
    expertise: [
      "Anti-Ageing & Wrinkles",
      "Dermal Fillers",
      "Cosmelan & Dermamelan",
      "Skin Rejuvenation",
      "Chemical Peels",
      "PRP & Regenerative",
      "Thread Lifting",
      "Lipolysis Injections",
      "Skin Brightening",
      "Aesthetic Medicine",
    ],
    treatments: [
      { i: "◐", n: "Anti-Wrinkle (Botox)", c: "Injectables" },
      { i: "✶", n: "Dermal Fillers", c: "Injectables" },
      { i: "✦", n: "Cosmelan Treatment", c: "Peels" },
      { i: "❋", n: "Thread Lifting", c: "Injectables" },
      { i: "⟡", n: "Chemical Peeling", c: "Peels" },
      { i: "◍", n: "Face PRP", c: "Regenerative" },
    ],
    quotes: [
      { q: "Cosmelan changed my relationship with my skin. Dr. Kohli walked me through every step.", n: "Meera J.", d: "Cosmelan Protocol" },
      { q: "Most natural fillers I've ever had, even my husband can't tell. That's the goal, right?", n: "Sonam V.", d: "Dermal Fillers" },
      { q: "She talked me out of a procedure I'd asked for because it wasn't right for me. Integrity matters.", n: "Ritu D.", d: "Aesthetic Consultation" },
    ],
  },
  {
    slug: "sonika-soni",
    name: "Dr. Sonika Soni",
    title: "Dermatologist",
    img: "d3",
    focus: "Lasers · Brightening",
    years: 5,
    homeBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Specialises in laser hair removal, tattoo removal, scar reduction and skin brightening treatments.",
    short: "Lasers · Tattoo removal · Skin brightening",
    listBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Dr. Soni specialises in laser-based dermatology, from precision hair reduction across Indian skin tones to tattoo removal and scar revision. She is known for her methodical, evidence-first approach with every patient.",
    statCreds: [
      { n: "5", sup: "yrs", l: "Practising" },
      { n: "3k", sup: "+", l: "Patients seen" },
      { n: "MD", l: "Dermatology" },
    ],
    listExpertise: [
      "Laser Hair Reduction",
      "Tattoo Removal",
      "Q-Switch Laser",
      "Skin Brightening",
      "IPL Therapy",
      "Carbon Laser Facial",
    ],
    tagline:
      "Lasers are powerful tools, but only when you know exactly which one to use, and when not to use one at all.",
    detailBio:
      "MBBS, MD, Dermatology, Venereology & Leprosy. Dr. Soni specialises in laser-based dermatology, from precision hair reduction across Indian skin tones to tattoo removal and scar revision. Her practice is grounded in evidence, calibration, and a deep respect for the science of melanin-rich skin.",
    credentials: [
      { i: "MD", t: "MD Dermatology, Venereology & Leprosy", d: "Specialised post-graduate training in clinical and cosmetic dermatology." },
      { i: "Las", t: "Advanced Laser Certification", d: "Multi-platform training across diode, Nd:YAG, IPL and Q-switch systems." },
      { i: "✦", t: "Indian Skin Specialist", d: "Calibration protocols developed for Fitzpatrick IV to VI skin types." },
    ],
    timeline: [
      { y: "2018", t: "MBBS, Bachelor of Medicine, Bachelor of Surgery" },
      { y: "2022", t: "MD, Dermatology, Venereology & Leprosy" },
      { y: "2023", t: "Advanced Laser Dermatology Training", d: "Multi-platform certification in laser-based dermatology procedures." },
      { y: "2024", t: "Joined Dermaheal", d: "Leads the laser, tattoo removal and skin brightening practice." },
      { y: "Today", t: "5+ years of clinical practice", d: "Over 3,000 patients treated with laser-based protocols." },
    ],
    expertise: [
      "Laser Hair Reduction",
      "Tattoo Removal",
      "Q-Switch Laser",
      "Skin Brightening",
      "IPL Therapy",
      "Carbon Laser Facial",
      "Pigmentation Lasers",
      "Glutathione Therapy",
      "HIFU Skin Tightening",
      "Medifacials",
    ],
    treatments: [
      { i: "⟡", n: "Laser Hair Reduction", c: "Lasers" },
      { i: "◬", n: "Tattoo Removal", c: "Lasers" },
      { i: "✦", n: "Carbon Laser Facial", c: "Lasers" },
      { i: "✶", n: "Glutathione Lightening", c: "Skin" },
      { i: "◐", n: "IPL Treatment", c: "Lasers" },
      { i: "◍", n: "Medifacial", c: "Skin" },
    ],
    quotes: [
      { q: "Eight sessions of laser hair removal and I'm 90 percent reduction. Worth every minute.", n: "Tanya G.", d: "Laser Hair Removal" },
      { q: "She removed a tattoo I'd had for 12 years. Took six sessions, but it's gone, clean.", n: "Vikram S.", d: "Tattoo Removal" },
      { q: "My skin has never looked brighter. The glutathione and facial combo she recommended actually delivers.", n: "Anika R.", d: "Skin Brightening" },
    ],
  },
];

export const DOCTOR_SLUGS = DOCTORS.map((d) => d.slug);

export const getDoctor = (slug: string): Doctor | undefined =>
  DOCTORS.find((d) => d.slug === slug);
