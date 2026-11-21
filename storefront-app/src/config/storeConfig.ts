/**
 * Centralized Store Contact & Handover Configuration.
 * Override any value at handover via Vercel Environment Variables (no code edit required):
 * - VITE_STORE_NAME
 * - VITE_STORE_PHONE_DISPLAY  (e.g. "+254 706 678 338")
 * - VITE_STORE_PHONE_LOCAL    (e.g. "0706 678 338")
 * - VITE_STORE_WHATSAPP       (international digits only, e.g. "254706678338")
 * - VITE_MPESA_TILL           (Buy Goods Till or Paybill)
 * - VITE_STORE_EMAIL          (e.g. "archive@ladha.ke")
 */

const whatsappDigits = (import.meta.env.VITE_STORE_WHATSAPP || '254706678338').replace(/\D/g, '');
const mpesaTill = (import.meta.env.VITE_MPESA_TILL || '').trim();

export const STORE_CONFIG = {
  brandName: import.meta.env.VITE_STORE_NAME || 'LADHA',
  phoneDisplay: import.meta.env.VITE_STORE_PHONE_DISPLAY || '+254 706 678 338',
  phoneLocal: import.meta.env.VITE_STORE_PHONE_LOCAL || '0706 678 338',
  whatsappDigits,
  mpesaTill,
  hasMpesaTill: mpesaTill.length > 0,
  email: import.meta.env.VITE_STORE_EMAIL || 'archive@ladha.ke',
  whatsappUrl(message?: string): string {
    const base = `https://wa.me/${whatsappDigits}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  },
} as const;
