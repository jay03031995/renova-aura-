import Link from "next/link";
import { ArrowRight, Sparkle } from "@/components/icons";

/**
 * Homepage feature strip promoting the two interactive tools.
 * Sits between the TrustStrip and the first procedure pillar so it's
 * visible above the fold for most desktop viewports.
 */
export default function ToolsBanner() {
  return (
    <section className="tools-banner">
      <div className="container">
        <div className="tools-banner-grid">
          <div className="tools-banner-intro">
            <div className="tools-banner-pill">
              <Sparkle size={12} /> Free patient tools
            </div>
            <h2 className="tools-banner-h">
              Get a clinical preview before you book.
            </h2>
            <p className="tools-banner-p">
              Two free interactive tools — backed by Norwood, Fitzpatrick and
              ISHRS references. Each produces a personalised PDF you can
              bring to your consultation.
            </p>
          </div>
          <Link href="/tools/skin-analysis" className="tools-banner-card">
            <div className="tools-banner-card-icon">✦</div>
            <div>
              <div className="tools-banner-card-eyebrow">Dermatology</div>
              <h3 className="tools-banner-card-h">AI Skin Analysis</h3>
              <p className="tools-banner-card-p">
                Map your skin type, concerns and lifestyle to a personalised
                care plan.
              </p>
              <span className="tools-banner-card-link">
                2-min assessment <ArrowRight size={12} />
              </span>
            </div>
          </Link>
          <Link href="/tools/graft-calculator" className="tools-banner-card">
            <div className="tools-banner-card-icon">◍</div>
            <div>
              <div className="tools-banner-card-eyebrow">Hair Transplant</div>
              <h3 className="tools-banner-card-h">Hair Graft Calculator</h3>
              <p className="tools-banner-card-p">
                Norwood-based math estimates the grafts you'll need for
                natural restoration.
              </p>
              <span className="tools-banner-card-link">
                Calculate grafts <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
