import Link from "next/link";
import { getDoctors } from "@/sanity/lib/fetchers";
import { ArrowRight } from "@/components/icons";
import BookButton from "@/components/BookButton";

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
<div className="reveal mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

  {/* LEFT */}
  <div className="flex flex-col">
    <div className="eyebrow mb-5 text-left">
      Meet our specialists
    </div>

    <h2 className="m-0 max-w-[600px] text-left text-[42px] font-normal leading-[1.08] tracking-[-0.03em] sm:text-[50px] lg:text-[58px]">
      {word} {docNoun}. {word} {subNoun}.
      <br />
      <span
        className="serif-italic"
        style={{ color: "var(--sage)" }}
      >
        One philosophy.
      </span>
    </h2>
  </div>

  {/* RIGHT */}
  <div className="flex items-center justify-center">
    <p className="m-0 max-w-[500px] text-center text-[17px] leading-[1.8] text-[#73796c]">
      Every procedure at RenovaAura is performed personally by a
      board-certified specialist, never delegated. The same doctor sees
      you from consultation through follow-up.
    </p>
  </div>

</div>

        <div className="doc-list">
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
                
                <div className={"doc-photo " + d.img} style={bgImg(d.imageUrl)}>
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
      </div>
    </section>
  );
}
