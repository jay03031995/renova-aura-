"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CLINIC } from "@/data/clinic";
import { DOCTORS } from "@/data/doctors";
import {
  HAIR_PROCEDURES,
  PLASTIC_PROCEDURES,
} from "@/data/procedures";
import { CONCERNS } from "@/data/concerns";
import { ArrowRight, Phone } from "@/components/icons";
import BookButton from "@/components/BookButton";

/**
 * RenovaAura primary navigation.
 *
 * Two procedure pillars (Hair Transplant / Plastic Surgery) each get a
 * mega-menu dropdown listing the top 6 procedures by pillar plus a "see
 * all" link to the pillar listing page.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hairTop = HAIR_PROCEDURES.slice(0, 6);
  const plasticTop = PLASTIC_PROCEDURES.slice(0, 6);
  const concernTop = CONCERNS.slice(0, 6);

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <Link href="/" className="logo" aria-label={CLINIC.name}>
          <span className="logo-wordmark">RenovaAura</span>
        </Link>

        <div className="nav-links">
          <div className="nav-item">
            <Link
              className="nav-link has-dd"
              href="/procedures/hair-transplant"
            >
              Hair Transplant
            </Link>
            <div className="nav-dd wide">
              <div className="nav-dd-hd">
                Hair restoration · {HAIR_PROCEDURES.length} procedures
              </div>
              {hairTop.map((p) => (
                <Link
                  key={p.slug}
                  className="nav-dd-item"
                  href={`/procedures/hair-transplant/${p.slug}`}
                >
                  <span>{p.name}</span>
                  <small>{p.quick.duration}</small>
                </Link>
              ))}
              <div className="nav-dd-foot">
                <span>All led by board-certified surgeons</span>
                <Link href="/procedures/hair-transplant">
                  See all <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-item">
            <Link
              className="nav-link has-dd"
              href="/procedures/plastic-surgery"
            >
              Plastic Surgery
            </Link>
            <div className="nav-dd wide">
              <div className="nav-dd-hd">
                Plastic surgery · {PLASTIC_PROCEDURES.length} procedures
              </div>
              {plasticTop.map((p) => (
                <Link
                  key={p.slug}
                  className="nav-dd-item"
                  href={`/procedures/plastic-surgery/${p.slug}`}
                >
                  <span>{p.name}</span>
                  <small>{p.quick.duration}</small>
                </Link>
              ))}
              <div className="nav-dd-foot">
                <span>Refined, never overdone</span>
                <Link href="/procedures/plastic-surgery">
                  See all <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-item">
            <Link className="nav-link has-dd" href="/concerns">
              Skin Concerns
            </Link>
            <div className="nav-dd wide">
              <div className="nav-dd-hd">
                Skin concerns · {CONCERNS.length} treated
              </div>
              {concernTop.map((c) => (
                <Link
                  key={c.slug}
                  className="nav-dd-item"
                  href={`/concerns/${c.slug}`}
                >
                  <span>{c.name}</span>
                  <small>{c.cardTagline}</small>
                </Link>
              ))}
              <div className="nav-dd-foot">
                <span>Calibrated for Indian skin</span>
                <Link href="/concerns">
                  See all <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          <div className="nav-item">
            <Link className="nav-link has-dd" href="/doctors">
              Doctors
            </Link>
            <div className="nav-dd">
              <div className="nav-dd-hd">Our specialists</div>
              {DOCTORS.map((d) => (
                <Link
                  key={d.slug}
                  className="nav-dd-item"
                  href={`/doctors/${d.slug}`}
                >
                  <span>{d.name}</span>
                  <small>{d.title}</small>
                </Link>
              ))}
              <div className="nav-dd-foot">
                <span>Board-certified team</span>
                <Link href="/doctors">
                  All doctors <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* Results link hidden — /results page still shows dermaheal-era
              patient photos with @DRNAVJOTARORA watermarks. Re-enable once
              RenovaAura's own before/after gallery is uploaded via /studio. */}
          <Link className="nav-link" href="/#contact">
            Contact
          </Link>
        </div>

        <div className="nav-cta">
          <span className="nav-phone">
            <Phone /> {CLINIC.phone}
          </span>
          <BookButton>Book Consultation</BookButton>
        </div>
      </div>
    </nav>
  );
}
