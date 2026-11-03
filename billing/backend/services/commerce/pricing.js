/**
 * Commerce Pricing & Taxation Service (Kenya VAT 16%)
 */

const VAT_RATE = 0.16;

/**
 * Calculates VAT-inclusive pricing breakdown.
 * In Kenyan retail commerce, shelf prices are VAT-inclusive by default.
 * Gross = Net * (1 + VAT_RATE)
 * Net = Gross / (1 + VAT_RATE)
 * Tax = Gross - Net
 */
function calculateVatInclusive(grossAmount, rate = VAT_RATE) {
  const gross = Number(grossAmount) || 0;
  const net = Math.round((gross / (1 + rate)) * 100) / 100;
  const tax = Math.round((gross - net) * 100) / 100;
  return {
    gross,
    net,
    tax,
    rate
  };
}

/**
 * Zonal courier delivery tariffs across Nairobi and Kenyan metro zones.
 */
function calculateShippingFee(region) {
  if (!region) return 300;
  const normalized = region.toLowerCase();
  if (normalized.includes('cbd') || normalized.includes('town')) return 200;
  if (normalized.includes('kilimani') || normalized.includes('westlands') || normalized.includes('lavington') || normalized.includes('kileleshwa')) return 250;
  if (normalized.includes('karen') || normalized.includes('ruaka') || normalized.includes('thika') || normalized.includes('rongai') || normalized.includes('kikuyu')) return 400;
  if (normalized.includes('mombasa') || normalized.includes('kisumu') || normalized.includes('nakuru') || normalized.includes('eldoret')) return 500;
  return 300; // Standard Nairobi courier default
}

/**
 * Computes full order financial totals for retail cart items and shipping.
 */
function computeOrderTotals(items, region) {
  const subtotalGross = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return sum + (price * qty);
  }, 0);

  const shippingGross = calculateShippingFee(region);
  const totalGross = subtotalGross + shippingGross;

  const subtotalBreakdown = calculateVatInclusive(subtotalGross);
  const shippingBreakdown = calculateVatInclusive(shippingGross);
  const totalTax = Math.round((subtotalBreakdown.tax + shippingBreakdown.tax) * 100) / 100;
  const totalNet = Math.round((subtotalBreakdown.net + shippingBreakdown.net) * 100) / 100;

  return {
    currency: 'KES',
    subtotal: subtotalGross,
    shippingFee: shippingGross,
    total: totalGross,
    netSubtotal: subtotalBreakdown.net,
    taxSubtotal: subtotalBreakdown.tax,
    netShipping: shippingBreakdown.net,
    taxShipping: shippingBreakdown.tax,
    totalNet,
    totalTax,
    vatRate: VAT_RATE
  };
}

module.exports = {
  VAT_RATE,
  calculateVatInclusive,
  calculateShippingFee,
  computeOrderTotals
};
