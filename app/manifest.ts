import type { MetadataRoute } from "next";

/**
 * PWA manifest (Section 8).
 *
 * theme_color and background_color are the logo's own near-black, so the
 * splash screen and the browser chrome match the site rather than flashing
 * white on launch.
 *
 * The 512 maskable icon is padded to 80% of the canvas so Android's
 * circular and squircle crops never clip the mark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lavish Travels & Tours",
    short_name: "Lavish",
    description:
      "Luxury airport transfers, chauffeur hire, self-drive car rental and tailored tours across South Africa.",
    start_url: "/",
    display: "standalone",
    theme_color: "#050506",
    background_color: "#050506",
    lang: "en-ZA",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
