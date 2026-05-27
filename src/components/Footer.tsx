import Link from "next/link";
import { CLINIC, waHref } from "@/data/clinic";
import { FOOTER_LINKS } from "@/data/site";
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  WhatsappFilled,
} from "@/components/icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
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
              {CLINIC.address}
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
                <WhatsappFilled />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div className="footer-col" key={title}>
              <h5>{title}</h5>
              <ul>
                {links.map((l) => (
                  <li key={l.label + l.href}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
