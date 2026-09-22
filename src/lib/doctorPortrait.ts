const VERIFIED_DOCTOR_PORTRAITS: Record<string, string> = {
  "bhawna-bhardwaj": "/images/doctors/bhawna-bhardwaj.jpg",
  "ankur-bhatia": "/images/doctors/ankur-bhatia.jpg",
};

export function doctorPortrait(slug: string, sanityImage?: string) {
  return VERIFIED_DOCTOR_PORTRAITS[slug] ?? sanityImage;
}

export function doctorPortraitPosition(slug: string) {
  return slug === "bhawna-bhardwaj" ? "center 48%" : "center 30%";
}
