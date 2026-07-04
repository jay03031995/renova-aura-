import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/sanity/lib/fetchers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = (settings.siteUrl ?? "https://renovaaura.com").replace(/\/$/, "");

  const blocked = ["/api/", "/admin/", "/studio"];

  // Explicitly welcome the major AI / answer-engine crawlers (GEO / "AI SEO")
  // so RenovaAura content is eligible to be cited in ChatGPT, Claude,
  // Perplexity, Gemini / AI Overviews and Bing / Copilot answers.
  const aiCrawlers = [
    "GPTBot", // OpenAI training
    "OAI-SearchBot", // ChatGPT search
    "ChatGPT-User", // ChatGPT browsing
    "ClaudeBot", // Anthropic
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended", // Gemini / AI Overviews opt-in
    "Applebot-Extended",
    "CCBot", // Common Crawl (feeds many LLMs)
    "cohere-ai",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: blocked },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: blocked,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
