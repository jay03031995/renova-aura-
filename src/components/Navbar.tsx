"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CLINIC, telHref, waHref } from "@/data/clinic";
import { DOCTORS } from "@/data/doctors";
import {
  HAIR_PROCEDURES,
  PLASTIC_PROCEDURES,
} from "@/data/procedures";
import { CONCERNS } from "@/data/concerns";
import { ArrowRight, Phone, WhatsappLogo } from "@/components/icons";
import BookButton from "@/components/BookButton";
import { useBooking } from "@/components/BookingContext";

/**
 * RenovaAura primary navigation.
 *
 * Desktop: two procedure pillars (Hair Transplant / Plastic Surgery) plus
 * Skin Concerns / Doctors get mega-menu dropdowns.
 * Mobile (≤980px): the link bar is hidden and replaced by a WhatsApp quick
 * link + a hamburger that opens a slide-in drawer with the full menu and
 * tap actions.
 */
const MOBILE_LINKS: { label: string; href: string }[] = [
  { label: "Hair Transplant", href: "/procedures/hair-transplant" },
  { label: "Plastic Surgery", href: "/procedures/plastic-surgery" },
  { label: "Skin Concerns", href: "/concerns" },
  { label: "Packages", href: "/packages" },
  { label: "Locations", href: "/locations" },
  { label: "Doctors", href: "/doctors" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Esc while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const hairTop = HAIR_PROCEDURES.slice(0, 6);
  const plasticTop = PLASTIC_PROCEDURES.slice(0, 6);
  const concernTop = CONCERNS.slice(0, 6);

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <Link href="/" className="logo" aria-label={CLINIC.name}>
          <img
            src="/renovaaura-logo.png"
            alt={CLINIC.name}
            className="logo-img"
            width={180}
            height={50}
          />
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
            <Link className="nav-link" href="/packages">
              Packages
            </Link>
          </div>

          <div className="nav-item">
            <Link className="nav-link" href="/locations">
              Locations
            </Link>
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

        {/* Mobile-only controls (≤980px) */}
        <div className="nav-mobile-controls">
          <a
            className="nav-wa"
            href={waHref("Hi RenovaAura, I'd like to ask about a treatment.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <WhatsappLogo size={24} />
          </a>
          <button
            type="button"
            className="nav-book-mobile"
            onClick={() => open()}
          >
            Book
          </button>
          <button
            type="button"
            className={"nav-hamburger" + (menuOpen ? " open" : "")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Slide-in drawer (mobile) */}
      <div
        className={"nav-drawer-backdrop" + (menuOpen ? " open" : "")}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside
        className={"nav-drawer" + (menuOpen ? " open" : "")}
        aria-hidden={!menuOpen}
        aria-label="Menu"
      >
        <button
          type="button"
          className="nav-drawer-close"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          ×
        </button>
        <nav className="nav-drawer-links">
          {MOBILE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-drawer-link"
              onClick={closeMenu}
            >
              {l.label}
              <ArrowRight size={15} />
            </Link>
          ))}
        </nav>

        <div className="nav-drawer-actions">
          <a className="nav-drawer-action" href={telHref()} onClick={closeMenu}>
            <Phone size={17} /> Call
          </a>
          <a
            className="nav-drawer-action"
            href={waHref("Hi RenovaAura, I'd like to ask about a treatment.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            <WhatsappLogo size={18} /> WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="btn btn-primary nav-drawer-book"
          onClick={() => {
            closeMenu();
            open();
          }}
        >
          Book Consultation
          <span className="arrow">
            <ArrowRight />
          </span>
        </button>

        <div className="nav-drawer-hours">{CLINIC.hours}</div>
      </aside>
    </nav>
  );
}
