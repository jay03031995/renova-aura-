export type Doctor = {
  slug: string;
  name: string;
  title: string;
  specialty: string; // short badge label (e.g. "Dermatology", "Plastic Surgery")
  img: string; // d1 | d2 | d3 — variant identifier for placeholder gradient
  /**
   * Optional local portrait path (e.g. "/images/doctors/bhawna-bhardwaj.jpg").
   * Surfaced through the Sanity fetcher as `imageUrl` so the bgImg() helper
   * in the doctor components picks it up automatically. Sanity-uploaded
   * portraits will override this when the project is connected.
   */
  photo?: string;
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

/**
 * RenovaAura clinical team — 2 senior consultants.
 *
 * The clinic will provide real headshots and updated credentials. The
 * `img` field is a placeholder variant identifier; once Sanity is wired
 * up, doctor portraits should be uploaded via /studio → Doctors and
 * served as `imageUrl` on the fetched record.
 */
export const DOCTORS: Doctor[] = [
  {
    slug: "bhawna-bhardwaj",
    name: "Dr. Bhawna Bhardwaj",
    title: "Senior Consultant Dermatologist & Hair Transplant Surgeon",
    specialty: "Dermatology",
    img: "d1",
    photo: "/images/doctors/bhawna-bhardwaj.jpg",
    focus: "Dermatology · Hair Transplant",
    years: 9,
    homeBio:
      "MBBS, DVDL (Skin & VD). Senior consultant dermatologist and hair transplant surgeon with 9+ years of practice across acne management, pigmentation protocols, hair restoration and energy-based aesthetic devices.",
    short:
      "Dermatology · Hair restoration · Aesthetic medicine",
    listBio:
      "MBBS, DVDL (Skin & VD). Dr. Bhardwaj leads RenovaAura's dermatology and hair restoration practice. Her work spans medical dermatology (acne, melasma, pigmentation) and surgical hair transplant (FUE, DHI, beard and eyebrow restoration). Her approach is evidence-first — she's known for talking patients out of treatments that aren't right for them.",
    statCreds: [
      { n: "MBBS", l: "Medicine" },
      { n: "DVDL", l: "Skin & VD" },
    ],
    listExpertise: [
      "Acne, pigmentation & melasma treatments",
      "Hair loss & hair restoration procedures",
      "Anti-aging & facial aesthetic enhancement",
      "Laser dermatology & energy-based devices",
    ],
    tagline:
      "The right protocol for the right patient — not the most-marketed treatment of the month.",
    detailBio:
      "MBBS, DVDL (Skin & VD). Dr. Bhardwaj is a senior consultant dermatologist and hair transplant surgeon whose practice combines medical dermatology with surgical hair restoration. She trained in skin & VD at a leading Indian medical institution and has spent the last 9+ years building expertise across acne and scar management, melasma protocols calibrated for Indian skin, surgical hair transplant techniques (FUE, DHI, beard, eyebrow), and energy-based aesthetic devices (RF microneedling, HIFU, lasers). Patients consistently describe her consultations as unhurried, honest, and detail-oriented.",
    credentials: [
      {
        i: "MBBS",
        t: "Bachelor of Medicine, Bachelor of Surgery",
        d: "Foundational medical training in clinical medicine and surgery.",
      },
      {
        i: "DVDL",
        t: "Diploma in Venereology, Dermatology and Leprosy",
        d: "Specialised post-graduate training in clinical and cosmetic dermatology with focus on Indian skin types.",
      },
      {
        i: "FUE",
        t: "Hair Transplant Surgery Certification",
        d: "Advanced training in Follicular Unit Extraction, DHI Choi-pen, beard and eyebrow transplantation.",
      },
      {
        i: "✦",
        t: "Aesthetic & Laser Dermatology",
        d: "Multi-platform certification across diode, Nd:YAG, Q-switch and RF-based aesthetic devices.",
      },
    ],
    timeline: [
      { y: "MBBS", t: "Bachelor of Medicine, Bachelor of Surgery" },
      {
        y: "DVDL",
        t: "Diploma in Venereology, Dermatology and Leprosy",
        d: "Post-graduate specialisation in dermatology.",
      },
      {
        y: "Hair Transplant",
        t: "Hair restoration surgery certification",
        d: "FUE, DHI, beard, eyebrow and female hair transplant techniques.",
      },
      {
        y: "RenovaAura",
        t: "Senior Consultant Dermatologist & Hair Transplant Surgeon",
        d: "Leads the dermatology and hair restoration practice.",
      },
      {
        y: "Today",
        t: "9+ years of clinical practice",
        d: "Combining medical dermatology, hair restoration and aesthetic medicine.",
      },
    ],
    expertise: [
      "FUE Hair Transplant",
      "DHI Hair Transplant",
      "Beard & Eyebrow Restoration",
      "Female Hair Transplant",
      "Acne & Acne Scar Management",
      "Pigmentation & Melasma (Cosmelan)",
      "Anti-Wrinkle Therapy (Botox)",
      "Dermal Fillers",
      "Laser Hair Reduction",
      "Q-Switch & Tattoo Removal",
      "RF Microneedling",
      "HIFU Skin Tightening",
    ],
    treatments: [
      { i: "❋", n: "FUE Hair Transplant", c: "Hair Restoration" },
      { i: "❋", n: "DHI Hair Transplant", c: "Hair Restoration" },
      { i: "✦", n: "PRP for Hair Loss", c: "Hair Restoration" },
      { i: "◐", n: "Anti-Wrinkle (Botox)", c: "Injectables" },
      { i: "✶", n: "Cosmelan Protocol", c: "Pigmentation" },
      { i: "⟡", n: "Laser Hair Reduction", c: "Lasers" },
    ],
    quotes: [
      {
        q: "Dr. Bhardwaj walked me through the entire FUE plan before I committed to anything. A year on, the hairline still looks completely natural.",
        n: "Rohit K.",
        d: "FUE Hair Transplant",
      },
      {
        q: "She didn't sell me a treatment, she diagnosed my melasma properly and built a plan I could actually follow. Three months in, the difference is real.",
        n: "Meera S.",
        d: "Cosmelan Protocol",
      },
      {
        q: "Honest consult, no rush, no upsell. That's why I drive across the city for my monthly visit.",
        n: "Aarti J.",
        d: "Acne Management",
      },
    ],
  },
  {
    slug: "ankur-bhatia",
    name: "Dr. Ankur Bhatia",
    title: "Consultant Plastic & Reconstructive Microsurgeon",
    specialty: "Plastic Surgery",
    img: "d2",
    photo: "/images/doctors/ankur-bhatia.jpg",
    focus: "Plastic Surgery · Microsurgery",
    years: 14,
    homeBio:
      "MBBS, MS (General Surgery), M.Ch (Plastic Surgery). Consultant plastic and reconstructive microsurgeon with 14+ years across hand surgery, cosmetic & body contouring, facial reconstruction and complex limb salvage.",
    short:
      "Plastic surgery · Microsurgery · Cosmetic & reconstructive",
    listBio:
      "MBBS, MS (General Surgery), M.Ch (Plastic Surgery). Dr. Bhatia is a board-certified plastic and reconstructive microsurgeon whose practice spans both cosmetic surgery (rhinoplasty, facelift, body contouring) and complex reconstructive work (hand, microsurgery, burns, limb salvage). His M.Ch in Plastic Surgery is the highest formal qualification a plastic surgeon can hold in India — only awarded after 6 years of post-MBBS specialisation.",
    statCreds: [
      { n: "M.Ch", l: "Plastic Surgery" },
      { n: "MS", l: "General Surgery" },
    ],
    listExpertise: [
      "Hand surgery & microsurgery",
      "Burns, diabetic foot & limb salvage",
      "Cosmetic & body contouring procedures",
      "Facial reconstruction & scar revision",
    ],
    tagline:
      "Reconstructive surgery taught me precision. Cosmetic surgery is precision in service of how a patient feels.",
    detailBio:
      "MBBS, MS (General Surgery), M.Ch (Plastic Surgery). Dr. Bhatia trained in general surgery before completing the M.Ch in Plastic Surgery — the highest formal plastic surgery qualification in India, awarded after 6 years of specialised training beyond MBBS. His 14+ years of practice span both ends of the field: reconstructive microsurgery (hand surgery, free-flap reconstruction, burns, diabetic limb salvage) and cosmetic surgery (rhinoplasty, facelift, blepharoplasty, body contouring, gynecomastia). His patients describe his surgical approach as conservative and unhurried — he refuses cases where the indication isn't clear.",
    credentials: [
      {
        i: "MBBS",
        t: "Bachelor of Medicine, Bachelor of Surgery",
        d: "Foundational medical training.",
      },
      {
        i: "MS",
        t: "MS, General Surgery",
        d: "Post-graduate specialisation in general surgery — required foundation for plastic surgery sub-specialisation.",
      },
      {
        i: "M.Ch",
        t: "M.Ch, Plastic Surgery",
        d: "Magister Chirurgiae in Plastic Surgery — India's highest plastic surgery qualification, awarded after 3 additional years of super-specialty training.",
      },
      {
        i: "✦",
        t: "Microsurgery & Reconstructive Surgery Fellowship",
        d: "Advanced training in free-flap reconstruction, hand surgery and complex limb salvage.",
      },
    ],
    timeline: [
      { y: "MBBS", t: "Bachelor of Medicine, Bachelor of Surgery" },
      {
        y: "MS",
        t: "MS, General Surgery",
        d: "3-year general surgery residency — foundation for plastic surgery specialisation.",
      },
      {
        y: "M.Ch",
        t: "M.Ch, Plastic Surgery",
        d: "3-year super-specialty training in plastic and reconstructive surgery.",
      },
      {
        y: "Reconstructive",
        t: "Reconstructive microsurgery practice",
        d: "Hand surgery, free-flap reconstruction, burns, and diabetic limb salvage at tertiary centres.",
      },
      {
        y: "RenovaAura",
        t: "Consultant Plastic & Reconstructive Microsurgeon",
        d: "Leads the surgical practice — both cosmetic and reconstructive.",
      },
      {
        y: "Today",
        t: "14+ years of clinical practice",
        d: "Combining cosmetic refinement with the precision of microsurgical reconstruction.",
      },
    ],
    expertise: [
      "Rhinoplasty",
      "Blepharoplasty",
      "Facelift (Deep-Plane / SMAS)",
      "Liposuction",
      "Breast Augmentation",
      "Tummy Tuck (Abdominoplasty)",
      "Gynecomastia Surgery",
      "Hand Surgery & Microsurgery",
      "Burns Reconstruction",
      "Diabetic Limb Salvage",
      "Free-Flap Reconstruction",
      "Scar Revision",
    ],
    treatments: [
      { i: "✦", n: "Rhinoplasty", c: "Cosmetic Surgery" },
      { i: "✶", n: "Blepharoplasty", c: "Cosmetic Surgery" },
      { i: "◐", n: "Facelift", c: "Cosmetic Surgery" },
      { i: "⟡", n: "Liposuction", c: "Body Contouring" },
      { i: "❋", n: "Gynecomastia Surgery", c: "Body Contouring" },
      { i: "◍", n: "Scar Revision", c: "Reconstructive" },
    ],
    quotes: [
      {
        q: "Dr. Bhatia spent over an hour on my pre-op consultation, simulating the result and explaining every option. The actual outcome looks completely natural.",
        n: "Karan V.",
        d: "Rhinoplasty",
      },
      {
        q: "He could've upsold me on more procedures during my facelift consultation — instead he recommended the minimum I actually needed. Result speaks for itself.",
        n: "Sonia M.",
        d: "Facelift",
      },
      {
        q: "Surgical precision and aesthetic judgement both. I researched plastic surgeons across Delhi for six months before booking him — worth every minute.",
        n: "Asha R.",
        d: "Blepharoplasty",
      },
    ],
  },
];

export const DOCTOR_SLUGS = DOCTORS.map((d) => d.slug);

export const getDoctor = (slug: string): Doctor | undefined =>
  DOCTORS.find((d) => d.slug === slug);
