// tailwind.config.js – custom design system for Lavish Travels
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050506",
        foreground: "#f5f5f5",
        accent: "#ff9500",
        "accent‑glow": "rgba(255,149,0,0.25)",
        "gradient‑from": "#1a1a1a",
        "gradient‑to": "#0d0d0d",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        glow: "0 0 30px rgba(255,149,0,0.35)",
      },
    },
  },
  plugins: [],
};
