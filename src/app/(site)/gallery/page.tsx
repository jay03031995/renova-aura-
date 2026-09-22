import type { Metadata } from "next";
import GalleryClient from "@/components/GalleryClient";
import {
  getGalleryImages,
  getGalleryRealResults,
  getGalleryVideos,
} from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Gallery — Patient Results, Clinic & Treatment Videos | RenovaAura",
  description:
    "Browse RenovaAura's gallery: patient before/after results, clinic and machine photos, treatment videos and walkthroughs across hair, skin, plastic surgery and body care in Anand Vihar, New Delhi.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const [images, results, videos] = await Promise.all([
    getGalleryImages(),
    getGalleryRealResults(),
    getGalleryVideos(),
  ]);

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Gallery</div>
          <h1 className="pillar-hero-headline">
            Real results, real clinic, real work.
          </h1>
          <p className="pillar-hero-subtitle">
            Before/after patient outcomes, clinic and technology photos, and
            treatment videos from RenovaAura — Anand Vihar, New Delhi.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <GalleryClient images={images} results={results} videos={videos} />
        </div>
      </section>
    </>
  );
}
