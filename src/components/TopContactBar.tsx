/**
 * Desktop-only contact/location strip above the main nav (MedLinks-style).
 * Hidden ≤980px, where the mobile header + drawer take over.
 */
import Link from "next/link";
import { CLINIC, telHref, waHref } from "@/data/clinic";
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

const mapsUrl = `https://www.google.com/maps?q=${CLINIC.mapsQuery}`;

export default async function TopContactBar() {
  // Social URLs come from Sanity Studio (with the static config as fallback),
  // so links added/edited in the Studio go live with no code change.
  const { social } = await getClinic();
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-group">
          <a
            className="topbar-item"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={15} />
            {CLINIC.address}
          </a>
          <span className="topbar-item topbar-hours">
            <Clock size={15} />
            {CLINIC.hours}
          </span>
        </div>

        <div className="topbar-group">
          <a className="topbar-item" href={telHref()}>
            <Phone size={14} />
            {CLINIC.phone}
          </a>
          <a
            className="topbar-item"
            href={waHref()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo size={16} />
            WhatsApp
          </a>
          <span className="topbar-social">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <YoutubeIcon />
            </a>
            <Link
              href={social.linkedin}
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
