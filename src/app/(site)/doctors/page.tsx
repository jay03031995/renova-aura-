import type { Metadata } from "next";
import Link from "next/link";
import { getDoctors } from "@/sanity/lib/fetchers";
import { ArrowRight } from "@/components/icons";
import BookButton from "@/components/BookButton";

export const metadata: Metadata = {
  title: "Our Doctors — MD Dermatologists in Dwarka",
  description:
    "Meet the dermatology team at Dermaheal Skin & Hair Clinic, Dwarka. Three MD dermatologists with subspecialties in cosmetic dermatology, aesthetics and lasers.",
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

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <>
      <section className="page-hero page-hero-doctors">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Our dermatology team
          </div>
          <h1>
            Three doctors. Three subspecialties.
            <br />
            <em>One philosophy of care.</em>
          </h1>
          <p>
            Every procedure at Dermaheal is performed personally by a
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
                    <div className="doc-badge-val">Dermatology</div>
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
