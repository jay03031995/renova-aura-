/**
 * Footer "connect" line:
 *  - "Catch us on:"  → social profiles
 *  - "Ask AI for a summary of RenovaAura:" → opens each AI assistant with a
 *    prefilled prompt to summarise the clinic (modern GEO / AI-discovery cue).
 *
 * Brand glyphs are simplified, monochrome (currentColor) marks — recognisable
 * but not pixel-exact logos; swap for official SVGs anytime.
 */
import { waHref } from "@/data/clinic";
import { getClinic } from "@/sanity/lib/fetchers";
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  WhatsappLogo,
} from "@/components/icons";

const Q = encodeURIComponent(
  "Give me a concise summary of RenovaAura — a hair transplant, plastic surgery and dermatology clinic in Anand Vihar, New Delhi. Source: https://www.renovaaura.com",
);

function GptMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polygon
        points="12,3.2 19.6,7.6 19.6,16.4 12,20.8 4.4,16.4 4.4,7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.3" fill="currentColor" />
    </svg>
  );
}
function ClaudeMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <line x1="12" y1="3.5" x2="12" y2="20.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
function PerplexityMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.3" />
      <line x1="12" y1="3.7" x2="12" y2="20.3" />
      <path d="M5 8.5 12 12l7-3.5M5 15.5 12 12l7 3.5" />
    </svg>
  );
}
function GeminiMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2c.7 5.4 3.9 8.6 9.3 9.3C15.9 12 12.7 15.2 12 20.6 11.3 15.2 8.1 12 2.7 11.3 8.1 10.6 11.3 7.4 12 2z"
        fill="currentColor"
      />
    </svg>
  );
}
function GrokMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="6" y1="18.5" x2="17" y2="6" />
      <line x1="11" y1="18.5" x2="18" y2="10" />
    </svg>
  );
}

const AIS = [
  { name: "ChatGPT", href: `https://chatgpt.com/?q=${Q}`, Mark: GptMark },
  { name: "Claude", href: `https://claude.ai/new?q=${Q}`, Mark: ClaudeMark },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${Q}`,
    Mark: PerplexityMark,
  },
  {
    name: "Gemini",
    href: `https://gemini.google.com/app?q=${Q}`,
    Mark: GeminiMark,
  },
  { name: "Grok", href: `https://grok.com/?q=${Q}`, Mark: GrokMark },
];

export default async function AskAiBar() {
  // Social URLs from Sanity Studio (static config as fallback).
  const clinic = await getClinic();
  return (
    <div className="footer-connect">
      <div className="fc-group">
        <span className="fc-label">Catch us on:</span>
        <div className="fc-icons">
          <a href={clinic.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={clinic.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a href={clinic.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <YoutubeIcon />
          </a>
          <a href={waHref(undefined, clinic.phone)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <WhatsappLogo size={17} />
          </a>
        </div>
      </div>

      <div className="fc-group">
        <span className="fc-label">Ask AI for a summary of RenovaAura:</span>
        <div className="fc-icons fc-ai">
          {AIS.map(({ name, href, Mark }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-chip"
              aria-label={`Ask ${name} for a summary of RenovaAura`}
              title={`Ask ${name}`}
            >
              <Mark />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
