import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getBlogCategories, getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BrandImage } from "@/components/shared/brand-image";
import { FilterChips } from "@/components/shared/filter-chips";
import { Card, CardBody, CardMeta, CardTitle } from "@/components/ui/card";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const categories = await getBlogCategories();
  const active = categories.find((c) => c === category);

  if (!active) {
    return {
      title: "Travel Guides & South Africa Trip Planning",
      description:
        "Practical guides to travelling South Africa — when to visit Kruger, how long the Garden Route takes, what to book ahead in Cape Town, and the Hermanus whale season month by month.",
      alternates: { canonical: "/blog" },
    };
  }

  return {
    title: `${active} Guides`,
    description: `${active} articles and travel guidance for planning a trip to South Africa.`,
    alternates: { canonical: `/blog?category=${encodeURIComponent(active)}` },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const requested = typeof params.category === "string" ? params.category : undefined;

  const categories = await getBlogCategories();
  const active = categories.find((c) => c === requested);
  const [posts, all] = await Promise.all([
    getBlogPosts(active ? { category: active } : undefined),
    getBlogPosts(),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Travel Guides", href: "/blog" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={itemListJsonLd(
          posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}` })),
          "Travel guides",
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            TRAVEL JOURNAL
          </p>
          <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Travel guides
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            Practical, seasonal guidance from people who drive these routes
            every week — not rewritten brochure copy.
          </p>
        </div>

        <div className="mt-10">
          <FilterChips
            label="Filter guides by category"
            basePath="/blog"
            paramName="category"
            activeValue={active}
            options={categories.map((c) => ({
              value: c,
              label: c,
              count: all.filter((p) => p.category === c).length,
            }))}
          />
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li key={post.id}>
              <Card interactive className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col outline-none"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BrandImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      width={640}
                      height={400}
                      priority={index < 3}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-1/2" />
                  </div>

                  <CardBody className="flex flex-1 flex-col">
                    <CardMeta>{post.category}</CardMeta>
                    <CardTitle className="mt-3 text-heading-sm transition-colors group-hover:text-accent">
                      {post.title}
                    </CardTitle>
                    <p className="mt-3 flex-1 text-body-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <p className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock aria-hidden className="size-3 text-accent" />
                        {post.readingMinutes} min
                      </span>
                    </p>
                  </CardBody>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
