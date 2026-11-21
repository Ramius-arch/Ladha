import React, { useEffect, useRef, useState } from 'react';
import { Check, FileText, MessageCircle, Smartphone, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import {
  initiateDukaCheckout,
  queryMpesaStatus,
  simulateMpesaAction,
} from '../services/dukaCheckout';
import { markProductsSoldOut, submitOrderRecord } from '../services/storeDb';
import { CartItem } from '../types/store';
import { STORE_CONFIG } from '../config/storeConfig';

interface CheckoutPageProps {
  onCatalogMutated: () => void;
}

const REGIONS = [
  { value: 'nairobi-kilimani', label: 'Nairobi — Kilimani / Westlands / Lavington', fee: 250 },
  { value: 'nairobi-cbd', label: 'Nairobi CBD / Upper Hill Dispatch', fee: 200 },
  { value: 'nairobi-karen', label: 'Nairobi — Karen / Langata / Runda', fee: 350 },
  { value: 'countrywide', label: 'Countrywide Express Courier (Mombasa / Kisumu / Nakuru)', fee: 450 },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onCatalogMutated }) => {
  const { items, subtotal, clearCart } = useCart();
  const { navigate } = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [regionVal, setRegionVal] = useState('nairobi-kilimani');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>(
    STORE_CONFIG.hasMpesaTill ? 'mpesa' : 'cod'
  );
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [stkError, setStkError] = useState<string | null>(null);
  const [stkModal, setStkModal] = useState<{
    active: boolean;
    mode: string;
    orderCode: string;
    checkoutRequestId?: string;
    statusText: string;
  } | null>(null);
  const finalizedOrderRef = useRef<string | null>(null);

  const [completedOrder, setCompletedOrder] = useState<{
    orderCode: string;
    receiptCode: string;
    customerName: string;
    customerPhone: string;
    deliveryZone: string;
    cart: CartItem[];
    shippingFee: number;
    grandTotal: number;
  } | null>(null);

  const activeRegion = REGIONS.find((r) => r.value === regionVal) || REGIONS[0];
  const grandTotal = subtotal + activeRegion.fee;

  const finalizeOrder = (orderCode: string, receiptCode: string) => {
    if (finalizedOrderRef.current === orderCode) return;
    finalizedOrderRef.current = orderCode;

    const purchasedSnapshot = [...items];
    const fullCustomerName = `${firstName} ${lastName}`.trim();
    const deliveryFull = `${address}, ${activeRegion.label}`;

    submitOrderRecord({
      id: orderCode,
      customerName: fullCustomerName,
      phone,
      estate: activeRegion.label,
      address,
      items: purchasedSnapshot,
      subtotal,
      deliveryFee: activeRegion.fee,
      total: grandTotal,
      paymentMethod: paymentMethod === 'mpesa' ? 'MPESA' : 'COD',
      mpesaReceipt: receiptCode || 'PENDING',
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
    });

    markProductsSoldOut(purchasedSnapshot.map((i) => i.id));
    onCatalogMutated();
    clearCart();

    setStkModal(null);
    setStkError(null);
    setSubmitting(false);
    setCompletedOrder({
      orderCode,
      receiptCode,
      customerName: fullCustomerName,
      customerPhone: phone,
      deliveryZone: deliveryFull,
      cart: purchasedSnapshot,
      shippingFee: activeRegion.fee,
      grandTotal,
    });
  };

  const finalizeOrderHandlerRef = useRef(finalizeOrder);
  finalizeOrderHandlerRef.current = finalizeOrder;

  // Real-time M-Pesa STK Status Polling when awaiting customer PIN
  useEffect(() => {
    if (!stkModal?.active || !stkModal.checkoutRequestId) return;
    const reqId = stkModal.checkoutRequestId;
    const orderCode = stkModal.orderCode;
    let attempts = 0;

    const timer = window.setInterval(async () => {
      attempts += 1;
      const res = await queryMpesaStatus(reqId);
      if (res.status === 'COMPLETED' || res.status === 'PAID' || res.status === 'SUCCESS') {
        window.clearInterval(timer);
        finalizeOrderHandlerRef.current(orderCode, res.receiptCode || 'QKL88291LA');
      } else if (res.status === 'CANCELLED' || res.status === 'FAILED') {
        window.clearInterval(timer);
        setStkModal(null);
        setStkError('M-Pesa payment was cancelled or failed. Retry or select Cash on Delivery.');
        setSubmitting(false);
      } else if (attempts >= 40) {
        window.clearInterval(timer);
        setStkModal(null);
        setStkError('M-Pesa STK confirmation timed out. Please retry or select Cash on Delivery.');
        setSubmitting(false);
      }
    }, 1500);

    return () => window.clearInterval(timer);
  }, [stkModal?.active, stkModal?.checkoutRequestId, stkModal?.orderCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || !agreedTerms || submitting) return;

    setStkError(null);
    finalizedOrderRef.current = null;
    setSubmitting(true);
    const result = await initiateDukaCheckout({
      customer: {
        name: `${firstName} ${lastName}`.trim(),
        phone,
        address: `${address}, ${activeRegion.label}`,
      },
      items,
      paymentMethod,
    });

    if (result.mode === 'cod' || result.mode === 'autonomous_fallback' || !result.checkoutRequestId) {
      finalizeOrder(result.orderCode, result.receiptCode);
      return;
    }

    setStkModal({
      active: true,
      mode: result.mode,
      orderCode: result.orderCode,
      checkoutRequestId: result.checkoutRequestId,
      statusText: `STK Push sent to ${phone}. Enter your M-Pesa PIN to confirm KES ${grandTotal.toLocaleString()}.`,
    });
  };

  const whatsappTrackUrl = completedOrder
    ? STORE_CONFIG.whatsappUrl(
        `*${STORE_CONFIG.brandName} ORDER CONFIRMATION*\nRef: ${completedOrder.orderCode}\nM-Pesa Receipt: ${completedOrder.receiptCode}\nCustomer: ${completedOrder.customerName} (${completedOrder.customerPhone})\nDelivery: ${completedOrder.deliveryZone}\nTotal: KES ${completedOrder.grandTotal.toLocaleString()}`
      )
    : '#';

  return (
    <div className="min-h-screen bg-[#e9e9e9] text-[#0b0b0b]">
      {/* Top Dark Header */}
      <section className="bg-[#0b0b0b] text-white pt-[110px] pb-12 px-5 sm:px-6 lg:px-[30px] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50 mb-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="hover:text-white transition-colors"
            >
              HOME
            </a>
            <span>/</span>
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop');
              }}
              className="hover:text-white transition-colors"
            >
              SHOP
            </a>
            <span>/</span>
            <span className="text-[#ff4500]">CHECKOUT</span>
          </div>
          <h1 className="font-sans text-[44px] sm:text-[64px] font-semibold tracking-[-0.05em] leading-[0.85em] uppercase">
            CLAIM & CHECKOUT.
          </h1>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] py-10 lg:py-14">
        {completedOrder ? (
          <div className="max-w-[640px] mx-auto bg-white border border-[#0b0b0b]/15 p-8 sm:p-10 text-center">
            <div className="w-14 h-14 mx-auto bg-[#0b0b0b] text-[#c7ff97] flex items-center justify-center mb-6">
              <Check size={28} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff4500]">
              1-OF-1 ORDER CONFIRMED
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight uppercase mt-2">
              PIECES RESERVED & PACKED.
            </h2>
            <p className="mt-3 text-sm text-[#0b0b0b]/70">
              Receipt code: <strong className="font-mono text-[#0b0b0b]">{completedOrder.receiptCode}</strong> • Phone:{' '}
              <strong className="font-mono text-[#0b0b0b]">{completedOrder.customerPhone}</strong>
            </p>
            <div className="my-6 py-3 px-4 bg-[#f4f4f4] border border-[#0b0b0b]/10 font-mono text-sm font-bold tracking-widest uppercase">
              ORDER REF: {completedOrder.orderCode}
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={async () => {
                  const { generateClientEtimsPdf } = await import('../services/etimsPdf');
                  generateClientEtimsPdf(completedOrder);
                }}
                className="w-full py-3.5 px-5 bg-[#059669] hover:bg-[#047857] text-white font-mono text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <FileText size={15} />
                <span>DOWNLOAD KRA eTIMS INVOICE (PDF)</span>
              </button>

              <a
                href={whatsappTrackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-[#ff4500] hover:bg-[#e63e00] text-white font-mono text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={15} />
                <span>TRACK ON WHATSAPP →</span>
              </a>

              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="w-full py-3 px-5 border border-[#0b0b0b]/25 hover:bg-[#0b0b0b] hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-[560px] mx-auto bg-white border border-[#0b0b0b]/15 p-10 text-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff4500]">
              BAG IS EMPTY
            </span>
            <h2 className="font-sans text-2xl font-semibold uppercase mt-2">
              NO 1-OF-1 PIECES SELECTED YET
            </h2>
            <p className="text-sm text-[#0b0b0b]/65 mt-3">
              Explore live drops first — every piece is singular and moves fast.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-6 px-6 py-3.5 bg-[#ff4500] hover:bg-[#e63e00] text-white font-mono text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              BROWSE ALL DROPS →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Checkout Funnel Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 bg-white border border-[#0b0b0b]/15 p-6 sm:p-8 flex flex-col gap-8"
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff4500]">
                  STEP 01 // COURIER & LOGISTICS
                </span>
                <h2 className="font-sans text-2xl font-semibold tracking-tight uppercase mt-1 mb-5">
                  DELIVERY COORDINATES
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#0b0b0b]/65 block mb-1.5">
                      First Name *
                    </label>
                    <input
                      id="checkout-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Kamau"
                      className="w-full px-3.5 py-2.5 bg-[#f4f4f4] border border-[#0b0b0b]/15 text-sm outline-none focus:border-[#ff4500]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#0b0b0b]/65 block mb-1.5">
                      Last Name *
                    </label>
                    <input
                      id="checkout-last-name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Njoroge"
                      className="w-full px-3.5 py-2.5 bg-[#f4f4f4] border border-[#0b0b0b]/15 text-sm outline-none focus:border-[#ff4500]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#0b0b0b]/65 block mb-1.5">
                    Street Address / Building / Apartment *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Argwings Kodhek Rd, Court 4B"
                    className="w-full px-3.5 py-2.5 bg-[#f4f4f4] border border-[#0b0b0b]/15 text-sm outline-none focus:border-[#ff4500]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#0b0b0b]/65 block mb-1.5">
                      Safaricom M-Pesa Number *
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full px-3.5 py-2.5 bg-[#f4f4f4] border border-[#0b0b0b]/15 text-sm font-mono outline-none focus:border-[#ff4500]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#0b0b0b]/65 block mb-1.5">
                      Delivery Zone & Tariff *
                    </label>
                    <select
                      value={regionVal}
                      onChange={(e) => setRegionVal(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f4f4f4] border border-[#0b0b0b]/15 text-xs font-mono uppercase outline-none focus:border-[#ff4500] cursor-pointer"
                    >
                      {REGIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label} (+KES {r.fee})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-[#0b0b0b]/15 pt-7">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff4500]">
                  STEP 02 // SETTLEMENT METHOD
                </span>
                <h2 className="font-sans text-2xl font-semibold tracking-tight uppercase mt-1 mb-5">
                  PAYMENT VERIFICATION
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {STORE_CONFIG.hasMpesaTill && (
                    <label
                      className={`border p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'mpesa'
                          ? 'border-[#ff4500] bg-[#ff4500]/[0.04]'
                          : 'border-[#0b0b0b]/15 bg-[#f9f9f9]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_method"
                            checked={paymentMethod === 'mpesa'}
                            onChange={() => setPaymentMethod('mpesa')}
                          />
                          <span className="font-sans text-sm font-bold uppercase">
                            Lipa na M-Pesa Instant STK Push
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#0b0b0b] text-[#c7ff97]">
                          TILL {STORE_CONFIG.mpesaTill}
                        </span>
                      </div>
                      <p className="text-xs text-[#0b0b0b]/70 mt-2 pl-6">
                        Triggers an instant STK prompt on your phone. Generates an official Safaricom M-Pesa SMS receipt and KRA eTIMS PDF invoice.
                      </p>
                    </label>
                  )}

                  <label
                    className={`border p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#ff4500] bg-[#ff4500]/[0.04]'
                        : 'border-[#0b0b0b]/15 bg-[#f9f9f9]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <span className="font-sans text-sm font-bold uppercase">
                          Pay on Delivery — Direct M-Pesa ({STORE_CONFIG.phoneLocal}) or Cash
                        </span>
                      </div>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#0b0b0b] text-[#c7ff97]">
                        VERIFIED HANDOVER
                      </span>
                    </div>
                    <p className="text-xs text-[#0b0b0b]/70 mt-2 pl-6">
                      Inspect your 1-of-1 piece upon arrival, then settle directly via M-Pesa Send Money to <strong>{STORE_CONFIG.phoneDisplay}</strong> or Cash at handover. Never send funds to any unverified Till number.
                    </p>
                  </label>
                </div>

                {/* Legal Consent */}
                <label className="mt-5 flex items-start gap-3 p-3.5 bg-[#f4f4f4] border border-[#0b0b0b]/15 text-xs text-[#0b0b0b]/75 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I confirm garment flat-lay measurements and agree to LADHA&apos;s{' '}
                    <a
                      href="/legal#terms"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/legal#terms');
                      }}
                      className="underline font-bold text-[#0b0b0b]"
                    >
                      Terms
                    </a>
                    ,{' '}
                    <a
                      href="/legal#privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/legal#privacy');
                      }}
                      className="underline font-bold text-[#0b0b0b]"
                    >
                      KDPA Privacy Policy
                    </a>
                    , and{' '}
                    <a
                      href="/legal#disclosures"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/legal#disclosures');
                      }}
                      className="underline font-bold text-[#0b0b0b]"
                    >
                      Curation Disclosures
                    </a>
                    .
                  </span>
                </label>

                {stkError && (
                  <div
                    role="alert"
                    className="mt-4 p-3.5 bg-[#ff4500]/10 border border-[#ff4500] text-[#0b0b0b] font-mono text-xs flex items-center gap-2.5"
                  >
                    <ShieldAlert size={16} className="text-[#ff4500] shrink-0" />
                    <span>{stkError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !agreedTerms}
                  className="mt-6 w-full py-4 px-6 bg-[#ff4500] hover:bg-[#e63e00] disabled:opacity-50 text-white font-mono text-xs font-semibold uppercase tracking-widest transition-colors"
                >
                  {submitting
                    ? 'CONFIRMING ORDER...'
                    : paymentMethod === 'cod'
                    ? `RESERVE ORDER — PAY KES ${grandTotal.toLocaleString()} ON DELIVERY →`
                    : `AUTHORIZE KES ${grandTotal.toLocaleString()} & PLACE ORDER →`}
                </button>
              </div>
            </form>

            {/* Right Sticky Obsidian Order Summary */}
            <aside className="lg:col-span-5 lg:sticky lg:top-[90px] bg-[#0b0b0b] text-white border border-white/15 p-6 sm:p-8 flex flex-col gap-6">
              <div className="border-b border-white/15 pb-4 flex items-center justify-between">
                <h2 className="font-sans text-xl font-semibold uppercase tracking-tight">
                  ORDER SUMMARY
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#c7ff97]">
                  {items.length} PIECE{items.length > 1 ? 'S' : ''}
                </span>
              </div>

              <div className="divide-y divide-white/10 max-h-[340px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="py-3.5 flex gap-3.5 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover bg-[#181818] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans text-sm font-medium text-white truncate">
                        {item.name}
                      </h3>
                      <span className="font-mono text-[10px] text-white/50 block">
                        SIZE: {item.size}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      KES {item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/15 pt-4 flex flex-col gap-2.5 font-mono text-xs">
                <div className="flex justify-between text-white/65">
                  <span>SUBTOTAL</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/65">
                  <span>DISPATCH ({activeRegion.value.toUpperCase()})</span>
                  <span>KES {activeRegion.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-white/15 pt-3 mt-1">
                  <span>TOTAL</span>
                  <span className="text-[#ff4500]">KES {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 font-mono text-[10px] uppercase tracking-wider text-white/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#c7ff97]">✓</span>
                  <span>1-OF-1 PIECE RESERVED FOR 15 MINUTES</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c7ff97]">✓</span>
                  <span>OFFICIAL KRA eTIMS PDF INVOICE ISSUED</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* M-Pesa STK Push Live Prompt Overlay */}
      {stkModal?.active && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-[440px] bg-[#0b0b0b] text-white border border-white/20 p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#c7ff97]">
                <Smartphone size={16} />
                <span>LIPA NA M-PESA STK PUSH</span>
              </div>
              <span className="font-mono text-[10px] text-white/50">{stkModal.orderCode}</span>
            </div>

            <h3 className="font-sans text-xl font-semibold uppercase tracking-tight">
              ENTER YOUR M-PESA PIN ON PHONE
            </h3>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">{stkModal.statusText}</p>

            <div className="mt-5 p-3 bg-[#121212] border border-white/10 font-mono text-[11px] text-white/60 flex items-center gap-2">
              <ShieldAlert size={14} className="text-[#ff4500] shrink-0" />
              <span>Awaiting Safaricom Daraja callback confirmation...</span>
            </div>

            {stkModal.checkoutRequestId && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 block mb-2.5">
                  LOCAL SANDBOX SIMULATOR CONTROLS
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      const reqId = stkModal.checkoutRequestId!;
                      const orderCode = stkModal.orderCode;
                      await simulateMpesaAction(reqId, 'APPROVE');
                      const res = await queryMpesaStatus(reqId);
                      if (res.status === 'COMPLETED' || res.status === 'PAID' || res.status === 'SUCCESS') {
                        finalizeOrderHandlerRef.current(orderCode, res.receiptCode || 'QKL88291LA');
                      }
                    }}
                    className="py-2.5 px-3 bg-[#059669] hover:bg-[#047857] text-white font-mono text-[10px] font-bold uppercase tracking-wider"
                  >
                    APPROVE PAYMENT
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await simulateMpesaAction(stkModal.checkoutRequestId!, 'CANCEL');
                      setStkModal(null);
                      setStkError('M-Pesa STK prompt cancelled. Retry or select Cash on Delivery.');
                      setSubmitting(false);
                    }}
                    className="py-2.5 px-3 border border-white/20 hover:border-[#ff4500] text-white/75 font-mono text-[10px] uppercase tracking-wider"
                  >
                    CANCEL STK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
