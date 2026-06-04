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
import BookButton from "@/components/BookButton";
import FooterAccordion from "@/components/FooterAccordion";
import AskAiBar from "@/components/AskAiBar";

const mapsUrl = `https://www.google.com/maps?q=${CLINIC.mapsQuery}`;

export default function Footer() {
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
                href={CLINIC.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={CLINIC.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
              <a
                href={CLINIC.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href={waHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <WhatsappLogo size={17} />
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
