import Link from "next/link";
import { CLINIC, telHref, waHref } from "@/data/clinic";
import { FOOTER_LINKS } from "@/data/site";
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  WhatsappLogo,
  Phone,
  MapPin,
  Calendar,
} from "@/components/icons";
import { getSiteSettings } from "@/sanity/lib/fetchers";
import BookButton from "@/components/BookButton";
import FooterAccordion from "@/components/FooterAccordion";
import AskAiBar from "@/components/AskAiBar";

const mapsUrl = `https://www.google.com/maps?q=${CLINIC.mapsQuery}`;

const SOCIAL_ICON: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappLogo,
};

export default async function Footer() {
  const settings = await getSiteSettings();
  // Which single social icon to feature — editable in Sanity Studio
  // under Site Settings → Footer → Featured social network.
  const featuredSocial = (settings?.featuredSocial as string | undefined) ?? "instagram";
  const socialUrl =
    featuredSocial === "instagram" ? CLINIC.social.instagram
    : featuredSocial === "youtube" ? CLINIC.social.youtube
    : featuredSocial === "linkedin" ? CLINIC.social.linkedin
    : featuredSocial === "whatsapp" ? waHref()
    : CLINIC.social.instagram;
  const SocialIcon = SOCIAL_ICON[featuredSocial] ?? InstagramIcon;

  return (
    <footer className="footer">
      <div className="container">
        {/* Mobile quick actions (phone only) */}
        <div className="footer-actions">
          <a className="footer-action" href={telHref()} aria-label="Call the clinic">
            <Phone size={18} />
            <span>Call</span>
          </a>
          <a
            className="footer-action"
            href={waHref("Hi RenovaAura, I'd like to ask about a treatment.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <WhatsappLogo size={18} />
            <span>WhatsApp</span>
          </a>
          <a
            className="footer-action"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get directions"
          >
            <MapPin size={18} />
            <span>Directions</span>
          </a>
          <BookButton
            className="footer-action footer-action-book"
            withArrow={false}
          >
            <Calendar />
            <span>Book</span>
          </BookButton>
        </div>

        <div className="footer-grid">
          <div>
            <Link href="/" className="logo" aria-label={CLINIC.name}>
              <img
                src="/renovaaura-logo.png"
                alt={CLINIC.name}
                className="logo-img logo-img-light"
                width={200}
                height={56}
              />
            </Link>
            <p className="footer-about">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-address-link"
              >
                {CLINIC.address}
              </a>
              <br />
              <br />
              {CLINIC.hours}
            </p>
            <div className="footer-social">
              <a
                href={socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={featuredSocial.charAt(0).toUpperCase() + featuredSocial.slice(1)}
              >
                <SocialIcon size={17} />
              </a>
            </div>
          </div>

          <FooterAccordion groups={FOOTER_LINKS} />
        </div>

        <AskAiBar />

        <div className="footer-bottom">
          <span>© 2026 {CLINIC.name} · All rights reserved</span>
          <span>
            {CLINIC.phone} · {CLINIC.phone2} · {CLINIC.email}
          </span>
        </div>
      </div>
    </footer>
  );
}
