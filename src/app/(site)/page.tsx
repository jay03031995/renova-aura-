import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import HairTransplantFocus from "@/components/home/HairTransplantFocus";
import PlasticSurgeryFocus from "@/components/home/PlasticSurgeryFocus";
import WhyUs from "@/components/home/WhyUs";
import DoctorsSection from "@/components/home/DoctorsSection";
import Results from "@/components/home/Results";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import SimpleBook from "@/components/home/SimpleBook";
import Contact from "@/components/home/Contact";

/**
 * RenovaAura homepage — hair transplant is the dominant pillar (immediately
 * after the hero and trust strip), plastic surgery is the secondary section,
 * then doctors / results / testimonials / FAQ / contact build EEAT trust.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HairTransplantFocus />
      <WhyUs />
      <PlasticSurgeryFocus />
      <DoctorsSection />
      <Results />
      <Testimonials />
      <Faq />
      <SimpleBook />
      <Contact />
    </>
  );
}
