import type { Metadata } from "next";
import { ArrowRight, MapPin, Phone } from "@/components/icons";
import { CLINIC } from "@/data/clinic";
import BookButton from "@/components/BookButton";
import ResultsGallery from "@/components/ResultsGallery";
import { getResults } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Patient Results — Before & After at Dermaheal Dwarka",
  description:
    "Real patient results from Dermaheal Skin & Hair Clinic, Dwarka — acne scars, pigmentation, hair loss and anti-ageing protocols. Photographed and shared with consent.",
  alternates: { canonical: "/results" },
};

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Real patients · real results
          </div>
          <h1>
            Outcomes you can <em>hold us to.</em>
          </h1>
          <p>
            Every patient story below is referenced, dated and accompanied by
            clinical detail. Filter by concern to see results that match your
            own.
          </p>
          <div className="page-hero-stats">
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">
                11k<sup>+</sup>
              </div>
              <div className="page-hero-stat-label">Verified reviews</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">
                4.9<sup>/5</sup>
              </div>
              <div className="page-hero-stat-label">Google rating</div>
            </div>
            <div className="page-hero-stat">
              <div className="page-hero-stat-num">
                97<sup>%</sup>
              </div>
              <div className="page-hero-stat-label">Would refer a friend</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-section">
        <div className="container">
          <div className="tp-section-head">
            <div className="eyebrow">Outcomes by concern</div>
            <h2>Filter the gallery.</h2>
            <p>
              Each result is grouped by concern so you can see what is realistic
              for cases like yours, then book a consultation to discuss your
              own.
            </p>
          </div>

          <ResultsGallery results={results} />

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <a
              className="btn btn-ghost"
              href="https://dermaheal.co.in/patient-gallery.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse the full archive at dermaheal.co.in{" "}
              <span className="arrow">
                <ArrowRight />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="tp-cta">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Ready when you are
          </div>
          <h2>Book a consultation to discuss your case.</h2>
          <p>
            A one-on-one assessment with an MD dermatologist. A written plan
            with realistic timelines. Walk out knowing exactly what is possible
            for your skin or hair.
          </p>
          <BookButton>Book a consultation</BookButton>
          <div className="tp-cta-contacts">
            <span>
              <Phone /> {CLINIC.phone}
            </span>
            <span>
              <Phone /> {CLINIC.phone2}
            </span>
            <span>
              <MapPin /> Dwarka, New Delhi
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
