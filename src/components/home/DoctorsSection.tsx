import Link from "next/link";
import { getDoctors } from "@/sanity/lib/fetchers";

const bgImg = (url?: string): React.CSSProperties | undefined =>
  url
    ? {
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

const NUM_WORD = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

export default async function DoctorsSection() {
  const doctors = await getDoctors();
  const n = doctors.length;
  const word = NUM_WORD[n] ?? String(n);
  const docNoun = n === 1 ? "doctor" : "doctors";
  const subNoun = n === 1 ? "subspecialty" : "subspecialties";

  return (
    <section className="section doctors" id="doctors">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-head-copy">
            <div className="eyebrow">Meet our dermatologists</div>
            <h2>
              {word} {docNoun}. {word} {subNoun}.{" "}
              <span className="serif-italic" style={{ color: "var(--sage)" }}>
                One philosophy.
              </span>
            </h2>
          </div>
          <p>
            Every procedure at RenovaAura is performed by an MD dermatologist,
            never delegated. The same doctor sees you from consultation through
            follow-up.
          </p>
        </div>
        <div className="doctors-grid">
          {doctors.map((d) => (
            <Link
              key={d.slug}
              className="doctor-card reveal"
              href={`/doctors/${d.slug}`}
            >
              <div
                className={"doctor-img " + d.img}
                style={bgImg(d.imageUrl)}
              />
              {/* Portrait corner-tag removed — looked design-y as a
                  placeholder, distracting over real headshots. */}
              <div className="doctor-body">
                <div className="doctor-name">{d.name}</div>
                <div className="doctor-title">{d.title}</div>
                <div className="doctor-bio">{d.homeBio}</div>
                <div className="doctor-meta">
                  <div className="doctor-meta-item">
                    <div className="doctor-meta-num">
                      {d.years}
                      <sup>yrs</sup>
                    </div>
                    <div className="doctor-meta-label">Practising</div>
                  </div>
                  <div className="doctor-meta-item">
                    <div className="doctor-meta-num">{d.focus}</div>
                    <div className="doctor-meta-label">Focus</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
