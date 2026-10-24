import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedBlogPosts,
} from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BrandImage } from "@/components/shared/brand-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta, CardTitle } from "@/components/ui/card";
import { JsonLd } from "@/components/shared/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, 3);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Travel Guides", href: "/blog" },
    { label: post.title, href: `/blog/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={articleJsonLd(post)} />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8">
          <Badge variant="subtle">{post.category}</Badge>
        </div>

        <h1 className="text-lit mt-5 font-display text-display-sm uppercase text-foreground sm:text-display-md">
          {post.title}
        </h1>

        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption uppercase tracking-[0.14em] text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-3 text-accent" />
            {post.readingMinutes} minute read
          </span>
          <span>{post.author}</span>
        </p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-md border border-border">
          <BrandImage
            src={post.coverImage}
            alt={post.title}
            fill
            width={1200}
            height={675}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <p className="mt-10 text-body-lg leading-relaxed text-foreground/85">
          {post.excerpt}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {post.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-body-md leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row">
          <Button asChild>
            <Link href="/enquire">Plan a trip around this</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">More guides</Link>
          </Button>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-12" aria-labelledby="related-posts">
            <h2
              id="related-posts"
              className="font-display text-heading-lg uppercase tracking-wide text-foreground"
            >
              Read next
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Card interactive>
                    <Link href={`/blog/${item.slug}`} className="group block outline-none">
                      <CardBody>
                        <CardMeta>{item.category}</CardMeta>
                        <CardTitle className="mt-2 text-heading-sm transition-colors group-hover:text-accent">
                          {item.title}
                        </CardTitle>
                      </CardBody>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
