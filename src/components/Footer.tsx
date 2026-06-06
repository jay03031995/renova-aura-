import Link from "next/link";
import { CLINIC, telHref, waHref } from "@/data/clinic";
import { FOOTER_LINKS } from "@/data/site";
import {
  Phone,
  MapPin,
  Calendar,
  WhatsappLogo,
} from "@/components/icons";
import BookButton from "@/components/BookButton";
import FooterAccordion from "@/components/FooterAccordion";
import AskAiBar from "@/components/AskAiBar";

// Actual embed URL resolved from https://maps.app.goo.gl/4SYd5TPEHhLbuRhR9
const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.0!2d77.3093212!3d28.6537164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbe2a421adb7%3A0xf631ccc92514fec0!2sRenovaAura!5e0!3m2!1sen!2sin!4v1";
const MAPS_LINK = `https://www.google.com/maps?q=${CLINIC.mapsQuery}`;

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
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get directions"
          >
            <MapPin size={18} />
            <span>Directions</span>
          </a>
          <BookButton className="footer-action footer-action-book" withArrow={false}>
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

            {/* Address + Google Maps embed */}
            <p className="footer-about">
              <a
                href={MAPS_LINK}
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

            {/* Embedded map */}
            <div className="footer-map">
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: 12, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RenovaAura Clinic — Anand Vihar, New Delhi"
              />
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
