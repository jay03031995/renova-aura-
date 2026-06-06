/**
 * NCR location seed data — 40 areas across 5 cities.
 * Used to seed Sanity and as a static fallback.
 *
 * Each entry becomes a Sanity `location` document with _id = `location.{slug}`.
 * The location pages live at /locations/{citySlug}/{areaSlug}/{treatmentSlug}/
 */
export type NcrArea = {
  city: string;        // display name
  citySlug: string;    // URL slug
  area: string;        // display name
  areaSlug: string;    // URL slug
  pincode?: string;
};

export const NCR_AREAS: NcrArea[] = [
  // ── Delhi ──────────────────────────────────────────────────────────────
  { city: "New Delhi", citySlug: "new-delhi", area: "Anand Vihar",       areaSlug: "anand-vihar",       pincode: "110092" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Laxmi Nagar",       areaSlug: "laxmi-nagar",       pincode: "110092" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Preet Vihar",       areaSlug: "preet-vihar",       pincode: "110092" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Vivek Vihar",       areaSlug: "vivek-vihar",       pincode: "110095" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Shahdara",          areaSlug: "shahdara",          pincode: "110032" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Mayur Vihar",       areaSlug: "mayur-vihar",       pincode: "110091" },
  { city: "New Delhi", citySlug: "new-delhi", area: "IP Extension",      areaSlug: "ip-extension",      pincode: "110092" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Karol Bagh",        areaSlug: "karol-bagh",        pincode: "110005" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Connaught Place",   areaSlug: "connaught-place",   pincode: "110001" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Lajpat Nagar",      areaSlug: "lajpat-nagar",      pincode: "110024" },
  { city: "New Delhi", citySlug: "new-delhi", area: "South Extension",   areaSlug: "south-extension",   pincode: "110049" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Saket",             areaSlug: "saket",             pincode: "110017" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Vasant Kunj",       areaSlug: "vasant-kunj",       pincode: "110070" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Dwarka",            areaSlug: "dwarka",            pincode: "110075" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Rohini",            areaSlug: "rohini",            pincode: "110085" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Pitampura",         areaSlug: "pitampura",         pincode: "110034" },
  { city: "New Delhi", citySlug: "new-delhi", area: "Janakpuri",         areaSlug: "janakpuri",         pincode: "110058" },

  // ── Noida ──────────────────────────────────────────────────────────────
  { city: "Noida",     citySlug: "noida",     area: "Sector 18",         areaSlug: "sector-18",         pincode: "201301" },
  { city: "Noida",     citySlug: "noida",     area: "Sector 62",         areaSlug: "sector-62",         pincode: "201309" },
  { city: "Noida",     citySlug: "noida",     area: "Sector 137",        areaSlug: "sector-137",        pincode: "201305" },
  { city: "Noida",     citySlug: "noida",     area: "Sector 50",         areaSlug: "sector-50",         pincode: "201301" },
  { city: "Noida",     citySlug: "noida",     area: "Noida Extension",   areaSlug: "noida-extension",   pincode: "201306" },
  { city: "Noida",     citySlug: "noida",     area: "Greater Noida West",areaSlug: "greater-noida-west",pincode: "201306" },
  { city: "Noida",     citySlug: "noida",     area: "Greater Noida",     areaSlug: "greater-noida",     pincode: "201310" },

  // ── Gurugram ───────────────────────────────────────────────────────────
  { city: "Gurugram",  citySlug: "gurugram",  area: "Sector 29",         areaSlug: "sector-29",         pincode: "122001" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "Sector 14",         areaSlug: "sector-14",         pincode: "122001" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "MG Road",           areaSlug: "mg-road",           pincode: "122002" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "Golf Course Road",  areaSlug: "golf-course-road",  pincode: "122002" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "Cyber City",        areaSlug: "cyber-city",        pincode: "122002" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "Sushant Lok",       areaSlug: "sushant-lok",       pincode: "122009" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "South City",        areaSlug: "south-city",        pincode: "122001" },
  { city: "Gurugram",  citySlug: "gurugram",  area: "Palam Vihar",       areaSlug: "palam-vihar",       pincode: "122017" },

  // ── Ghaziabad ──────────────────────────────────────────────────────────
  { city: "Ghaziabad", citySlug: "ghaziabad", area: "Indirapuram",       areaSlug: "indirapuram",       pincode: "201014" },
  { city: "Ghaziabad", citySlug: "ghaziabad", area: "Vaishali",          areaSlug: "vaishali",          pincode: "201010" },
  { city: "Ghaziabad", citySlug: "ghaziabad", area: "Kaushambi",         areaSlug: "kaushambi",         pincode: "201010" },
  { city: "Ghaziabad", citySlug: "ghaziabad", area: "Raj Nagar Extension",areaSlug: "raj-nagar-extension",pincode: "201017" },
  { city: "Ghaziabad", citySlug: "ghaziabad", area: "Crossings Republik",areaSlug: "crossings-republik",pincode: "201016" },

  // ── Faridabad ──────────────────────────────────────────────────────────
  { city: "Faridabad", citySlug: "faridabad", area: "Sector 16",         areaSlug: "sector-16",         pincode: "121002" },
  { city: "Faridabad", citySlug: "faridabad", area: "NIT Faridabad",     areaSlug: "nit-faridabad",     pincode: "121001" },
  { city: "Faridabad", citySlug: "faridabad", area: "Old Faridabad",     areaSlug: "old-faridabad",     pincode: "121002" },
  { city: "Faridabad", citySlug: "faridabad", area: "Neharpar",          areaSlug: "neharpar",          pincode: "121003" },
];

/** Unique city slugs */
export const CITY_SLUGS = [...new Set(NCR_AREAS.map((a) => a.citySlug))];

/** Lookup an area by city + area slug */
export function findArea(citySlug: string, areaSlug: string): NcrArea | undefined {
  return NCR_AREAS.find((a) => a.citySlug === citySlug && a.areaSlug === areaSlug);
}

/** All areas for a given city */
export function areasForCity(citySlug: string): NcrArea[] {
  return NCR_AREAS.filter((a) => a.citySlug === citySlug);
}
