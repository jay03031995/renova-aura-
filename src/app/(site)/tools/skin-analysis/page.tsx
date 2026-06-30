import type { Metadata } from "next";
import SkinAnalysis from "@/components/tools/SkinAnalysis";
import { getClinic } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "AI Skin Analysis — Free, 2-Minute Personalised Report",
  description:
    "Free AI Skin Analysis from RenovaAura. Fitzpatrick + skin type + concerns → personalised PDF report with recommended procedures, lifestyle advice and clinical considerations.",
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
