import type { Metadata } from "next";
import SkinAnalysis from "@/components/tools/SkinAnalysis";
import { getClinic } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Skin Concern Assessment — Free Consultation Summary",
  description:
    "Share your skin type, sun response, and concerns to prepare a self-reported summary for a RenovaAura consultation.",
  alternates: { canonical: "/tools/skin-analysis" },
};

export default async function SkinAnalysisPage() {
  const clinic = await getClinic();

  return (
    <section className="section-tight" style={{ paddingTop: 60 }}>
      <div className="container">
        <SkinAnalysis clinic={clinic} />
      </div>
    </section>
  );
}
