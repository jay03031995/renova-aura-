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

const seoProjection = /* groq */ `
  seo{ title, description, canonicalUrl, noIndex,
    "ogImage": ogImage.asset->{_id, url}
  }
`;

const treatmentCardProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "category": category->{key, title},
  imageVariant,
  "thumbnail": thumbnail.asset->{_id, url},
  shortDescription,
  duration,
  tag
`;

export const treatmentCardsQuery = /* groq */ `
  *[_type == "treatment"] | order(category->key asc, name asc){
    ${treatmentCardProjection}
  }
`;

export const treatmentBySlugQuery = /* groq */ `
  *[_type == "treatment" && slug.current == $slug][0]{
    ${treatmentCardProjection},
    headline,
    overview,
    quickDuration,
    quickSessions,
    quickDowntime,
    keyPoints,
    suitableFor,
    process[]{title, description},
    benefits[]{icon, title, description},
    faqs[]{question, answer},
    "heroImage": heroImage.asset->{_id, url},
    ${seoProjection}
  }
`;

export const treatmentSlugsQuery = /* groq */ `
  *[_type == "treatment" && defined(slug.current)][].slug.current
`;

export const treatmentCategoriesQuery = /* groq */ `
  *[_type == "treatmentCategory"] | order(order asc){ key, title, description }
`;

const concernProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  icon,
  cardTagline,
  imageVariant
`;

export const concernsQuery = /* groq */ `
  *[_type == "concern"] | order(order asc, name asc){
    ${concernProjection}
  }
`;

export const concernBySlugQuery = /* groq */ `
  *[_type == "concern" && slug.current == $slug][0]{
    ${concernProjection},
    headline,
    summary,
    symptoms,
    causes,
    approach,
    "image": image.asset->{_id, url},
    "treatments": treatments[]->{ ${treatmentCardProjection}, overview },
    faqs[]{question, answer},
    ${seoProjection}
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
  *[_type == "eeatPillar"] | order(order asc){ letter, title, description }
`;

export const trustItemsQuery = /* groq */ `
  *[_type == "trustItem"] | order(order asc){ icon, text }
`;
