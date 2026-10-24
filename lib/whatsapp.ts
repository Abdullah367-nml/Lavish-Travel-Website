/**
 * Universal (Server & Client) WhatsApp URL builders.
 * Kept free of "use client" so Server Components can call them directly during render.
 */

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27000000000";

export function getWhatsAppBookingUrl(tourTitle?: string): string {
  const text = tourTitle
    ? `Hi Lavish Travels & Tours, I would like to book the "${tourTitle}" tour.`
    : `Hi Lavish Travels & Tours, I would like to enquire about booking a tour package.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppGeneralUrl(message?: string): string {
  const text =
    message ??
    "Hi Lavish Travels & Tours, I would like to enquire about booking a private tour.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
