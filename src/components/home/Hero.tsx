"use client";

/**
 * RenovaAura homepage hero — 3-slide carousel matching the reference design.
 *
 * Layout per slide:
 *  - Full-bleed image on the right (60% of viewport on desktop)
 *  - Sage-green gradient fade on the left for headline legibility
 *  - Eyebrow pill (semi-transparent, all-caps)
 *  - Large headline (2 lines)
 *  - Subtitle (single line)
 *  - Two CTAs: Book Appointment (filled) + Explore Services (outlined)
 *  - Circular nav arrows on left/right edges
 *  - Slide indicator dots at bottom-center (active dot is elongated)
 *
 * Auto-advances every 7 seconds; pauses on hover.
 */
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBooking } from "@/components/BookingContext";
import { ArrowLeft, ArrowRight } from "@/components/icons";

type Slide = {
  eyebrow: string;
  headline: { line1: string; line2: string };
  subtitle: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  image: string;
  imageAlt: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Hair Transplant Specialists",
    headline: { line1: "Restore your hair,", line2: "restore your confidence" },
    subtitle:
      "Board-certified surgeons. FUE, DHI, FUT — natural, permanent results.",
    ctaLabel: "Book Appointment",
    secondaryHref: "/procedures/hair-transplant",
    secondaryLabel: "Hair Transplant",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600&q=80",
    imageAlt:
      "Surgeon performing a hair transplant procedure in a modern clinic",
  },
  {
    eyebrow: "Plastic Surgery Excellence",
    headline: { line1: "Sculpt the you,", line2: "you imagine" },
    subtitle:
      "Rhinoplasty, facelift, blepharoplasty — refined results, never overdone.",
    ctaLabel: "Book Appointment",
    secondaryHref: "/procedures/plastic-surgery",
    secondaryLabel: "Plastic Surgery",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80",
    imageAlt: "Clinic consultation room with patient and aesthetic surgeon",
  },
  {
    eyebrow: "Medical Excellence",
    headline: { line1: "Real results,", line2: "lasting beauty" },
    subtitle:
      "Backed by clinical evidence. Designed for natural-looking outcomes.",
    ctaLabel: "Book Appointment",
    secondaryHref: "/results",
    secondaryLabel: "See Results",
    image:
      "https://images.unsplash.com/photo-1614859275206-fbcb27e57057?w=1600&q=80",
    imageAlt: "Patient receiving a precision facial aesthetic treatment",
  },
];

const AUTO_ADVANCE_MS = 7000;

export default function Hero() {
  const { open } = useBooking();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, next]);

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    open();
  };

  return (
    <section
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="RenovaAura clinic highlights"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={"hero-slide" + (i === index ? " active" : "")}
          aria-hidden={i !== index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}`}
        >
          <div className="hero-image-wrap">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="hero-image-img"
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-eyebrow">{slide.eyebrow}</span>
            <h1 className="hero-headline">
              <span className="hero-headline-line">{slide.headline.line1}</span>
              <span className="hero-headline-line hero-headline-emphasis">
                {slide.headline.line2}
              </span>
            </h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <div className="hero-cta-row">
              <a
                href="#book"
                onClick={handleBookClick}
                className="btn btn-hero-primary"
              >
                {slide.ctaLabel}
              </a>
              <Link
                href={slide.secondaryHref}
                className="btn btn-hero-secondary"
              >
                {slide.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="hero-arrow hero-arrow-left"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ArrowLeft />
      </button>
      <button
        type="button"
        className="hero-arrow hero-arrow-right"
        onClick={next}
        aria-label="Next slide"
      >
        <ArrowRight />
      </button>

      <div className="hero-dots" role="tablist" aria-label="Choose slide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            className={"hero-dot" + (i === index ? " active" : "")}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
