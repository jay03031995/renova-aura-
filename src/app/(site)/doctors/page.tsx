import type { Metadata } from "next";
import Link from "next/link";
import { getDoctors } from "@/sanity/lib/fetchers";
import { ArrowRight } from "@/components/icons";
import BookButton from "@/components/BookButton";

export const metadata: Metadata = {
  title: "Our Doctors — MD Dermatologists in Anand Vihar",
  description:
    "Meet the dermatology team at RenovaAura, Anand Vihar, New Delhi. Three MD dermatologists with subspecialties in cosmetic dermatology, aesthetics and lasers.",
  alternates: { canonical: "/doctors" },
};

const bgImg = (url?: string): React.CSSProperties | undefined =>
  url
    ? {
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

const NUM_WORD = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  const n = doctors.length;
  const word = NUM_WORD[n] ?? String(n);
  const docNoun = n === 1 ? "doctor" : "doctors";
  const subNoun = n === 1 ? "subspecialty" : "subspecialties";

  return (
    <>
      <section className="page-hero page-hero-doctors">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Our dermatology team
          </div>
          <h1>
            {word} {docNoun}. {word} {subNoun}.
            <br />
            <em>One philosophy of care.</em>
          </h1>
          <p>
            Every procedure at RenovaAura is performed personally by a
            board-certified MD dermatologist, never delegated. The same doctor
            sees you from consultation through follow-up.
          </p>
        </div>
      </section>

      <section className="doc-list">
        <div className="container">
          {doctors.map((d, i) => (
            <div
              key={d.slug}
              className={"doc-row" + (i % 2 === 1 ? " reverse" : "")}
            >
              <div className="doc-photo-wrap">
                <div className="doc-badge doc-badge-1">
                  <div className="doc-badge-icon">★</div>
                  <div>
                    <div className="doc-badge-label">Rating</div>
                    <div className="doc-badge-val">4.9 / 5</div>
                  </div>
                </div>
                <div className="doc-badge doc-badge-2">
                  <div className="doc-badge-icon">MD</div>
                  <div>
                    <div className="doc-badge-label">Specialty</div>
                    <div className="doc-badge-val">{d.specialty}</div>
                  </div>
                </div>
                <div
                  className={"doc-photo " + d.img}
                  style={bgImg(d.imageUrl)}
                >
                  <div className="doc-photo-label">
                    — portrait, {d.name.split(" ").slice(-1)[0].toLowerCase()}
                  </div>
                </div>
              </div>
              <div className="doc-body">
                <div className="eyebrow">
                  0{i + 1} · {d.short}
                </div>
                <h2>{d.name}</h2>
                <div className="doc-title">{d.title}</div>
                <p className="doc-body-bio">{d.listBio}</p>
                <div className="doc-creds">
                  {/* Experience badge — driven by the Sanity "Years practising"
                      (years) field so editors have a single source of truth. */}
                  {d.years > 0 && (
                    <div className="doc-cred">
                      <div className="doc-cred-num">
                        {d.years}
                        <sup>+ yrs</sup>
                      </div>
                      <div className="doc-cred-label">Experience</div>
                    </div>
                  )}
                  {d.statCreds.map((c, j) => (
                    <div className="doc-cred" key={j}>
                      <div className="doc-cred-num">
                        {c.n}
                        {c.sup && <sup>{c.sup}</sup>}
                      </div>
                      <div className="doc-cred-label">{c.l}</div>
                    </div>
                  ))}
                </div>
                <div className="doc-cta">
                  <Link className="btn btn-primary" href={`/doctors/${d.slug}`}>
                    View profile{" "}
                    <span className="arrow">
                      <ArrowRight />
                    </span>
                  </Link>
                  <BookButton className="btn btn-ghost" withArrow={false}>
                    Book with {d.name.split(" ")[0]}{" "}
                    {d.name.split(" ")[1]?.replace(".", "") ?? ""}
                  </BookButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
