"use client";

import { useState } from "react";
import Link from "next/link";

type Groups = Record<string, { label: string; href: string }[]>;

/**
 * Footer link columns. Static multi-column block on desktop; tap-to-expand
 * accordions on phone (CSS forces the lists open ≥641px).
 */
export default function FooterAccordion({ groups }: { groups: Groups }) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <>
      {Object.entries(groups).map(([title, links]) => {
        const isOpen = openTitle === title;
        return (
          <div className={"footer-col" + (isOpen ? " open" : "")} key={title}>
            <button
              type="button"
              className="footer-col-h"
              aria-expanded={isOpen}
              onClick={() => setOpenTitle((t) => (t === title ? null : title))}
            >
              <h5>{title}</h5>
              <span className="footer-col-chev" aria-hidden="true" />
            </button>
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
        );
      })}
    </>
  );
}
