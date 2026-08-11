export type BodyConcernSeed = {
  slug: string;
  name: string;
  icon: string;
  cardTagline: string;
  headline: string;
  summary: string;
  symptoms: string[];
  causes: string[];
  approach: string[];
  faqs: { q: string; a: string }[];
};

export const BODY_CONCERNS: BodyConcernSeed[] = [
  {
    slug: "back-acne",
    name: "Back Acne",
    icon: "BA",
    cardTagline: "Breakouts across the upper back and shoulders",
    headline: "Clear recurring back acne with a dermatologist-led body plan.",
    summary:
      "Back acne can be painful, persistent, and difficult to treat with regular skincare because sweat, friction, hormones, and follicular congestion often overlap. RenovaAura builds a body-specific plan after assessment so active acne, marks, and recurrence are managed together.",
    symptoms: [
      "Inflamed bumps, pustules, or cyst-like acne on the back",
      "Dark marks left after breakouts settle",
      "Breakouts that worsen with sweat, gym wear, or tight clothing",
    ],
    causes: [
      "Oil and sweat trapped around hair follicles",
      "Friction from clothing, bags, or workouts",
      "Hormonal acne tendency or comedogenic body products",
    ],
    approach: [
      "Assess whether the bumps are acne, folliculitis, or mixed congestion",
      "Calm active inflammation before treating post-acne pigmentation",
      "Build a body-care routine that reduces recurrence after procedures",
    ],
    faqs: [
      {
        q: "Can back acne marks be treated too?",
        a: "Yes. Active acne is usually controlled first, then pigmentation or textural marks can be treated with a separate protocol.",
      },
    ],
  },
  {
    slug: "shoulder-acne",
    name: "Shoulder Acne",
    icon: "SA",
    cardTagline: "Shoulder breakouts, bumps, and acne marks",
    headline: "Treat shoulder acne and the marks it leaves behind.",
    summary:
      "Shoulder acne often flares from sweat, occlusion, friction, and body-product buildup. A dermatologist-led plan helps distinguish acne from folliculitis and targets both the active lesions and visible marks.",
    symptoms: [
      "Small bumps or inflamed acne on the shoulders",
      "Dark or red marks after breakouts",
      "Flares after workouts, heat, or friction",
    ],
    causes: [
      "Sweat and occlusion around follicles",
      "Friction from straps or tight clothing",
      "Body oils, conditioners, or sunscreen residue",
    ],
    approach: [
      "Identify the acne pattern and triggers",
      "Use medical and procedural steps to reduce active breakouts",
      "Treat pigmentation once the skin is calmer",
    ],
    faqs: [
      {
        q: "Is shoulder acne different from back acne?",
        a: "The triggers are often similar, but shoulder acne can be more friction-driven, so clothing and workout habits are reviewed as part of the plan.",
      },
    ],
  },
  {
    slug: "body-pigmentation",
    name: "Pigmentation on Body",
    icon: "BP",
    cardTagline: "Uneven tone and dark patches on body skin",
    headline: "Improve body pigmentation with calibrated, skin-safe protocols.",
    summary:
      "Body pigmentation may come from friction, post-inflammatory marks, sun exposure, hormonal influences, or prior irritation. RenovaAura plans treatment according to the cause and site, with special care for Indian skin tones.",
    symptoms: [
      "Uneven body tone or dark patches",
      "Marks after acne, rashes, waxing, or irritation",
      "Pigmentation that returns after harsh products",
    ],
    causes: [
      "Friction and repeated irritation",
      "Post-inflammatory hyperpigmentation",
      "Sun exposure, hormonal factors, or aggressive home remedies",
    ],
    approach: [
      "Find the cause before choosing peels, lasers, or topical care",
      "Use conservative settings and barrier support for body skin",
      "Create a maintenance plan to reduce rebound pigmentation",
    ],
    faqs: [
      {
        q: "How long does body pigmentation take to improve?",
        a: "It depends on depth, cause, and location. Most plans need multiple sessions plus home care and trigger control.",
      },
    ],
  },
  {
    slug: "underarm-pigmentation",
    name: "Under Arm Pigmentation",
    icon: "UA",
    cardTagline: "Dark underarms and friction-related tone changes",
    headline: "Address underarm darkening without harsh or risky shortcuts.",
    summary:
      "Underarm pigmentation is commonly linked to friction, shaving, deodorant irritation, hair density, or metabolic factors. Treatment starts with diagnosis so the skin can be brightened without worsening sensitivity.",
    symptoms: [
      "Dark underarm skin or patchy tone",
      "Roughness, irritation, or bumps after shaving",
      "Pigmentation that worsens with deodorants or friction",
    ],
    causes: [
      "Friction and repeated shaving",
      "Irritation from deodorants or depilatory products",
      "Hair shadow, folliculitis, or insulin resistance in some patients",
    ],
    approach: [
      "Review grooming habits, irritation, and medical contributors",
      "Choose gentle brightening and hair-reduction options when suitable",
      "Avoid aggressive bleaching that can trigger more pigmentation",
    ],
    faqs: [
      {
        q: "Can laser hair reduction help dark underarms?",
        a: "It may help when hair shadow, shaving irritation, or follicular inflammation is a major contributor.",
      },
    ],
  },
  {
    slug: "intimate-area-pigmentation",
    name: "Intimate Area Pigmentation",
    icon: "IA",
    cardTagline: "Sensitive-area pigmentation and uneven tone",
    headline: "Plan intimate-area pigmentation care with privacy and caution.",
    summary:
      "Pigmentation in intimate areas is common and can be influenced by friction, hormones, hair removal, weight changes, and natural skin tone variation. RenovaAura approaches this conservatively with a private consultation and site-appropriate options.",
    symptoms: [
      "Darkening in bikini or intimate-area skin",
      "Pigmentation after waxing, shaving, or irritation",
      "Uneven tone with sensitivity or friction",
    ],
    causes: [
      "Friction, moisture, and repeated hair removal",
      "Post-inflammatory pigmentation",
      "Hormonal and natural tone variation",
    ],
    approach: [
      "Assess sensitivity and rule out active irritation first",
      "Use gentle, site-appropriate brightening protocols",
      "Set realistic goals focused on improvement, not unsafe over-lightening",
    ],
    faqs: [
      {
        q: "Is intimate pigmentation treatment painful?",
        a: "Protocols are selected for sensitive skin and comfort. Your dermatologist will explain what is suitable after examination.",
      },
    ],
  },
  {
    slug: "neck-pigmentation",
    name: "Neck Pigmentation",
    icon: "NP",
    cardTagline: "Dark neck, uneven tone, and texture changes",
    headline: "Treat neck pigmentation by addressing the reason it developed.",
    summary:
      "Neck pigmentation can be caused by friction, tanning, post-inflammatory changes, perfume irritation, or metabolic factors. A clinical assessment helps decide whether skincare, peels, devices, or medical evaluation is needed.",
    symptoms: [
      "Dark bands or patches on the neck",
      "Rough or velvety texture",
      "Uneven tone that worsens with friction or sun exposure",
    ],
    causes: [
      "Friction from collars, jewellery, or weight changes",
      "Sun exposure and post-inflammatory pigmentation",
      "Possible insulin resistance or acanthosis-type changes",
    ],
    approach: [
      "Differentiate pigmentation from texture or metabolic changes",
      "Treat the visible tone while reducing friction and irritation",
      "Recommend medical evaluation when signs suggest an internal contributor",
    ],
    faqs: [
      {
        q: "Can neck pigmentation come back?",
        a: "It can return if friction, sun exposure, irritation, or metabolic drivers are not controlled alongside treatment.",
      },
    ],
  },
  {
    slug: "stretch-marks",
    name: "Stretch Marks",
    icon: "SM",
    cardTagline: "Post-pregnancy, weight-change, and growth stretch marks",
    headline: "Soften stretch marks and improve body-skin texture.",
    summary:
      "Stretch marks form when the dermis stretches faster than collagen can adapt. They usually cannot be erased completely, but their colour, width, and texture can often be improved with a staged protocol.",
    symptoms: [
      "Red, purple, white, or silvery lines on body skin",
      "Textural grooves or thin skin over marks",
      "Marks after pregnancy, growth, or weight changes",
    ],
    causes: [
      "Rapid stretching of skin and collagen fibres",
      "Pregnancy, weight fluctuation, or growth spurts",
      "Genetic tendency and hormonal influences",
    ],
    approach: [
      "Assess whether the marks are new, red, mature, or white",
      "Use collagen-stimulating options when suitable",
      "Set honest expectations around improvement rather than complete removal",
    ],
    faqs: [
      {
        q: "Can old white stretch marks improve?",
        a: "Older marks can improve in texture and visibility, though they usually need more sessions and respond more gradually than newer red marks.",
      },
    ],
  },
  {
    slug: "knee-elbow-pigmentation",
    name: "Knee and Elbow Pigmentation",
    icon: "KE",
    cardTagline: "Dark knees, elbows, and friction-prone joints",
    headline: "Improve dark knees and elbows with friction-aware care.",
    summary:
      "Knees and elbows naturally have thicker, more friction-prone skin, so pigmentation often needs a combination of exfoliation control, brightening, hydration, and trigger management.",
    symptoms: [
      "Dark, rough, or thickened skin on knees and elbows",
      "Uneven tone that returns after scrubbing",
      "Dryness or texture around joints",
    ],
    causes: [
      "Repeated friction and pressure",
      "Dryness and thickened surface skin",
      "Post-inflammatory pigmentation from irritation or over-scrubbing",
    ],
    approach: [
      "Reduce roughness and barrier damage first",
      "Use controlled brightening protocols instead of harsh scrubs",
      "Maintain results with hydration and friction reduction",
    ],
    faqs: [
      {
        q: "Should I scrub dark knees and elbows?",
        a: "Aggressive scrubbing can worsen pigmentation. Controlled exfoliation and barrier repair are usually safer.",
      },
    ],
  },
  {
    slug: "lax-skin-abdomen-arms-buttocks",
    name: "Lax Skin over Abdomen, Arms and Buttocks",
    icon: "LS",
    cardTagline: "Loose body skin after weight change, age, or pregnancy",
    headline: "Tighten lax body skin with a plan matched to severity and site.",
    summary:
      "Loose skin over the abdomen, arms, and buttocks can follow pregnancy, ageing, weight loss, or collagen decline. RenovaAura assesses whether non-surgical tightening, contouring, or surgical referral is the right route.",
    symptoms: [
      "Loose or crepey skin on the abdomen, arms, or buttocks",
      "Reduced firmness after pregnancy or weight loss",
      "Skin laxity with mild fat pockets or cellulite-like texture",
    ],
    causes: [
      "Collagen and elastin loss",
      "Pregnancy, ageing, or significant weight fluctuation",
      "Reduced skin retraction after fat loss",
    ],
    approach: [
      "Grade skin laxity and check if fat reduction is also needed",
      "Match energy-based tightening or surgical pathways to the case",
      "Build realistic timelines for collagen remodelling",
    ],
    faqs: [
      {
        q: "Can loose abdominal skin tighten without surgery?",
        a: "Mild to moderate laxity may improve with non-surgical collagen stimulation, while severe laxity may need a surgical opinion.",
      },
    ],
  },
  {
    slug: "sui-treatment",
    name: "SUI Treatment",
    icon: "SU",
    cardTagline: "Stress urinary incontinence support",
    headline: "Discuss stress urinary incontinence in a discreet consultation.",
    summary:
      "Stress urinary incontinence can cause leakage with coughing, laughing, exercise, or lifting. RenovaAura offers a private evaluation and guides patients toward appropriate non-surgical or specialist-led care based on severity.",
    symptoms: [
      "Urine leakage during coughing, sneezing, laughing, or exercise",
      "Avoiding workouts or travel because of leakage",
      "Symptoms after childbirth, menopause, or pelvic-floor strain",
    ],
    causes: [
      "Pelvic-floor weakness",
      "Childbirth, ageing, or hormonal changes",
      "Pressure on the bladder during movement or exertion",
    ],
    approach: [
      "Understand severity, triggers, and medical history",
      "Discuss pelvic-floor and device-based options where suitable",
      "Refer for specialist evaluation when symptoms need medical management",
    ],
    faqs: [
      {
        q: "Is SUI treatment private?",
        a: "Yes. Consultations are handled discreetly, and recommendations are made only after understanding your symptoms and comfort level.",
      },
    ],
  },
  {
    slug: "vaginal-tightening",
    name: "Vaginal Tightening",
    icon: "VT",
    cardTagline: "Intimate wellness and laxity concerns",
    headline: "Explore vaginal tightening options with clinical privacy.",
    summary:
      "Vaginal laxity or intimate wellness concerns may appear after childbirth, ageing, or hormonal changes. A confidential consultation helps determine whether non-surgical support, device-based care, or specialist guidance is appropriate.",
    symptoms: [
      "Feeling of laxity or reduced firmness",
      "Changes after childbirth or ageing",
      "Intimate wellness concerns affecting comfort or confidence",
    ],
    causes: [
      "Childbirth-related tissue stretching",
      "Age-related collagen change",
      "Hormonal shifts and pelvic-floor changes",
    ],
    approach: [
      "Take a private history and understand patient goals",
      "Discuss suitable non-surgical or referral-based options",
      "Prioritise comfort, consent, and realistic expectations",
    ],
    faqs: [
      {
        q: "Do I need an examination before treatment?",
        a: "Your clinician will advise what is appropriate. Some concerns need examination or specialist review before any treatment is planned.",
      },
    ],
  },
  {
    slug: "localized-fat-lipolysis",
    name: "Fat Lipolysis in Localized Areas",
    icon: "FL",
    cardTagline: "Focused fat reduction for small resistant pockets",
    headline: "Target localised fat pockets with assessment-led lipolysis.",
    summary:
      "Localised fat pockets can remain despite diet and exercise. RenovaAura evaluates the area, skin quality, and goals before recommending lipolysis or an alternative body-contouring option.",
    symptoms: [
      "Small resistant fat pockets on selected body areas",
      "Contour concerns despite stable weight",
      "Fat pockets with or without mild skin laxity",
    ],
    causes: [
      "Genetic fat distribution",
      "Weight fluctuation and local fat retention",
      "Skin laxity or muscle tone contributing to contour changes",
    ],
    approach: [
      "Assess whether the concern is fat, laxity, or both",
      "Choose a localised fat-reduction protocol when suitable",
      "Plan maintenance around lifestyle and realistic body goals",
    ],
    faqs: [
      {
        q: "Is lipolysis a weight-loss treatment?",
        a: "No. It is generally for focused contouring of localised areas, not overall weight loss.",
      },
    ],
  },
  {
    slug: "microlift-lipolysis",
    name: "Microlift Lipolysis",
    icon: "ML",
    cardTagline: "Fine contouring with lift-focused lipolysis planning",
    headline: "Refine small contour concerns with microlift lipolysis planning.",
    summary:
      "Microlift lipolysis is positioned for patients who need focused contour refinement with attention to skin support and shape. Suitability depends on fat distribution, laxity, medical history, and treatment goals.",
    symptoms: [
      "Small contour bulges that need precision planning",
      "Mild laxity with localised fat concerns",
      "Desire for subtle body-shape refinement",
    ],
    causes: [
      "Localised fat distribution",
      "Collagen support changes in the treated area",
      "Post-weight-change contour imbalance",
    ],
    approach: [
      "Map the treatment area and skin quality carefully",
      "Plan lipolysis with lift and contour balance in mind",
      "Review aftercare and expected settling timelines before treatment",
    ],
    faqs: [
      {
        q: "Who is a good candidate for microlift lipolysis?",
        a: "Candidates are selected after consultation. It is usually considered for focused contour concerns rather than broad weight reduction.",
      },
    ],
  },
];
