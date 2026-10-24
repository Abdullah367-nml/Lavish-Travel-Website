/**
 * Display formatting for the en-ZA locale.
 *
 * Money is always stored and charged in ZAR as whole-rand integers. These
 * helpers are the only place those values become strings, so there is a
 * single place to change when the multi-currency display toggle arrives in
 * Phase 2 (which converts for *display only*, and must label the result as
 * indicative).
 */

/**
 * "R12 500" — the thousands separator is a narrow no-break space (U+202F),
 * which is the South African convention and stops the number wrapping
 * across a line break mid-figure.
 */
export function formatZar(rands: number): string {
  const grouped = Math.round(rands)
    .toLocaleString("en-ZA")
    .replace(/[\s ]/g, " ");
  return `R${grouped}`;
}

/** "From R12 500" — for cards where the price is a starting point. */
export function formatFromZar(rands: number): string {
  return `From ${formatZar(rands)}`;
}

/** "R12 500 pp" — per-person tour pricing. */
export function formatZarPerPerson(rands: number): string {
  return `${formatZar(rands)} pp`;
}

/** "1 day" / "7 days" */
export function formatDuration(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}

/** 45 -> "45 min", 95 -> "1 h 35 min", 120 -> "2 h" */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

/**
 * "14 November 2026". Pinned to UTC so the string is identical on the
 * server and in the browser — a locale-dependent date is one of the
 * classic causes of a React hydration mismatch.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

const CATEGORY_LABELS: Record<string, string> = {
  day_tour: "Day Tour",
  multi_day: "Multi-Day",
  safari: "Safari",
  wine: "Winelands",
  cultural: "Cultural",
  adventure: "Adventure",
  cross_border: "Cross-Border",
};

export function formatCategory(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

const VEHICLE_CLASS_LABELS: Record<string, string> = {
  executive_sedan: "Executive Sedan",
  luxury_suv: "Luxury SUV",
  minibus: "Minibus",
  coach: "Coach",
  "4x4": "Safari 4x4",
};

export function formatVehicleClass(vehicleClass: string): string {
  return VEHICLE_CLASS_LABELS[vehicleClass] ?? vehicleClass;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
};

export function formatDifficulty(difficulty: string): string {
  return DIFFICULTY_LABELS[difficulty] ?? difficulty;
}
