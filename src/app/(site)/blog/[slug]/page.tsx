import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/sanity/lib/fetchers";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getBlogPostSlugs()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const title = post.seo?.title ?? `${post.title} | RenovaAura`;
  const description = post.seo?.description ?? post.excerpt ?? "RenovaAura patient education article.";
  return {
    title,
    description,
    robots: post.seo?.noIndex ? { index: false, follow: true } : undefined,
    alternates: { canonical: post.seo?.canonicalUrl ?? `/blog/${post.slug}` },
    openGraph: { title, description },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  return (
    <article className="section">
      <div className="container narrow">
        <nav className="loc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{post.title}</span>
        </nav>
        <div className="eyebrow">RENOVAAURA · PATIENT EDUCATION</div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="lead">{post.excerpt}</p>}
        <div className="content-body">
          {Array.isArray(post.body) && post.body.length > 0 ? (
            post.body.map((block, index) => {
              const value = block as { _type?: string; style?: string; children?: { text?: string }[] };
              const text = value.children?.map((child) => child.text ?? "").join("") ?? "";
              if (!text) return null;
              if (value.style === "h2") return <h2 key={index}>{text}</h2>;
              if (value.style === "h3") return <h3 key={index}>{text}</h3>;
              return <p key={index}>{text}</p>;
            })
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>
      </div>
    </article>
  );
}
