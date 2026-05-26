import Link from "next/link";
import { getAnnouncement } from "@/sanity/lib/fetchers";

export default async function Announcement() {
  const a = await getAnnouncement();
  if (!a.enabled) return null;

  const isExternal = a.linkUrl?.startsWith("http");
  const link =
    a.linkUrl && a.linkLabel ? (
      isExternal ? (
        <a href={a.linkUrl} target="_blank" rel="noopener noreferrer">
          {a.linkLabel}
        </a>
      ) : (
        <Link href={a.linkUrl}>{a.linkLabel}</Link>
      )
    ) : null;

  return (
    <div className="announce">
      <span>{a.message}</span>
      {link && (
        <>
          <span className="announce-dot" />
          {link}
        </>
      )}
    </div>
  );
}
