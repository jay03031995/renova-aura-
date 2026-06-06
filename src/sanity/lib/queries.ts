/**
 * GROQ query strings for every fetcher in fetchers.ts.
 */

export const clinicSettingsQuery = /* groq */ `
  *[_type == "clinicSettings"][0]{
    name, tagline, address, hours, phone, phone2, email,
    googleMapsEmbedUrl, googleMapsLinkUrl, shopUrl,
    instagramUrl, youtubeUrl, linkedinUrl,
    "logo": logo.asset->{_id, url}
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0]{
    siteUrl, defaultMetaTitle, titleTemplate, defaultMetaDescription,
    "defaultOgImage": defaultOgImage.asset->{_id, url},
    footerColumns[]{title, links[]{label, href}},
    footerBottomNote,
    heroEyebrow, heroHeadline, heroSubhead
  }
`;

export const announcementQuery = /* groq */ `
  *[_type == "announcementBar"][0]{ enabled, message, linkLabel, linkUrl }
`;

export const packagesQuery = /* groq */ `
  *[_type == "package" && enabled != false] | order(order asc, name asc){
    "slug": slug.current,
    name, category, includes, price, concernSlug, order
  }
`;

export const heroSlidesQuery = /* groq */ `
  *[_type == "heroSlide" && enabled != false] | order(order asc, _createdAt asc){
    eyebrow, headlineLine1, headlineLine2, subtitle,
    ctaLabel, secondaryLabel, secondaryHref,
    "image": image.asset->url,
    imageAlt
  }
`;

const seoProjection = /* groq */ `
  seo{ title, description, canonicalUrl, noIndex,
    "ogImage": ogImage.asset->{_id, url}
  }
`;

// =========================================================================
// Procedures (Hair Transplant + Plastic Surgery)
// =========================================================================

const procedureCardProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  pillar,
  tag,
  headline,
  "image": image.asset->{_id, url},
  quickDuration,
  quickSessions,
  "order": coalesce(order, 999)
`;

export const proceduresQuery = /* groq */ `
  *[_type == "procedure"] | order(pillar asc, order asc, name asc){
    ${procedureCardProjection}
  }
`;

export const proceduresByPillarQuery = /* groq */ `
  *[_type == "procedure" && pillar == $pillar] | order(order asc, name asc){
    ${procedureCardProjection}
  }
`;

export const procedureBySlugQuery = /* groq */ `
  *[_type == "procedure" && slug.current == $slug][0]{
    ${procedureCardProjection},
    overview,
    quickDowntime,
    quickAnaesthesia,
    keyPoints,
    suitableFor,
    process[]{title, description},
    benefits[]{icon, title, description},
    faqs[]{question, answer},
    medicallyReviewedBy,
    lastReviewed
  }
`;

export const procedureSlugsQuery = /* groq */ `
  *[_type == "procedure" && defined(slug.current)][]{
    "slug": slug.current,
    pillar
  }
`;

// =========================================================================
// Skin Concerns
// =========================================================================

const concernCardProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  icon,
  cardTagline,
  "image": image.asset->{_id, url},
  "order": coalesce(order, 999)
`;

export const concernsQuery = /* groq */ `
  *[_type == "concern"] | order(order asc, name asc){
    ${concernCardProjection}
  }
`;

export const concernBySlugQuery = /* groq */ `
  *[_type == "concern" && slug.current == $slug][0]{
    ${concernCardProjection},
    headline,
    summary,
    symptoms,
    causes,
    approach,
    "relatedProcedures": relatedProcedures[]->{ ${procedureCardProjection}, overview },
    faqs[]{question, answer}
  }
`;

export const concernSlugsQuery = /* groq */ `
  *[_type == "concern" && defined(slug.current)][].slug.current
`;

const doctorCardProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  title,
  specialty,
  imageVariant,
  years,
  focusLine,
  homeBio,
  "portrait": portrait.asset->{_id, url}
`;

export const doctorsQuery = /* groq */ `
  *[_type == "doctor"] | order(order asc){
    ${doctorCardProjection},
    shortLine,
    listBio,
    statCreds[]{value, superscript, label},
    listExpertise
  }
`;

export const doctorBySlugQuery = /* groq */ `
  *[_type == "doctor" && slug.current == $slug][0]{
    ${doctorCardProjection},
    shortLine,
    listBio,
    statCreds[]{value, superscript, label},
    listExpertise,
    tagline,
    detailBio,
    credentials[]{icon, title, description},
    timeline[]{year, title, description},
    expertise,
    treatments[]{icon, name, category},
    quotes[]{quote, name, detail},
    ${seoProjection}
  }
`;

export const doctorSlugsQuery = /* groq */ `
  *[_type == "doctor" && defined(slug.current)][].slug.current
`;

export const resultsQuery = /* groq */ `
  *[_type == "result" && consentOnFile == true] | order(order asc){
    _id,
    name,
    category,
    weeks,
    sessions,
    patient,
    concern,
    externalImageUrl,
    "image": image.asset->{_id, url},
    "treatmentSlug": treatment->slug.current
  }
`;

export const testimonialsQuery = /* groq */ `
  *[_type == "testimonial" && showOnHomepage == true] | order(order asc){
    quote, name, detail
  }
`;

export const homepageFaqsQuery = /* groq */ `
  *[_type == "homepageFaq"] | order(order asc){ question, answer }
`;

export const eeatPillarsQuery = /* groq */ `
  *[_type == "eeatPillar"] | order(order asc){
    letter, title, description,
    "imageUrl": image.asset->url
  }
`;

export const trustItemsQuery = /* groq */ `
  *[_type == "trustItem"] | order(order asc){ icon, text }
`;
