"use client";

/**
 * App-style bottom navigation — phone only (hidden ≥ 641px via CSS).
 * Combines tab navigation with the primary "Book" CTA so there's a single
 * fixed bar rather than two stacked ones.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBooking } from "@/components/BookingContext";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function IconTreatments() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v18M3 12h18" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function IconPackages() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </svg>
  );
}
function IconDoctors() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "Home", Icon: IconHome, exact: true },
  { href: "/procedures", label: "Treatments", Icon: IconTreatments },
  { href: "/packages", label: "Packages", Icon: IconPackages },
  { href: "/doctors", label: "Doctors", Icon: IconDoctors },
];

export default function MobileTabBar() {
  const pathname = usePathname() || "/";
  const { open } = useBooking();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/") || pathname === href;

  return (
    <nav className="mobile-tabbar" aria-label="Primary">
      {TABS.map(({ href, label, Icon, exact }) => (
        <Link
          key={href}
          href={href}
          className={"mtab" + (isActive(href, exact) ? " active" : "")}
        >
          <span className="mtab-ic">
            <Icon />
          </span>
          <span className="mtab-lbl">{label}</span>
        </Link>
      ))}
      <button
        type="button"
        className="mtab mtab-book"
        onClick={() => open()}
        aria-label="Book an appointment"
      >
        <span className="mtab-ic">
          <IconBook />
        </span>
        <span className="mtab-lbl">Book</span>
      </button>
    </nav>
  );
}
