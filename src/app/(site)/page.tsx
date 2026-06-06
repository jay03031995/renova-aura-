import Hero from "@/components/home/Hero";
import { getHeroSlides } from "@/sanity/lib/fetchers";
import TrustStrip from "@/components/home/TrustStrip";
import ToolsBanner from "@/components/home/ToolsBanner";
import HairTransplantFocus from "@/components/home/HairTransplantFocus";
import PlasticSurgeryFocus from "@/components/home/PlasticSurgeryFocus";
import SkinConcernsSection from "@/components/home/SkinConcernsSection";
import WhyUs from "@/components/home/WhyUs"; // desktop only (hidden ≤640px via CSS)
import DoctorsSection from "@/components/home/DoctorsSection";
// Results + Testimonials hidden until RenovaAura's own patient photos and
// testimonials are available. Re-enable by uncommenting the imports + JSX
// once src/data/site.ts has clinic-reviewed RESULTS and TESTIMONIALS arrays.
// import Results from "@/components/home/Results";
// import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import SimpleBook from "@/components/home/SimpleBook";
import Contact from "@/components/home/Contact";

/**
 * RenovaAura homepage — hair transplant is the dominant pillar (immediately
 * after the hero and trust strip), plastic surgery is the secondary surgical
 * section, skin concerns is the dermatology pillar, then doctors / FAQ /
 * contact build EEAT trust.
 */
export default async function Home() {
  const heroSlides = await getHeroSlides();
  return (
    <>
      <Hero slides={heroSlides ?? undefined} />
      <TrustStrip />
      <ToolsBanner />
      <HairTransplantFocus />
      <PlasticSurgeryFocus />
      <SkinConcernsSection />
      <WhyUs />
      <DoctorsSection />
      {/* <Results /> — unpublished until RenovaAura before/after photos exist */}
      {/* <Testimonials /> — unpublished until RenovaAura testimonials exist */}
      <Faq />
      <SimpleBook />
      <Contact />
    </>
  );
}
