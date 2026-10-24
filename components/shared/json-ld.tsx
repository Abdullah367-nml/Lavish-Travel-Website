/**
 * Renders a JSON-LD block.
 *
 * Section 6 is explicit about this: render from a Server Component as a
 * <script type="application/ld+json"> so the markup exists in the static
 * HTML, and do NOT try to emit it from generateMetadata — Next.js does not
 * support arbitrary script tags there, and a JSON-LD block injected on the
 * client is invisible to most crawlers.
 *
 * JSON.stringify handles escaping of the data. The only remaining hazard is
 * a literal "</script>" appearing inside a string value, which would close
 * the tag early, so that sequence is escaped defensively.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/<\/script/gi, "<\\/script");

  return (
    <script
      type="application/ld+json"
      // Safe: the content is JSON we serialised ourselves, not user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
