/**
 * Universal (Server & Client) WhatsApp URL builders.
 * Kept free of "use client" so Server Components can call them directly during render.
 */

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27624015042";

export const CONCIERGE_EMAIL = "ilavishtravels@gmail.com";

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

export function getDirectEmailUrl(subject?: string, body?: string): string {
  const su =
    subject ?? "Private Tour & Travel Enquiry — Lavish Travels & Tours";
  const bd =
    body ??
    "Hi Lavish Travels & Tours,\n\nI would like to enquire about a private tour / transfer in South Africa.\n\nPreferred dates:\nNumber of guests:\nServices needed:\n\nThank you!";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONCIERGE_EMAIL)}&su=${encodeURIComponent(su)}&body=${encodeURIComponent(bd)}`;
}

export function getGmailComposeUrl(subject?: string, body?: string): string {
  return getDirectEmailUrl(subject, body);
}
