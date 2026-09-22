import type { ReactNode } from "react";

type IconProps = { size?: number; stroke?: number; className?: string };

function Stroke({
  size = 18,
  stroke = 1.5,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ArrowRight = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </Stroke>
);

export const ArrowLeft = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="M19 12H5" />
    <path d="m11 19-7-7 7-7" />
  </Stroke>
);

export const Phone = ({ size = 14, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  </Stroke>
);

export const Calendar = ({ size = 14, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Stroke>
);

export const Check = ({ size = 12, stroke = 2.5, ...p }: IconProps) => (
  <Stroke size={size} stroke={stroke} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Stroke>
);

export const Shield = ({ size = 14, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Stroke>
);

export const Award = ({ size = 14, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </Stroke>
);

export const Sparkle = ({ size = 14, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </Stroke>
);

export const Mail = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Stroke>
);

export const MapPin = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Stroke>
);

export const Clock = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Stroke>
);

export const Tag = ({ size = 12, ...p }: IconProps) => (
  <Stroke size={size} {...p}>
    <path d="m20 12-8 8-9-9V3h8z" />
    <circle cx="7" cy="7" r="1" />
  </Stroke>
);

export const Bag = ({ size = 18, stroke = 2, ...p }: IconProps) => (
  <Stroke size={size} stroke={stroke} {...p}>
    <path d="M6 8h12l-1 12H7L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Stroke>
);

export const WhatsappLine = ({ size = 16, stroke = 1.5, ...p }: IconProps) => (
  <Stroke size={size} stroke={stroke} {...p}>
    <path d="M20.5 3.5A11 11 0 0 0 3.4 17.4L2 22l4.7-1.4A11 11 0 1 0 20.5 3.5zM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 1 1 12 20z" />
  </Stroke>
);

/* Official WhatsApp logo (green glyph) — public/whatsapp.svg */
export const WhatsappLogo = ({ size = 18 }: { size?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/whatsapp.svg"
    alt="WhatsApp"
    width={size}
    height={size}
    style={{ objectFit: "contain", display: "block" }}
  />
);

/* Filled brand icons for the footer */
export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23 7.5s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C16.9 4 12 4 12 4s-4.9 0-8 .2c-.4 0-1.3.1-2.1 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1C6.1 20 12 20 12 20s4.9 0 8-.2c.4 0 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.8 15.4V8.6l6.3 3.4z" />
  </svg>
);

export const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3zM6.5 7.7A1.7 1.7 0 1 1 8.2 6a1.7 1.7 0 0 1-1.7 1.7zM19 19h-3v-5c0-1.2-.4-2-1.5-2A1.6 1.6 0 0 0 13 13.6V19h-3V9h3v1.3a3.3 3.3 0 0 1 3-1.6c2.1 0 3 1.5 3 3.8z" />
  </svg>
);

export const WhatsappFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.1 4.9A10 10 0 0 0 4.4 18.2L3 22l3.9-1.4a10 10 0 0 0 14.1-9.4 10 10 0 0 0-2.9-6.3zM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.8.7-2.7-.2-.3a8 8 0 1 1 6.7 3.6zm4.5-5.9-1.6-.8c-.2-.1-.3-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.7-.3-1.5-.8-2.1-1.4-.5-.4-.9-1-1.3-1.7-.1-.2 0-.3.1-.4l.4-.4c.1-.1.2-.3.3-.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3 3 0 0 0-.9 2.2c.1 1.2.9 2.4 1 2.6 1.2 1.8 2.5 3 4.3 3.7 1.7.7 2 .5 2.4.5.6 0 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.4-.3z" />
  </svg>
);
