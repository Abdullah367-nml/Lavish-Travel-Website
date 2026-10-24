import localFont from "next/font/local";

/**
 * Fonts are vendored directly into the repo (./fonts/oswald, ./fonts/inter
 * — sourced from the Fontsource/Google Fonts OFL-licensed files) and
 * loaded with `next/font/local` rather than `next/font/google`.
 *
 * Functionally this is the same "self-hosted, zero layout shift" outcome
 * `next/font/google` gives you (both end up serving woff2 from your own
 * origin with an auto-generated fallback and `display: swap`) — the
 * difference is `next/font/google` fetches the files from
 * fonts.googleapis.com once at build time, while vendoring them means the
 * build never needs network access to Google at all, in any environment.
 * Swap back to `next/font/google` freely; nothing else in the app depends
 * on which approach is used.
 *
 * - Oswald: the display face. Condensed, high-contrast, reads well in wide
 *   letter-spaced uppercase — echoes the "LAVISH / TRAVELS & TOURS"
 *   wordmark in the logo. Used for headings only.
 * - Inter: neutral, highly legible body sans for paragraphs, forms, and UI.
 */
export const fontDisplay = localFont({
  src: [
    { path: "./fonts/oswald/oswald-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/oswald/oswald-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/oswald/oswald-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const fontSans = localFont({
  src: [
    {
      path: "./fonts/inter/inter-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
