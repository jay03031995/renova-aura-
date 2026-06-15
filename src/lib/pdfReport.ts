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
  marginX: 20,
  marginTop: 18,
  marginBottom: 24,
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
  address: "C-3, Anand Vihar, New Delhi, 110092",
  phone: "+91 92052 20070",
  email: "hello@renovaaura.com",
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

/** Draw the RenovaAura masthead — cocoa band with embedded logo + tagline. */
function drawHeader(doc: jsPDF, logoDataUrl?: string) {
  // Background band — taller to accommodate the logo
  setFill(doc, PALETTE.cocoa);
  doc.rect(0, 0, PAGE.w, 26, "F");

  if (logoDataUrl) {
    try {
      // Logo on the left, height ~14mm, white-tinted via PNG with transparency
      doc.addImage(logoDataUrl, "PNG", PAGE.marginX, 5, 38, 17);
    } catch {
      // If addImage fails (e.g. unsupported format), fall through to wordmark
      setColor(doc, PALETTE.cream);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("RenovaAura", PAGE.marginX, 14);
    }
  } else {
    // Text wordmark fallback
    setColor(doc, PALETTE.cream);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RenovaAura", PAGE.marginX, 14);
  }

  // Tagline right of logo (small caps)
  setColor(doc, PALETTE.sand);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(CLINIC.tagline.toUpperCase(), PAGE.marginX + 42, 22);

  // Right-aligned date
  doc.setFontSize(8);
  const now = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.text(`Report generated · ${now}`, PAGE.w - PAGE.marginX, 14, {
    align: "right",
  });
  doc.setFontSize(7);
  setColor(doc, PALETTE.tan);
  doc.text(CLINIC.web, PAGE.w - PAGE.marginX, 22, { align: "right" });
}

/** Diagonal watermark across each page. Very low opacity. */
function drawWatermark(doc: jsPDF) {
  const gs = (doc as unknown as {
    GState: new (opts: { opacity: number }) => unknown;
    setGState: (s: unknown) => void;
  });
  let restored = false;
  try {
    if (gs.GState && gs.setGState) {
      gs.setGState(new gs.GState({ opacity: 0.05 }));
      restored = true;
    }
  } catch {
    /* opacity not supported; watermark just renders at full opacity which
       is fine because we use very pale tan colour anyway */
  }
  setColor(doc, PALETTE.tan);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(72);
  // Centre point of the page
  const x = PAGE.w / 2;
  const y = PAGE.h / 2 + 20;
  // jsPDF rotates around the anchor point; use 45° diagonal
  doc.text("RenovaAura", x, y, { align: "center", angle: 30 });
  if (restored) {
    try {
      gs.setGState(new gs.GState({ opacity: 1 }));
    } catch {
      /* noop */
    }
  }
}

/** Bottom-of-page clinic block + pagination. */
function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = PAGE.h - PAGE.marginBottom + 8;
  setStroke(doc, PALETTE.line);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginX, y - 6, PAGE.w - PAGE.marginX, y - 6);
  setColor(doc, PALETTE.muted);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(CLINIC.address, PAGE.marginX, y);
  doc.text(
    `${CLINIC.phone}  ·  ${CLINIC.email}  ·  ${CLINIC.web}`,
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

  constructor(doc: jsPDF) {
    this.doc = doc;
    this.reset();
  }

  reset() {
    this.y = PAGE.marginTop + 26; // below header band (logo height + padding)
  }

  logoDataUrl?: string;

  ensure(spaceNeeded: number) {
    if (this.y + spaceNeeded > PAGE.h - PAGE.marginBottom - 4) {
      this.doc.addPage();
      this.page += 1;
      drawWatermark(this.doc);
      drawHeader(this.doc, this.logoDataUrl);
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
    // The base logo is dark — recolour it WHITE so it reads on the cocoa
    // masthead band. Draw to canvas, then composite white over the alpha mask.
    try {
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png");
      }
    } catch {
      /* canvas tint unavailable — fall through to the original logo */
    }
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
  const logoDataUrl = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  drawWatermark(doc);
  drawHeader(doc, logoDataUrl);
  const cursor = new Cursor(doc);
  cursor.logoDataUrl = logoDataUrl;

  // Title block
  cursor.ensure(28);
  setColor(doc, PALETTE.cocoa);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(
    input.title,
    PAGE.w - PAGE.marginX * 2,
  );
  doc.text(titleLines, PAGE.marginX, cursor.y);
  cursor.y += titleLines.length * 8;

  if (input.subtitle) {
    setColor(doc, PALETTE.tan);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(input.subtitle, PAGE.marginX, cursor.y);
    cursor.y += 6;
  }

  cursor.y += 4;

  // Patient details card
  cursor.ensure(28);
  setFill(doc, PALETTE.cream);
  doc.setDrawColor(PALETTE.line[0], PALETTE.line[1], PALETTE.line[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(
    PAGE.marginX,
    cursor.y,
    PAGE.w - PAGE.marginX * 2,
    22,
    2,
    2,
    "FD",
  );
  setColor(doc, PALETTE.tan);
  doc.setFontSize(8);
  doc.text("PATIENT DETAILS", PAGE.marginX + 5, cursor.y + 6);
  setColor(doc, PALETTE.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(input.patient.name, PAGE.marginX + 5, cursor.y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(doc, PALETTE.muted);
  const contact = [
    input.patient.phone,
    input.patient.email,
    input.patient.ageRange,
  ]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(contact, PAGE.marginX + 5, cursor.y + 18);
  cursor.y += 30;

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
      const imgWidth = 80; // mm
      const imgHeight = 80; // mm — square crop
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
      "This is NOT a final medical report or diagnosis. The scores and recommendations are AI/expert-system estimates based on the information you provided and standard clinical references. An in-person consultation with a board-certified RenovaAura doctor is essential before starting any treatment, procedure, or product. Do not begin any product or treatment suggested here without that consultation.",
  );

  // Footer on every page
  const totalPages = (
    doc as unknown as { internal: { getNumberOfPages: () => number } }
  ).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  const safeName = input.patient.name.replace(/[^a-z0-9]+/gi, "-");
  doc.save(`renovaaura-report-${safeName}-${Date.now()}.pdf`);
}

function renderSection(doc: jsPDF, cursor: Cursor, s: ReportSection) {
  switch (s.type) {
    case "heading":
      cursor.ensure(14);
      setColor(doc, PALETTE.cocoa);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(s.text, PAGE.marginX, cursor.y);
      cursor.y += 3;
      setStroke(doc, PALETTE.espresso);
      doc.setLineWidth(0.6);
      doc.line(PAGE.marginX, cursor.y, PAGE.marginX + 12, cursor.y);
      cursor.y += 6;
      break;
    case "paragraph": {
      const lines = doc.splitTextToSize(s.text, PAGE.w - PAGE.marginX * 2);
      cursor.ensure(lines.length * 4.5 + 2);
      setColor(doc, PALETTE.ink);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(lines, PAGE.marginX, cursor.y);
      cursor.y += lines.length * 4.5 + 2;
      break;
    }
    case "bullets":
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
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
        cursor.y += lines.length * 4.5 + 1;
      }
      cursor.y += 2;
      break;
    case "kv": {
      cursor.ensure(6);
      setColor(doc, PALETTE.muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(s.label, PAGE.marginX, cursor.y);
      setColor(doc, PALETTE.ink);
      doc.setFont("helvetica", "bold");
      doc.text(s.value, PAGE.w - PAGE.marginX, cursor.y, { align: "right" });
      cursor.y += 5;
      break;
    }
    case "stat": {
      cursor.ensure(22);
      setFill(doc, PALETTE.sand);
      doc.roundedRect(
        PAGE.marginX,
        cursor.y,
        PAGE.w - PAGE.marginX * 2,
        18,
        2,
        2,
        "F",
      );
      setColor(doc, PALETTE.cocoa);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(s.label.toUpperCase(), PAGE.marginX + 5, cursor.y + 6);
      doc.setFontSize(20);
      doc.text(s.value, PAGE.marginX + 5, cursor.y + 14);
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
