import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "@/components/BookButton";
import FaqItem from "@/components/FaqItem";
import { LocationPageView, TrackedLink } from "@/components/LocationAnalytics";
import { Clock, MapPin, Phone, WhatsappLogo } from "@/components/icons";
import { NCR_AREAS } from "@/data/locations";
import { telHref, waHref } from "@/data/clinic";
import { getAllLocations, getClinic, getConcerns, getDoctors, getGalleryImages, getLocationByCityArea, getProcedures } from "@/sanity/lib/fetchers";
import { SITE_URL } from "@/lib/siteUrl";

type Params = Promise<{ city: string; area: string }>;

export async function generateStaticParams() {
  return (await getAllLocations()).map((a) => ({ city: a.citySlug, area: a.areaSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, area } = await params;
  const location = await getLocationByCityArea(city, area);
  if (!location) return {};
  const title = location.metaTitle || `Skin, Hair & Cosmetic Clinic near ${location.area} | RenovaAura`;
  const description = location.metaDescription || `Visit RenovaAura near ${location.area} for dermatologist-led skin, hair and cosmetic treatment options. Book a personalised consultation in Delhi NCR.`;
  return { title, description, alternates: { canonical: `/locations/${city}/${area}` }, openGraph: { title, description, url: `${SITE_URL}/locations/${city}/${area}` } };
}

export default async function AreaPage({ params }: { params: Params }) {
  const { city, area } = await params;
  const [location, clinic, doctors, procedures, concerns, gallery] = await Promise.all([
    getLocationByCityArea(city, area), getClinic(), getDoctors(), getProcedures(), getConcerns(), getGalleryImages(),
  ]);
  if (!location) return notFound();
  const hair = procedures.filter((p) => p.pillar === "hair-transplant").slice(0, 6);
  const cosmetic = procedures.filter((p) => p.pillar === "plastic-surgery").slice(0, 6);
  const skin = concerns.slice(0, 6);
  const clinicImages = gallery.filter((image) => image.category === "Clinic" && image.image);
  const nearby = NCR_AREAS.filter((a) => a.areaSlug !== area && (a.citySlug === city || ["new-delhi","noida","ghaziabad"].includes(a.citySlug))).slice(0, 16);
  const intro = location.intro || `RenovaAura is a dermatologist-led skin, hair and cosmetic clinic in Anand Vihar welcoming patients from ${location.area}, ${location.city}. Our specialists provide individual assessment, transparent treatment planning and evidence-based care in one confirmed clinic location.`;
  const faqs = location.faqs?.length ? location.faqs : [
    { question: `Does RenovaAura have a branch in ${location.area}?`, answer: `RenovaAura has one confirmed clinic at ${clinic.address}. This page is for patients travelling from ${location.area}; it does not claim a separate branch there.` },
    { question: `Which treatments are available near ${location.area}?`, answer: "Consultations cover medical and aesthetic dermatology, hair restoration and transplant options, laser treatments, and cosmetic or reconstructive procedures. Suitability is confirmed after assessment." },
    { question: "How can I book an appointment?", answer: `Use the appointment form, call ${clinic.phone}, or message the care team on WhatsApp. Your preferred time is confirmed by the clinic.` },
    { question: "What are the clinic timings?", answer: clinic.hours },
  ];
  const jsonLd = { "@context": "https://schema.org", "@type": ["MedicalClinic","LocalBusiness"], name: `RenovaAura serving ${location.area}`, description: intro, url: `${SITE_URL}/locations/${city}/${area}`, telephone: clinic.phone, address: { "@type": "PostalAddress", streetAddress: clinic.address } };

  return <>
    <LocationPageView area={location.area} city={location.city} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="area-hero">
      <div className="container">
        <nav className="loc-breadcrumb"><Link href="/">Home</Link><span>›</span><span>Skin, Hair & Cosmetic Clinic</span><span>›</span><span>{location.area}</span></nav>
        <div className="area-hero-grid">
          <div>
            <div className="eyebrow">RENOVAAURA · ANAND VIHAR</div>
            <h1>Skin, Hair & Cosmetic Clinic near {location.area}</h1>
            <div className="area-clinic-facts">
              <p><Clock size={18}/><span><strong>{clinic.hours}</strong></span></p>
              <p><MapPin size={18}/><span>{clinic.address}<br/><TrackedLink event="directions_click" area={location.area} city={location.city} href={clinic.googleMapsLinkUrl} target="_blank">Get directions</TrackedLink></span></p>
            </div>
            <div className="area-hero-actions">
              <BookButton prefill={{ source: `ncr-${area}-hero`, concern: `Consultation from ${location.area}` }} withArrow={false}>Book Appointment</BookButton>
              <TrackedLink className="btn btn-ghost" event="call_click" area={location.area} city={location.city} href={telHref(clinic.phone)}><Phone size={16}/> Call Now</TrackedLink>
              <TrackedLink className="btn area-whatsapp" event="whatsapp_click" area={location.area} city={location.city} href={waHref(`Hi RenovaAura, I am looking for skin, hair or cosmetic treatment near ${location.area}.`)} target="_blank"><WhatsappLogo size={17}/> WhatsApp</TrackedLink>
            </div>
          </div>
          <div className="area-hero-images">
            <div className="area-image-main"><Image src={clinicImages[0]?.image || "/images/doctors/bhawna-bhardwaj.jpg"} alt={clinicImages[0]?.title || "RenovaAura clinic"} fill sizes="(max-width:900px) 100vw, 34vw"/></div>
            <div className="area-image-side"><Image src={clinicImages[1]?.image || "/images/doctors/ankur-bhatia.jpg"} alt={clinicImages[1]?.title || "RenovaAura specialist"} fill sizes="240px"/></div>
          </div>
        </div>
      </div>
    </section>
    <nav className="area-anchor-nav" aria-label="Page sections"><div className="container"><a href="#overview">Overview</a><a href="#treatments">Treatments</a><a href="#doctors">Specialists</a><a href="#areas">Areas Served</a><a href="#faq">FAQ</a><a href="#consultation">Consultation</a></div></nav>
    <section id="overview" className="section area-overview"><div className="container narrow"><h2>RenovaAura serving {location.area}</h2><p>{intro}</p></div></section>
    <section id="treatments" className="section area-treatments"><div className="container"><div className="section-head"><h2>Skin, Hair and Cosmetic Treatment Options</h2><p>Explore common concerns and specialist-led procedures. Recommendations depend on a clinical consultation.</p></div>
      <div className="area-service-columns">
        <ServiceGroup title="Skin & Dermatology" image={skin.find((x) => x.image)?.image} items={skin.map((x) => ({ name: x.name, href: `/concerns/${x.slug}` }))}/>
        <ServiceGroup title="Hair Treatments" image={hair.find((x) => x.image)?.image} items={hair.map((x) => ({ name: x.name, href: `/locations/${city}/${area}/${x.slug}` }))}/>
        <ServiceGroup title="Cosmetic Treatments" image={cosmetic.find((x) => x.image)?.image} items={cosmetic.map((x) => ({ name: x.name, href: `/locations/${city}/${area}/${x.slug}` }))}/>
      </div>
    </div></section>
    <section id="doctors" className="section"><div className="container"><div className="section-head"><h2>Meet the RenovaAura Specialists</h2><p>Board-certified clinicians providing dermatology, hair restoration, plastic surgery and aesthetic care.</p></div><div className="loc-doctor-grid">{doctors.map((d) => <article className="loc-doctor-card" key={d.slug}><div className="loc-doctor-img" style={{ backgroundImage: d.imageUrl ? `url(${d.imageUrl})` : undefined }}/><div className="loc-doctor-body"><div className="loc-doctor-name">{d.name}</div><div className="loc-doctor-title">{d.specialty || d.title}</div><p className="loc-doctor-bio">{d.homeBio}</p><Link href={`/doctors/${d.slug}`} className="btn btn-ghost">View Profile</Link></div></article>)}</div></div></section>
    <section className="section area-consult"><div className="container"><h2>When to book a consultation</h2><div className="area-consult-grid"><div><h3>Common concerns</h3><ul><li>Acne, pigmentation, scars or persistent skin symptoms</li><li>Hair fall, thinning, receding hairline or patchy growth</li><li>Fine lines, laxity, unwanted hair or aesthetic concerns</li><li>Questions about laser, injectables or cosmetic surgery</li></ul></div><div><h3>What to expect</h3><p>A specialist assesses your concern, medical history and goals before discussing suitable options, realistic outcomes, timelines and aftercare.</p><BookButton prefill={{ source: `ncr-${area}-consult`, concern: `Consultation from ${location.area}` }} withArrow={false}>Request an appointment</BookButton></div></div></div></section>
    <section id="areas" className="section"><div className="container area-nearby"><h2>Nearby service areas</h2><p>RenovaAura has one confirmed clinic in Anand Vihar and welcomes patients travelling from these NCR communities.</p><div>{nearby.map((a) => <Link key={`${a.citySlug}-${a.areaSlug}`} href={`/locations/${a.citySlug}/${a.areaSlug}`}>{a.area}</Link>)}</div></div></section>
    <section id="faq" className="section area-faq"><div className="container narrow"><h2>Frequently Asked Questions</h2>{faqs.map((f, i) => <FaqItem key={i} q={f.question} a={f.answer}/>)}</div></section>
    <section id="consultation" className="area-closing"><div className="container"><div><h2>Care that works around your schedule</h2><p>Contact RenovaAura for a personalised consultation at the Anand Vihar clinic.</p></div><BookButton prefill={{ source: `ncr-${area}-footer`, concern: `Consultation from ${location.area}` }} withArrow={false}>Book Appointment</BookButton></div></section>
  </>;
}

function ServiceGroup({ title, image, items }: { title: string; image?: string; items: { name: string; href: string }[] }) {
  return <div className="area-service-group">{image && <div className="area-service-image"><Image src={image} alt={title} fill sizes="(max-width:900px) 100vw, 30vw"/></div>}<div className="area-service-body"><h3>{title}</h3><div>{items.map((item) => <Link key={item.href} href={item.href}>{item.name}<span>→</span></Link>)}</div></div></div>;
}
