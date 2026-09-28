import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const appDir = join(process.cwd(), "src/app");
const ignoredSegments = new Set(["api"]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      if (ignoredSegments.has(entry)) return [];
      return walk(full);
    }
    return entry === "page.tsx" ? [full] : [];
  });
}

const failures = walk(appDir).filter((file) => {
  const routePath = relative(appDir, file);
  if (routePath.startsWith("studio/")) return false;

  const source = readFileSync(file, "utf8");
  const hasGeneratedMetadata = /export\s+async\s+function\s+generateMetadata/.test(source);
  const hasStaticMetadata = /export\s+const\s+metadata\s*:\s*Metadata\s*=/.test(source);
  if (hasGeneratedMetadata) return false;
  if (!hasStaticMetadata) return true;

  const metadataBlock = source.slice(source.indexOf("export const metadata"));
  const hasTitle = /\btitle\s*:/.test(metadataBlock);
  const hasDescription = /\bdescription\s*:/.test(metadataBlock);
  const noindex = /robots\s*:\s*\{[\s\S]*?index\s*:\s*false/.test(metadataBlock);
  return !hasTitle || (!hasDescription && !noindex);
});

if (failures.length > 0) {
  console.error("Pages missing metadata title/description coverage:");
  failures.forEach((file) => console.error(`- ${relative(process.cwd(), file)}`));
  process.exit(1);
}

console.log("All app pages have metadata coverage.");
