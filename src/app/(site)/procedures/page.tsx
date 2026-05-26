import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import {
  HAIR_PROCEDURES,
  PLASTIC_PROCEDURES,
} from "@/data/procedures";

export const metadata: Metadata = {
  title: "Our Procedures — Hair Transplant & Plastic Surgery",
  description:
    "RenovaAura offers 11 hair restoration procedures and 10 plastic surgery procedures. FUE, DHI, rhinoplasty, facelift and more — all delivered by board-certified surgeons.",
};

export default function ProceduresIndexPage() {
  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Our Procedures</div>
          <h1 className="pillar-hero-headline">
            Hair restoration and plastic surgery — under one expert roof.
          </h1>
          <p className="pillar-hero-subtitle">
            21 procedures spanning two specialist pillars. Pick a pillar
            below to explore every option in detail.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: 28,
            }}
          >
            <Link
              href="/procedures/hair-transplant"
              className="proc-card"
              style={{ padding: 40 }}
            >
              <span className="proc-card-tag">Primary specialty</span>
              <h3
                className="proc-card-title"
                style={{ fontSize: 28, marginBottom: 14 }}
              >
                Hair Transplant — {HAIR_PROCEDURES.length} procedures
              </h3>
              <p className="proc-card-headline" style={{ fontSize: 15 }}>
                FUE, DHI, FUT, Sapphire FUE, beard, eyebrow, female
                transplant, PRP, GFC, mesotherapy and hairline lowering.
                Permanent results from your own DHT-resistant donor follicles.
              </p>
              <span className="proc-card-link">
                Explore hair restoration <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/procedures/plastic-surgery"
              className="proc-card"
              style={{ padding: 40 }}
            >
              <span className="proc-card-tag">Aesthetic specialty</span>
              <h3
                className="proc-card-title"
                style={{ fontSize: 28, marginBottom: 14 }}
              >
                Plastic Surgery — {PLASTIC_PROCEDURES.length} procedures
              </h3>
              <p className="proc-card-headline" style={{ fontSize: 15 }}>
                Rhinoplasty, blepharoplasty, facelift, liposuction,
                augmentation, tummy tuck, gynecomastia, lip filler, Botox,
                thread lift. Refined results, never overdone.
              </p>
              <span className="proc-card-link">
                Explore plastic surgery <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
