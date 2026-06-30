import Link from "next/link";
import { telHref, waHref } from "@/data/clinic";
import { FOOTER_LINKS } from "@/data/site";
import { getClinic } from "@/sanity/lib/fetchers";
import {
  Phone,
  MapPin,
  Calendar,
  WhatsappLogo,
} from "@/components/icons";
import BookButton from "@/components/BookButton";
import FooterAccordion from "@/components/FooterAccordion";
import AskAiBar from "@/components/AskAiBar";

export default async function Footer() {
  const clinic = await getClinic();
  const logoSrc = clinic.logoUrl ?? "/renovaaura-logo.png";

  return (
    <footer className="footer">
      <div className="container">
        {/* Mobile quick actions (phone only) */}
        <div className="footer-actions">
          <a className="footer-action" href={telHref(clinic.phone)} aria-label="Call the clinic">
            <Phone size={18} />
            <span>Call</span>
          </a>
          <a
            className="footer-action"
            href={waHref(undefined, clinic.phone)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <WhatsappLogo size={18} />
            <span>WhatsApp</span>
          </a>
          <a
            className="footer-action"
            href={clinic.googleMapsLinkUrl}
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
            <Link href="/" className="logo" aria-label={clinic.name}>
              <img
                src={logoSrc}
                alt={clinic.name}
                className="logo-img logo-img-light"
                width={200}
                height={56}
              />
            </Link>

            {/* Address + Google Maps embed */}
            <p className="footer-about">
              <a
                href={clinic.googleMapsLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-address-link"
              >
                {clinic.address}
              </a>
              <br />
              <br />
              {clinic.hours}
            </p>

            {/* Embedded map */}
            <div className="footer-map">
              <iframe
                src={clinic.googleMapsEmbedUrl}
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: 12, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${clinic.name} Clinic`}
              />
            </div>
          </div>

          <FooterAccordion groups={FOOTER_LINKS} />
        </div>

        <AskAiBar />

        <div className="footer-bottom">
          <span>© 2026 {clinic.name} · All rights reserved</span>
          <span>
            {clinic.phone} · {clinic.email}
          </span>
        </div>
      </div>
    </footer>
  );
}
