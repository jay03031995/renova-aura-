import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Skin, Hair & Aesthetic Blog | RenovaAura",
  description:
    "Read RenovaAura articles on skin care, hair restoration, aesthetics and plastic surgery, reviewed before publication.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <section className="section">
      <div className="container">
        <nav className="loc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Blog</span>
        </nav>
        <div className="section-head">
          <div className="eyebrow">RENOVAAURA · PATIENT EDUCATION</div>
          <h1>Skin, Hair and Aesthetic Care Articles</h1>
          <p>Clinically reviewed education from RenovaAura for patients researching care before consultation.</p>
        </div>
        {posts.length > 0 ? (
          <div className="location-area-grid">
            {posts.map((post) => (
              <Link className="location-area-card" href={`/blog/${post.slug}`} key={post._id}>
                <span className="location-area-name">{post.title}</span>
                {post.excerpt && <span className="location-area-links">{post.excerpt}</span>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No published articles are available yet.</p>
        )}
      </div>
    </section>
  );
}
