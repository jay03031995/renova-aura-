/**
 * Desktop-only contact/location strip above the main nav (MedLinks-style).
 * Hidden ≤980px, where the mobile header + drawer take over.
 */
import Link from "next/link";
import { telHref, waHref } from "@/data/clinic";
import { getClinic } from "@/sanity/lib/fetchers";
import {
  MapPin,
  Phone,
  Clock,
  WhatsappLogo,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/icons";

export default async function TopContactBar() {
  const clinic = await getClinic();
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-group">
          <a
            className="topbar-item"
            href={clinic.googleMapsLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={15} />
            {clinic.address}
          </a>
          <span className="topbar-item topbar-hours">
            <Clock size={15} />
            {clinic.hours}
          </span>
        </div>

        <div className="topbar-group">
          <a className="topbar-item" href={telHref(clinic.phone)}>
            <Phone size={14} />
            {clinic.phone}
          </a>
          <a
            className="topbar-item"
            href={waHref(undefined, clinic.phone)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo size={16} />
            WhatsApp
          </a>
          <span className="topbar-social">
            <a
              href={clinic.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={clinic.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <YoutubeIcon />
            </a>
            <Link
              href={clinic.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
