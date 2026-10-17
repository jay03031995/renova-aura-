/**
 * RenovaAura-branded PDF report generator (client-side, jsPDF).
 *
 * Used by /tools/skin-analysis and /tools/graft-calculator to produce
 * a downloadable, shareable report that the patient can:
 *  - Save / print
 *  - Forward to family
 *  - Bring to their consultation
 *
 * Layout: A4 portrait, 20mm margins. RenovaAura sage palette translated
 * to RGB so jsPDF can render without HTML rendering overhead.
 */
import { jsPDF } from "jspdf";

/** RenovaAura sage-green palette translated for jsPDF (RGB tuples). */
const PALETTE = {
  cocoa: [42, 53, 32] as [number, number, number], // primary dark
  espresso: [74, 90, 53] as [number, number, number], // accent
  tan: [122, 140, 91] as [number, number, number], // mid sage
  sand: [168, 184, 140] as [number, number, number], // light sage
  cream: [250, 250, 246] as [number, number, number],
  ink: [26, 31, 21] as [number, number, number],
  muted: [106, 112, 94] as [number, number, number],
  line: [216, 222, 199] as [number, number, number],
};

const PAGE = {
  w: 210, // A4 width mm
  h: 297, // A4 height mm
  marginX: 16,
  marginTop: 37,
  marginBottom: 19,
};

export type ReportSection =
  | { type: "kv"; label: string; value: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "divider" }
  | {
      type: "stat";
      label: string;
      value: string;
      hint?: string;
    }
  | { type: "spacer"; height?: number }
  | {
      type: "scoregrid";
      items: { label: string; score: number }[];
    };

export type ReportInput = {
  title: string; // e.g. "Personal Skin Analysis Report"
  subtitle?: string; // e.g. "Prepared for Priya Sharma"
  clinic?: Partial<typeof CLINIC>;
  patient: {
    name: string;
    email?: string;
    phone?: string;
    ageRange?: string;
  };
  sections: ReportSection[];
  /** Footer line above clinic info. */
  disclaimer?: string;
  /**
   * Patient-uploaded photo as a data URL (any image format jsPDF accepts:
   * JPEG, PNG, WebP). Embedded as a captioned image block at the end of
   * the report.
   */
  patientPhotoDataUrl?: string;
  /** Caption shown below the embedded photo. */
  patientPhotoCaption?: string;
};

const CLINIC = {
  name: "RenovaAura",
  tagline:
    "Dermatology · Wellness · Aesthetics · Plastic Surgery · Hair Transplant",
  address: "C-3, 1st floor, Anand Vihar, New Delhi, 110092",
  phone: "+91 92052 20070",
  email: "info@renovaaura.com",
  web: "renovaaura.com",
};

function setColor(doc: jsPDF, c: [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}

function setFill(doc: jsPDF, c: [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2]);
}

function setStroke(doc: jsPDF, c: [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

/** Draw a clean white masthead with the original logo asset. */
function drawHeader(
  doc: jsPDF,
  logoDataUrl?: string,
  clinic: typeof CLINIC = CLINIC,
) {
  if (logoDataUrl) {
    try {
      // Preserve original asset colors and 600:180 aspect ratio.
      doc.addImage(logoDataUrl, "PNG", PAGE.marginX, 5, 34, 10.2);
    } catch {
      // If addImage fails (e.g. unsupported format), fall through to wordmark
      setColor(doc, PALETTE.cocoa);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(clinic.name, PAGE.marginX, 14);
    }
  } else {
    // Text wordmark fallback
    setColor(doc, PALETTE.cocoa);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(clinic.name, PAGE.marginX, 14);
  }

  // Website and clinic detail stay understated on white.
  setColor(doc, PALETTE.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(clinic.web, PAGE.marginX, 20);

  // Right-aligned date
  doc.setFontSize(8);
  const now = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`Report generated · ${now}`, PAGE.w - PAGE.marginX, 10, {
    align: "right",
  });
  doc.setFontSize(8);
  setColor(doc, PALETTE.cocoa);
  doc.text(clinic.tagline, PAGE.w - PAGE.marginX, 18, { align: "right" });
  setStroke(doc, PALETTE.line);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginX, 27, PAGE.w - PAGE.marginX, 27);
}

/** Bottom-of-page clinic block + pagination. */
function drawFooter(
  doc: jsPDF,
  pageNum: number,
  totalPages: number,
  clinic: typeof CLINIC = CLINIC,
) {
  const y = PAGE.h - PAGE.marginBottom + 8;
  setStroke(doc, PALETTE.line);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginX, y - 6, PAGE.w - PAGE.marginX, y - 6);
  setColor(doc, PALETTE.muted);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(clinic.address, PAGE.marginX, y);
  doc.text(
    `${clinic.phone}  ·  ${clinic.email}  ·  ${clinic.web}`,
    PAGE.marginX,
    y + 4,
  );
  setColor(doc, PALETTE.tan);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE.w - PAGE.marginX, y + 4, {
    align: "right",
  });
}

/** Prominent boxed disclaimer above the footer on the last page. */
function drawDisclaimer(doc: jsPDF, y: number, text: string): number {
  const innerW = PAGE.w - PAGE.marginX * 2;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, innerW - 12);
  const boxH = 12 + lines.length * 3.6;
  // Tinted box with a left accent bar so it stands out
  setFill(doc, PALETTE.cream);
  setStroke(doc, PALETTE.tan);
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE.marginX, y, innerW, boxH, 2, 2, "FD");
  setFill(doc, PALETTE.espresso);
  doc.rect(PAGE.marginX, y, 1.6, boxH, "F");
  // Bold title
  setColor(doc, PALETTE.cocoa);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("IMPORTANT — PLEASE READ", PAGE.marginX + 6, y + 6);
  // Body
  setColor(doc, PALETTE.ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(lines, PAGE.marginX + 6, y + 11);
  return y + boxH;
}

/** Cursor + page management — auto-paginate when content overflows. */
class Cursor {
  doc: jsPDF;
  y = 0;
  page = 1;
  clinic: typeof CLINIC;

  constructor(doc: jsPDF, clinic: typeof CLINIC = CLINIC) {
    this.doc = doc;
    this.clinic = clinic;
    this.reset();
  }

  reset() {
    this.y = PAGE.marginTop; // below the compact masthead
  }

  logoDataUrl?: string;

  ensure(spaceNeeded: number) {
    if (this.y + spaceNeeded > PAGE.h - PAGE.marginBottom - 4) {
      this.doc.addPage();
      this.page += 1;
      drawHeader(this.doc, this.logoDataUrl, this.clinic);
      this.reset();
    }
  }
}

/**
 * Fetch the RenovaAura logo, convert to data URL. Runs in the browser
 * before generation so the embed call doesn't block.
 */
async function loadLogoDataUrl(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;
  try {
    const res = await fetch("/renovaaura-logo.png");
    if (!res.ok) return undefined;
    const blob = await res.blob();
    // Embed the source image directly; do not tint or process its pixels.
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

/**
 * Generate the PDF and trigger a download in the user's browser.
 * Async because we fetch + embed the RenovaAura logo (PNG) for the
 * masthead. Falls back to a text wordmark if the logo can't be loaded.
 */
export async function generateReport(input: ReportInput): Promise<void> {
  const clinic = { ...CLINIC, ...input.clinic };
  const logoDataUrl = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  drawHeader(doc, logoDataUrl, clinic);
  const cursor = new Cursor(doc, clinic);
  cursor.logoDataUrl = logoDataUrl;

  // Title block
  cursor.ensure(28);
  setColor(doc, PALETTE.cocoa);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  const titleLines = doc.splitTextToSize(
    input.title,
    PAGE.w - PAGE.marginX * 2,
  );
  doc.text(titleLines, PAGE.marginX, cursor.y);
  cursor.y += titleLines.length * 6.5;

  if (input.subtitle) {
    const subtitleLines = doc.splitTextToSize(
      input.subtitle,
      PAGE.w - PAGE.marginX * 2,
    );
    setColor(doc, PALETTE.tan);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(subtitleLines, PAGE.marginX, cursor.y);
    cursor.y += subtitleLines.length * 4;
  }

  cursor.y += 1;

  // Patient details card
  const cardInnerW = PAGE.w - PAGE.marginX * 2 - 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const patientNameLines = doc.splitTextToSize(input.patient.name, cardInnerW);
  const contact = [
    input.patient.phone,
    input.patient.email,
    input.patient.ageRange,
  ]
    .filter(Boolean)
    .join("  ·  ");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const contactLines = contact
    ? doc.splitTextToSize(contact, cardInnerW)
    : [];
  const contactY = 11 + patientNameLines.length * 4.2;
  const patientCardHeight = Math.max(
    20,
    contactY + contactLines.length * 3.7 + 1,
  );
  cursor.ensure(patientCardHeight + 5);
  setFill(doc, PALETTE.cream);
  doc.setDrawColor(PALETTE.line[0], PALETTE.line[1], PALETTE.line[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(
    PAGE.marginX,
    cursor.y,
    PAGE.w - PAGE.marginX * 2,
    patientCardHeight,
    2,
    2,
    "FD",
  );
  setColor(doc, PALETTE.tan);
  doc.setFontSize(7);
  doc.text("PATIENT DETAILS", PAGE.marginX + 5, cursor.y + 6);
  setColor(doc, PALETTE.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(patientNameLines, PAGE.marginX + 5, cursor.y + 11);
  if (contactLines.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor(doc, PALETTE.muted);
    doc.text(contactLines, PAGE.marginX + 5, cursor.y + contactY);
  }
  cursor.y += patientCardHeight + 5;

  // Sections
  for (const section of input.sections) {
    renderSection(doc, cursor, section);
  }

  // Embedded patient photo
  if (input.patientPhotoDataUrl) {
    cursor.ensure(80);
    setColor(doc, PALETTE.cocoa);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Reference photograph", PAGE.marginX, cursor.y);
    cursor.y += 3;
    setStroke(doc, PALETTE.espresso);
    doc.setLineWidth(0.6);
    doc.line(PAGE.marginX, cursor.y, PAGE.marginX + 12, cursor.y);
    cursor.y += 8;
    try {
      const imgWidth = 52; // mm
      const imgHeight = 52; // mm — square crop
      doc.addImage(
        input.patientPhotoDataUrl,
        "JPEG",
        PAGE.marginX,
        cursor.y,
        imgWidth,
        imgHeight,
      );
      // Caption beside
      const captionX = PAGE.marginX + imgWidth + 8;
      setColor(doc, PALETTE.muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const caption =
        input.patientPhotoCaption ??
        "Patient-uploaded reference photograph. Used at the consultation for visual confirmation.";
      const captionLines = doc.splitTextToSize(
        caption,
        PAGE.w - captionX - PAGE.marginX,
      );
      doc.text(captionLines, captionX, cursor.y + 6);
      cursor.y += imgHeight + 4;
    } catch {
      setColor(doc, PALETTE.muted);
      doc.setFontSize(9);
      doc.text(
        "(Reference photograph could not be embedded — please bring the original to your consultation.)",
        PAGE.marginX,
        cursor.y,
      );
      cursor.y += 5;
    }
  }

  // Disclaimer
  cursor.y += 6;
  cursor.ensure(34);
  cursor.y = drawDisclaimer(
    doc,
    cursor.y,
    input.disclaimer ??
      "This self-reported assessment is not a diagnosis or treatment recommendation. A qualified RenovaAura clinician must assess you in person before any treatment or procedure is considered.",
  );

  // Footer on every page
  const totalPages = (
    doc as unknown as { internal: { getNumberOfPages: () => number } }
  ).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages, clinic);
  }

  const safeName = input.patient.name.replace(/[^a-z0-9]+/gi, "-");
  doc.save(`renovaaura-report-${safeName}-${Date.now()}.pdf`);
}

function renderSection(doc: jsPDF, cursor: Cursor, s: ReportSection) {
  switch (s.type) {
    case "heading":
      cursor.ensure(12);
      setColor(doc, PALETTE.cocoa);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.text(s.text, PAGE.marginX, cursor.y);
      cursor.y += 3;
      setStroke(doc, PALETTE.espresso);
      doc.setLineWidth(0.6);
      doc.line(PAGE.marginX, cursor.y, PAGE.marginX + 12, cursor.y);
      cursor.y += 4;
      break;
    case "paragraph": {
      const lines = doc.splitTextToSize(s.text, PAGE.w - PAGE.marginX * 2);
      cursor.ensure(lines.length * 4.5 + 2);
      setColor(doc, PALETTE.ink);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(lines, PAGE.marginX, cursor.y);
      cursor.y += lines.length * 4.5 + 2;
      break;
    }
    case "bullets":
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (const item of s.items) {
        const lines = doc.splitTextToSize(
          item,
          PAGE.w - PAGE.marginX * 2 - 6,
        );
        cursor.ensure(lines.length * 4.5 + 2);
        setColor(doc, PALETTE.espresso);
        doc.text("•", PAGE.marginX, cursor.y);
        setColor(doc, PALETTE.ink);
        doc.text(lines, PAGE.marginX + 5, cursor.y);
        cursor.y += lines.length * 4 + 0.5;
      }
      cursor.y += 2;
      break;
    case "kv": {
      const labelW = 34;
      const valueW = PAGE.w - PAGE.marginX * 2 - labelW;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const valueLines = doc.splitTextToSize(s.value, valueW);
      cursor.ensure(Math.max(5, valueLines.length * 4) + 1);
      setColor(doc, PALETTE.muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(s.label, PAGE.marginX, cursor.y);
      setColor(doc, PALETTE.ink);
      doc.setFont("helvetica", "bold");
      doc.text(valueLines, PAGE.marginX + labelW, cursor.y);
      cursor.y += Math.max(5, valueLines.length * 4) + 1;
      break;
    }
    case "stat": {
      cursor.ensure(22);
      setFill(doc, PALETTE.cream);
      setStroke(doc, PALETTE.line);
      doc.roundedRect(
        PAGE.marginX,
        cursor.y,
        PAGE.w - PAGE.marginX * 2,
        18,
        2,
        2,
        "FD",
      );
      setFill(doc, PALETTE.espresso);
      doc.rect(PAGE.marginX, cursor.y, 1.4, 18, "F");
      setColor(doc, PALETTE.cocoa);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(s.label.toUpperCase(), PAGE.marginX + 5, cursor.y + 6);
      doc.setFontSize(16);
      const valueLines = doc.splitTextToSize(s.value, PAGE.w - PAGE.marginX * 2 - 10);
      doc.text(valueLines, PAGE.marginX + 5, cursor.y + 13);
      if (s.hint) {
        setColor(doc, PALETTE.espresso);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(s.hint, PAGE.w - PAGE.marginX - 5, cursor.y + 11, {
          align: "right",
        });
      }
      cursor.y += 24;
      break;
    }
    case "divider":
      cursor.ensure(4);
      setStroke(doc, PALETTE.line);
      doc.setLineWidth(0.2);
      doc.line(PAGE.marginX, cursor.y, PAGE.w - PAGE.marginX, cursor.y);
      cursor.y += 4;
      break;
    case "spacer":
      cursor.y += s.height ?? 4;
      break;
    case "scoregrid": {
      // Grid of score circles (4 per row) — the per-attribute skin scores.
      const perRow = 4;
      const cellW = (PAGE.w - PAGE.marginX * 2) / perRow;
      const radius = 8;
      const rows = Math.ceil(s.items.length / perRow);
      cursor.ensure(rows * 26 + 2);
      s.items.forEach((it, i) => {
        const col = i % perRow;
        const row = Math.floor(i / perRow);
        const cx = PAGE.marginX + col * cellW + cellW / 2;
        const cy = cursor.y + row * 26 + radius + 2;
        // ring colour by score band
        const ring =
          it.score >= 80 ? PALETTE.tan : it.score >= 62 ? PALETTE.espresso : PALETTE.cocoa;
        setStroke(doc, ring);
        doc.setLineWidth(1.1);
        setFill(doc, PALETTE.cream);
        doc.circle(cx, cy, radius, "FD");
        setColor(doc, PALETTE.cocoa);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(String(it.score), cx, cy + 1.5, { align: "center" });
        setColor(doc, PALETTE.muted);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        const lbl = doc.splitTextToSize(it.label, cellW - 2);
        doc.text(lbl[0], cx, cy + radius + 4, { align: "center" });
      });
      cursor.y += rows * 26 + 2;
      break;
    }
  }
}
