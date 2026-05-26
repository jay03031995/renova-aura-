import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDoctorBySlug,
  getDoctorSlugs,
  getDoctors,
} from "@/sanity/lib/fetchers";
import { CLINIC, telHref } from "@/data/clinic";
import { ArrowRight } from "@/components/icons";
import BookButton from "@/components/BookButton";

export async function generateStaticParams() {
  const slugs = await getDoctorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const d = await getDoctorBySlug(slug);
  if (!d) return { title: "Doctor Not Found" };
  return {
    title: `${d.name} — ${d.title}, Dermaheal`,
    description: d.detailBio,
    alternates: { canonical: `/doctors/${slug}` },
    openGraph: {
      title: `${d.name} — ${d.title} · Dermaheal`,
      description: d.detailBio,
      images: d.imageUrl ? [d.imageUrl] : undefined,
    },
  };
}

const bgImg = (url?: string): React.CSSProperties | undefined =>
  url
    ? {
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

export default async function DoctorDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const [d, allDoctors] = await Promise.all([
    getDoctorBySlug(slug),
    getDoctors(),
  ]);
  if (!d) notFound();

  const others = allDoctors.filter((x) => x.slug !== slug);
  const firstName = d.name.split(" ")[0];
  const middle = d.name.split(" ")[1]?.replace(".", "") ?? "";

  return (
    <>
      {/* Hero */}
      <section className="dp-hero">
        <div className="container">
          <div className="dp-crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/doctors">Doctors</Link>
            <span className="sep">/</span>
            <span className="cur">{d.name}</span>
          </div>
          <div className="dp-hero-grid">
            <div className="dp-photo-wrap">
              <div className="dp-badge dp-badge-1">
                <div className="dp-badge-num">
                  4.9<sup>/5</sup>
                </div>
                <div>
                  <div className="dp-badge-label">Google Rating</div>
                </div>
              </div>
              <div className="dp-badge dp-badge-2">
                <div className="dp-badge-num">MD</div>
                <div>
                  <div className="dp-badge-label">Board Certified</div>
                </div>
              </div>
              <div className={"dp-photo " + d.img} style={bgImg(d.imageUrl)}>
                <div className="dp-photo-tag">
                  — portrait, {d.name.split(" ").slice(-1)[0].toLowerCase()}
                </div>
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 18 }}>
                Meet your dermatologist
              </div>
              <h1>{d.name}</h1>
              <div className="dp-doc-title">{d.title}</div>
              <div className="dp-tagline">&ldquo;{d.tagline}&rdquo;</div>
              <p className="dp-bio">{d.detailBio}</p>
              <div className="dp-cta">
                <BookButton>Book a consultation</BookButton>
                <a className="btn btn-ghost" href={telHref()}>
                  Call {CLINIC.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="dp-section">
        <div className="container">
          <div className="dp-head">
            <div className="eyebrow">Credentials</div>
            <h2>Qualified, certified, accountable.</h2>
          </div>
          <div className="dp-creds">
            {d.credentials.map((c, i) => (
              <div className="dp-cred" key={i}>
                <div className="dp-cred-icon">{c.i}</div>
                <div className="dp-cred-title">{c.t}</div>
                <div className="dp-cred-detail">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education timeline */}
      <section className="dp-section alt">
        <div className="container">
          <div className="dp-head">
            <div className="eyebrow">Education & experience</div>
            <h2>The path to this practice.</h2>
          </div>
          <div className="dp-timeline">
            {d.timeline.map((t, i) => (
              <div className="dp-timeline-item" key={i}>
                <div className="dp-timeline-dot" />
                <div className="dp-timeline-year">{t.y}</div>
                <div className="dp-timeline-title">{t.t}</div>
                {t.d && <div className="dp-timeline-detail">{t.d}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="dp-section">
        <div className="container">
          <div className="dp-head">
            <div className="eyebrow">Areas of expertise</div>
            <h2>Specialised in what matters to you.</h2>
          </div>
          <div className="dp-expertise">
            {d.expertise.map((e, i) => (
              <span className="dp-expertise-pill" key={i}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments performed */}
      <section className="dp-section alt">
        <div className="container">
          <div className="dp-head">
            <div className="eyebrow">Treatments performed</div>
            <h2>
              What {firstName} {middle} does at Dermaheal.
            </h2>
          </div>
          <div className="dp-treats">
            {d.treatments.map((t, i) => (
              <Link key={i} className="dp-treat" href="/treatments">
                <div className="dp-treat-icon">{t.i}</div>
                <div className="dp-treat-body">
                  <div className="dp-treat-name">{t.n}</div>
                  <div className="dp-treat-cat">{t.c}</div>
                </div>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Patient quotes */}
      <section className="dp-section">
        <div className="container">
          <div className="dp-head">
            <div className="eyebrow">Patient stories</div>
            <h2>In their words.</h2>
          </div>
          <div className="dp-quotes">
            {d.quotes.map((q, i) => (
              <div className="dp-quote" key={i}>
                <div className="dp-quote-stars">★ ★ ★ ★ ★</div>
                <div className="dp-quote-text">&ldquo;{q.q}&rdquo;</div>
                <div className="dp-quote-name">{q.n}</div>
                <div className="dp-quote-detail">{q.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other doctors */}
      <section className="dp-section alt">
        <div className="container">
          <div className="dp-head">
            <div className="eyebrow">Meet the team</div>
            <h2>Other dermatologists at Dermaheal.</h2>
          </div>
          <div className="dp-others">
            {others.map((o) => (
              <Link
                className="dp-other"
                href={`/doctors/${o.slug}`}
                key={o.slug}
              >
                <div
                  className={"dp-other-img " + o.img}
                  style={bgImg(o.imageUrl)}
                />
                <div>
                  <div className="dp-other-name">{o.name}</div>
                  <div className="dp-other-title">{o.title}</div>
                  <div className="dp-other-bio">
                    {o.detailBio.split(".").slice(0, 1).join(".") + "."}
                  </div>
                </div>
                <div className="dp-other-arrow">
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dp-cta-section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Book Appointment
          </div>
          <h2>
            Consult with {firstName} {middle}.
          </h2>
          <p>
            A one-on-one assessment, a written treatment plan, and honest
            guidance, that&apos;s how every appointment at Dermaheal begins.
          </p>
          <BookButton>Book Appointment</BookButton>
        </div>
      </section>
    </>
  );
}
