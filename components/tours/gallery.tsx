import { BrandImage } from "@/components/shared/brand-image";

/**
 * Hero gallery.
 *
 * A CSS scroll-snap rail on mobile and a static grid on desktop — no
 * carousel library, per Section 7. Swiping is handled by the browser's own
 * momentum scrolling, which is smoother than any JS implementation and
 * ships zero kilobytes.
 */
export function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const shots = images.length > 0 ? images : [""];

  return (
    <>
      {/* Mobile: swipe rail */}
      <div
        className="snap-rail -mx-4 flex gap-3 overflow-x-auto px-4 sm:hidden"
        // Announced as a scrollable region so keyboard users know it moves.
        role="region"
        aria-label={`${alt} — image gallery, scroll sideways`}
        tabIndex={0}
      >
        {shots.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="snap-item relative aspect-[4/3] w-[85vw] shrink-0 overflow-hidden rounded-md border border-border"
          >
            <BrandImage
              src={src}
              alt={`${alt} — image ${index + 1}`}
              fill
              width={800}
              height={600}
              priority={index === 0}
              sizes="85vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop: first image large, rest stacked beside it */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-3 sm:grid-rows-2">
        <div className="relative col-span-2 row-span-2 aspect-[16/11] overflow-hidden rounded-md border border-border">
          <BrandImage
            src={shots[0]}
            alt={`${alt} — main image`}
            fill
            width={1200}
            height={825}
            priority
            sizes="(max-width: 1024px) 66vw, 55vw"
          />
        </div>
        {shots.slice(1, 3).map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative overflow-hidden rounded-md border border-border"
          >
            <BrandImage
              src={src}
              alt={`${alt} — image ${index + 2}`}
              fill
              width={600}
              height={400}
              sizes="33vw"
            />
          </div>
        ))}
        {/* Keep the 2x2 grid whole when a tour has only one photo. */}
        {shots.length === 1 && (
          <>
            <div className="relative overflow-hidden rounded-md border border-border">
              <BrandImage src={`${shots[0]}#b`} alt="" fill width={600} height={400} sizes="33vw" />
            </div>
            <div className="relative overflow-hidden rounded-md border border-border">
              <BrandImage src={`${shots[0]}#c`} alt="" fill width={600} height={400} sizes="33vw" />
            </div>
          </>
        )}
        {shots.length === 2 && (
          <div className="relative overflow-hidden rounded-md border border-border">
            <BrandImage src={`${shots[1]}#b`} alt="" fill width={600} height={400} sizes="33vw" />
          </div>
        )}
      </div>
    </>
  );
}
