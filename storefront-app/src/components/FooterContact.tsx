import React, { useState } from 'react';
import { ChevronDown, Check, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { saveDispatchLead } from '../services/storeDb';
import { STORE_CONFIG } from '../config/storeConfig';

export const FooterContact: React.FC = () => {
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Early access to 6% weekly drop alerts');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    saveDispatchLead({
      name: name.trim(),
      email: email.trim(),
      interest,
    });
    setSubmitted(true);
    window.setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
    }, 3500);
  };

  const footerLink = (label: string, href: string) => (
    <a
      key={label}
      href={href}
      onClick={(e) => {
        if (!href.startsWith('/admin')) {
          e.preventDefault();
          navigate(href);
        }
      }}
      className="hover:text-white transition-colors"
    >
      {label}
    </a>
  );

  return (
    <footer
      id="contact"
      className="relative w-full bg-[#0b0b0b] text-white overflow-hidden select-none z-[12] border-t border-white/10"
    >
      {/* Muted Editorial Texture Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/lookbook/look-8.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-[0.14] grayscale contrast-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/85 to-[#0b0b0b]/60" />
      </div>

      {/* Archival Film Grain */}
      <div className="grain-overlay absolute inset-0 z-[1] opacity-[0.07]" />

      {/* Center Vertical Hairline */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/[0.1] z-[2] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] pt-16 sm:pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-between lg:pr-12 xl:pr-16">
            <div>
              {/* Live Nairobi Drop Availability Pill */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2 border border-white/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#c7ff97] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white">
                  VAULT STATUS <span className="text-white/50">//</span> SAME-DAY NBO DISPATCH
                </span>
              </div>

              {/* Curator Studio Card */}
              <div className="mt-10 max-w-[360px] shadow-2xl">
                <div className="bg-[#1b1b1b] p-5 border-b border-white/10 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                      SOURCED & SANITIZED IN
                    </span>
                    <span className="font-sans text-lg font-medium text-white tracking-tight mt-0.5">
                      KILIMANI STUDIO, NBO
                    </span>
                  </div>
                  <div className="w-10 h-10 overflow-hidden border border-white/20 shrink-0">
                    <img
                      src="/assets/products/product-14.jpg"
                      alt="LADHA Curator Vault"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="bg-white text-[#0b0b0b] p-5 flex flex-col items-end text-right">
                  <p className="text-sm font-medium leading-snug tracking-tight max-w-[260px]">
                    Send us your waist, pit-to-pit fit, or archival reference — our curators source directly from weekly bales.
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-black/60 mt-3">
                    LADHA ARCHIVAL DESK
                  </span>
                </div>
              </div>

              {/* Direct Contacts */}
              <div className="mt-10 flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/50 mb-2">
                  {STORE_CONFIG.hasMpesaTill
                    ? `DIRECT CONCIERGE & TILL ${STORE_CONFIG.mpesaTill}`
                    : 'DIRECT CONCIERGE & WHATSAPP ORDERS'}
                </span>
                <a
                  href={STORE_CONFIG.whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl sm:text-[26px] font-semibold tracking-tight text-white hover:text-[#ff4500] transition-colors w-fit"
                >
                  {STORE_CONFIG.phoneDisplay}
                </a>
                <a
                  href={`mailto:${STORE_CONFIG.email}`}
                  className="text-sm sm:text-base font-medium tracking-tight text-white/80 hover:text-white transition-colors mt-1 w-fit"
                >
                  {STORE_CONFIG.email}
                </a>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/45 mt-3 max-w-[290px] leading-relaxed">
                  ORDERS VERIFIED BEFORE 14:00 EAT DISPATCH SAME DAY ACROSS NAIROBI.
                </p>
              </div>
            </div>

            <div className="mt-14 lg:mt-20 flex items-center gap-3">
              <span className="inline-block w-3 h-3 bg-[#ff4500]" />
              <span className="text-white font-bold text-sm tracking-widest uppercase">
                LADHA® — TASTE OVER TREND.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Private Drop / Sourcing Alert Form */}
          <div className="flex flex-col lg:pl-12 xl:pl-16">
            <h2 className="text-5xl sm:text-7xl lg:text-[84px] font-semibold text-white tracking-[-0.05em] leading-[0.84em] uppercase font-sans">
              PRIVATE
              <br />
              DROP ALERTS.
            </h2>

            <p className="text-xs sm:text-[13px] uppercase tracking-wide text-white/60 mt-6 leading-relaxed max-w-xl">
              NO SPAM LISTS. GET NOTIFIED FIRST WHEN NEW 1-OF-1 DENIM, LEATHER, AND 90S WORKWEAR CLEAR SANITIZATION —{' '}
              <span className="font-semibold text-white">CLAIM BEFORE THE PUBLIC FLOOR.</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7">
              <div className="flex flex-col">
                <label htmlFor="dispatch-name" className="font-mono text-[11px] uppercase tracking-wider text-white/55 mb-1">
                  Name / Collector Handle
                </label>
                <div className="w-full border-b border-white/15 focus-within:border-[#ff4500] transition-colors">
                  <input
                    id="dispatch-name"
                    type="text"
                    required
                    placeholder="Wanjiku / @collector"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-white placeholder:text-white/30 text-sm font-sans pb-3 pt-1 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="dispatch-email" className="font-mono text-[11px] uppercase tracking-wider text-white/55 mb-1">
                  Email or WhatsApp Contact
                </label>
                <div className="w-full border-b border-white/15 focus-within:border-[#ff4500] transition-colors">
                  <input
                    id="dispatch-email"
                    type="email"
                    required
                    placeholder="collector@nairobi.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white placeholder:text-white/30 text-sm font-sans pb-3 pt-1 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="dispatch-interest" className="font-mono text-[11px] uppercase tracking-wider text-white/55 mb-1">
                  What Are You Hunting?
                </label>
                <div className="relative w-full border-b border-white/15 focus-within:border-[#ff4500] transition-colors">
                  <select
                    id="dispatch-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-transparent text-white text-sm font-sans pb-3 pt-1 outline-none appearance-none cursor-pointer pr-8"
                  >
                    <option value="Early access to 6% weekly drop alerts" className="bg-[#111] text-white">
                      Early access to 6% weekly drop alerts
                    </option>
                    <option value="90s Japanese / US Selvedge Denim (W30-W36)" className="bg-[#111] text-white">
                      90s Japanese / US Selvedge Denim (W30-W36)
                    </option>
                    <option value="Heavyweight Workwear & Duck Canvas Jackets" className="bg-[#111] text-white">
                      Heavyweight Workwear & Duck Canvas Jackets
                    </option>
                    <option value="Custom Private Styling / Editorial Pulls" className="bg-[#111] text-white">
                      Custom Private Styling / Editorial Pulls
                    </option>
                  </select>
                  <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
                <button
                  type="submit"
                  disabled={submitted}
                  className="h-[48px] px-6 bg-[#ff4500] hover:bg-[#e63e00] text-white font-mono text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors shrink-0"
                >
                  {submitted ? (
                    <>
                      <Check size={14} />
                      <span>REGISTERED IN VAULT</span>
                    </>
                  ) : (
                    <>
                      <span>JOIN DROP LIST</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/45 leading-relaxed">
                  KDPA 2019 COMPLIANT. ZERO DATA RESALE.
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Utility Navigation */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-white/45">
          <span>© 2026 LADHA ARCHIVAL COMMERCE // NAIROBI, KENYA</span>
          <div className="flex flex-wrap items-center gap-5">
            {footerLink('Shop Drops', '/shop')}
            {footerLink('About', '/about')}
            {footerLink('Terms', '/legal#terms')}
            {footerLink('Privacy', '/legal#privacy')}
            {footerLink('Disclosures', '/legal#disclosures')}
            <a href="/admin.html" className="hover:text-[#ff4500] transition-colors">
              Store Desk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
