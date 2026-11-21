import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { STORE_CONFIG } from '../config/storeConfig';

type LegalTab = 'terms' | 'privacy' | 'disclosures';

export const LegalPage: React.FC = () => {
  const { hash, navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<LegalTab>('terms');

  useEffect(() => {
    const clean = hash.replace(/^#/, '').toLowerCase();
    if (clean === 'privacy' || clean === 'disclosures' || clean === 'terms') {
      setActiveTab(clean);
    }
  }, [hash]);

  const switchTab = (tab: LegalTab) => {
    setActiveTab(tab);
    window.history.replaceState({}, '', `${window.location.pathname}#${tab}`);
  };

  return (
    <div className="min-h-screen bg-[#e9e9e9] text-[#0b0b0b]">
      {/* Dark Header */}
      <section className="bg-[#0b0b0b] text-white pt-[110px] pb-14 px-5 sm:px-6 lg:px-[30px] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50 mb-6">
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
            <span className="text-[#ff4500]">LEGAL & GOVERNANCE</span>
          </div>

          <h1 className="font-sans text-[44px] sm:text-[68px] font-semibold tracking-[-0.05em] leading-[0.85em] uppercase">
            TERMS, KDPA & DISCLOSURES.
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-white/55">
            LADHA ARCHIVAL COMMERCE LIMITED // EFFECTIVE 2026 // NAIROBI, REPUBLIC OF KENYA
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1000px] mx-auto px-5 sm:px-6 py-12">
        {/* Hairline Tabs */}
        <div className="flex flex-wrap border border-[#0b0b0b]/20 bg-white mb-8">
          {(
            [
              { id: 'terms', label: '01 // TERMS OF SERVICE' },
              { id: 'privacy', label: '02 // KDPA PRIVACY POLICY' },
              { id: 'disclosures', label: '03 // CURATION DISCLOSURES' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`flex-1 min-w-[190px] py-3.5 px-4 font-mono text-[11px] uppercase tracking-wider border-b md:border-b-0 md:border-r last:border-r-0 border-[#0b0b0b]/15 transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0b0b0b] text-white'
                  : 'bg-white text-[#0b0b0b]/70 hover:text-[#ff4500]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#0b0b0b]/15 p-7 sm:p-10 space-y-8 text-sm leading-relaxed text-[#0b0b0b]/80">
          {activeTab === 'terms' && (
            <>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  1. Archival Singular Piece Commerce (1-of-1 Rule)
                </h2>
                <p>
                  Every piece published in a LADHA drop is individually salvaged, authenticated, and cataloged as a singular 1-of-1 garment. Adding an item to your bag does not place an indefinite hold until checkout settlement completes.
                </p>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  2. Pricing, M-Pesa & KRA eTIMS Settlement
                </h2>
                <p>
                  {STORE_CONFIG.hasMpesaTill ? (
                    <>
                      All catalog prices are stated in Kenya Shillings (KES) inclusive of applicable statutory VAT (16%). M-Pesa Lipa na Safaricom STK payments settle against Buy Goods Till <strong>{STORE_CONFIG.mpesaTill}</strong>, generating an official KRA eTIMS PDF invoice alongside your SMS confirmation.
                    </>
                  ) : (
                    <>
                      All catalog prices are stated in Kenya Shillings (KES). Orders are confirmed directly via WhatsApp (<strong>{STORE_CONFIG.phoneDisplay}</strong>) and settled upon delivery via Cash or direct M-Pesa to <strong>{STORE_CONFIG.phoneLocal}</strong>. Never send payments to any third-party Till number not explicitly verified by LADHA.
                    </>
                  )}
                </p>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  3. Courier Dispatch SLA
                </h2>
                <p>
                  Orders placed and verified before <strong>14:00 EAT (East Africa Time)</strong> Monday through Saturday qualify for guaranteed Same-Day Nairobi Courier Dispatch. Nationwide delivery outside Nairobi (Mombasa, Kisumu, Nakuru, Eldoret) operates via secured courier on a standard 24–48 hour delivery SLA.
                </p>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  4. Archival Exchanges & Returns
                </h2>
                <p>
                  Due to the rare, non-reproducible nature of curated vintage bales, all archive sales are final once delivered and accepted. Precise centimeter and inch flat measurements are published on every product page. Claims regarding undisclosed structural defects must be lodged within <strong>24 hours</strong> of delivery for archive credit or exchange.
                </p>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  1. Kenya Data Protection Act (KDPA 2019) Compliance
                </h2>
                <p>
                  LADHA operates in strict adherence to the Kenya Data Protection Act of 2019. We practice data minimization: collecting only the personal identifiers required to fulfill courier dispatch and issue statutory tax receipts.
                </p>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  2. Information We Collect
                </h2>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Contact Identifiers:</strong> Full name and Safaricom / WhatsApp phone number for dispatch logistics.</li>
                  <li><strong>Logistics Coordinates:</strong> Street address, building, apartment, and delivery zone tariff.</li>
                  <li><strong>Transaction Verification:</strong> Safaricom M-Pesa receipt codes strictly for ledger reconciliation. LADHA never collects, views, or stores M-Pesa PINs.</li>
                </ul>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  3. Zero Data Monetization & Right of Erasure
                </h2>
                <p>
                  LADHA never sells, leases, or licenses customer records to third-party brokers. Collectors may request complete order record expungement at any time via <a href={`mailto:${STORE_CONFIG.email}`} className="font-bold underline text-[#0b0b0b]">{STORE_CONFIG.email}</a>.
                </p>
              </div>
            </>
          )}

          {activeTab === 'disclosures' && (
            <>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  1. The 6% Curation Protocol
                </h2>
                <p>
                  LADHA inventory is salvaged from heritage bales arriving through Nairobi&apos;s primary textile trading hubs (Gikomba and Toi Market). Approximately <strong>94% of inspected garments are rejected</strong> for synthetic degradation, warped seams, or generic silhouettes.
                </p>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  2. Condition Grading Disclosure
                </h2>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>GRADE A+ (MINT / NOS):</strong> Deadstock or near-immaculate vintage condition with zero noticeable wear.</li>
                  <li><strong>GRADE A (EXCELLENT VINTAGE):</strong> Gentle uniform patina, strong seams, zero holes or structural compromises.</li>
                  <li><strong>ARCHIVE DISTRESSED:</strong> Intentional heritage fades, honeycombs, or subtle workwear wear documented accurately per specimen.</li>
                </ul>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold uppercase tracking-tight text-[#0b0b0b] mb-2">
                  3. Sanitization & Textile Care
                </h2>
                <p>
                  Every admitted garment completes deep antibacterial steam sanitization at 130°C, pH-neutral soaking to protect original natural dyes, and ozone vault storage prior to dispatch.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
