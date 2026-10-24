import Image from "next/image";
import { cn } from "@/lib/utils";
import { publicImageExists } from "@/lib/image-manifest";

/**
 * Every photographic slot on the site goes through this component.
 *
 * If the file exists in /public it renders through next/image. If it does
 * not — the case for most of the demo dataset until real photography
 * arrives — it renders a composed "light in the dark" panel instead:
 * a warm bloom, a metallic sheen along one diagonal, and a vignette.
 *
 * That composition is taken directly from the logo, so an unfilled slot
 * reads as deliberate art direction rather than a missing asset. Everything
 * is derived from a hash of the src, so a given image always looks the same
 * (identical on server and client — no hydration mismatch, no Math.random),
 * adjacent cards look genuinely different, and the whole thing is CSS with
 * zero JavaScript and zero network requests.
 *
 * Drop a real photo at the referenced path and it takes over on the next
 * build, with no code change.
 */

type BrandImageProps = {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Set true for the LCP element only. */
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
};

/** Stable string hash — same input always gives the same output. */
function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Ground tints — all within a few points of the logo's #020102 black. */
const GROUNDS = [
  "#08090a",
  "#0a0908",
  "#070809",
  "#0b0a09",
  "#060708",
];

/** Bloom colours: the tail-light reds and the amber indicators. */
const BLOOMS = [
  "rgb(217 75 35 / 0.62)",
  "rgb(239 166 75 / 0.48)",
  "rgb(159 28 16 / 0.68)",
  "rgb(217 75 35 / 0.50)",
  "rgb(239 166 75 / 0.38)",
];

export function BrandImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
}: BrandImageProps) {
  const isExternal = Boolean(src && (src.startsWith("http://") || src.startsWith("https://")));
  if (src && (isExternal || publicImageExists(src))) {
    return (
      <Image
        src={src}
        alt={alt}
        {...(fill
          ? { fill: true, sizes: sizes ?? "100vw" }
          : { width, height, sizes })}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  const seed = hash(src ?? alt);
  const ground = GROUNDS[seed % GROUNDS.length];
  const bloom = BLOOMS[(seed >> 3) % BLOOMS.length];

  // Keep the light source low and off-centre, the way tail lights sit.
  const bloomX = 18 + ((seed >> 5) % 66);
  const bloomY = 62 + ((seed >> 7) % 34);
  const bloomSize = 46 + ((seed >> 9) % 38);
  // The metallic shoulder highlight sweeps across at a varying angle.
  const sheenAngle = 96 + ((seed >> 11) % 8) * 11;
  const sheenStop = 28 + ((seed >> 13) % 30);

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden",
        fill ? "absolute inset-0 h-full w-full" : "",
        className,
      )}
      style={{
        ...(fill ? {} : { width, height }),
        background: ground,
      }}
    >
      {/* Metallic sheen — light catching a body panel. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${sheenAngle}deg, transparent 0%, rgb(161 164 164 / 0.16) ${sheenStop}%, rgb(218 220 220 / 0.09) ${
            sheenStop + 5
          }%, transparent ${sheenStop + 26}%)`,
        }}
      />

      {/* The light source. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${bloomSize}% ${
            bloomSize * 0.8
          }% at ${bloomX}% ${bloomY}%, ${bloom} 0%, transparent 68%)`,
        }}
      />

      {/* Vignette for depth. Kept light — at higher opacity it drowns the
          bloom underneath and the panel collapses back to a flat black box,
          which is the whole thing this composition exists to avoid. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 115% 95% at 50% 45%, transparent 58%, rgb(3 3 4 / 0.42) 100%)",
        }}
      />
    </div>
  );
}
