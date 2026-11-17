import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types/store';
import { ProductCard } from '../ui/ProductCard';
import { MotionReveal } from '../ui/MotionReveal';
import { RollingTextButton } from '../ui/RollingTextButton';
import { useRouter } from '../../context/RouterContext';

interface DropsCatalogSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const CATEGORIES = ['ALL', "MEN'S", "WOMEN'S", 'STREETWEAR', 'VINTAGE'] as const;

/**
 * DropsCatalogSection:
 * Combines Mattis's exact 4-row asymmetric ShowreelSection architecture at the top
 * ("WE CURATE GRAILS." right-aligned against the center 50% hairline, 378px preview card
 * starting at the center line, and "↓ SEE THE ARCHIVE" / "LOOKBOOK" play trigger)
 * with the live 1-of-1 Vault Product Grid below.
 */
export const DropsCatalogSection: React.FC<DropsCatalogSectionProps> = ({
  products,
  onQuickView,
}) => {
  const { navigate } = useRouter();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === 'ALL'
        ? products
        : products.filter((p) => p.category.toUpperCase() === activeCategory.toUpperCase());
    return filtered.slice(0, 9);
  }, [products, activeCategory]);

  const scrollToLookbook = () => {
    const el = document.getElementById('lookbook');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="edit"
      className="relative w-full bg-[#e9e9e9] text-[#0b0b0b] p-5 sm:p-6 lg:p-[30px] overflow-hidden select-none scroll-mt-[64px]"
    >
      {/* Centered Vertical 1px Divider Line (Framer .framer-ok755s: left: 50%, opacity 8%) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#0b0b0b] opacity-[0.08] z-[1] hidden lg:block pointer-events-none" />

      {/* 1440px Max-Width Stacked Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col gap-6 lg:gap-[30px]">
        {/* =========================================================================
            ROW 1 (1:1 Mattis ShowreelSection):
            - Left 50%:  "WE CURATE GRAILS." (Right-aligned against center 50% line)
            - Right 50%: "2024-26©" (Right-aligned to far right edge)
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-start justify-center w-full gap-4 lg:gap-0">
          <div className="w-full lg:w-1/2 flex justify-start lg:justify-end pr-0 lg:pr-[10px]">
            <MotionReveal delay={0.05} direction="up" className="w-full">
              <h2 className="text-[52px] sm:text-[72px] lg:text-[92px] font-semibold tracking-[-0.05em] leading-[0.82em] uppercase text-[#0b0b0b] text-left lg:text-right w-full">
                <span className="block overflow-hidden leading-[0.82em]">
                  <span className="inline-block">WE</span>
                </span>
                <span className="block overflow-hidden leading-[0.82em]">
                  <span className="inline-block">CURATE</span>
                </span>
                <span className="block overflow-hidden leading-[0.82em]">
                  <span className="inline-block">GRAILS.</span>
                </span>
              </h2>
            </MotionReveal>
          </div>

          <div className="w-full lg:w-1/2 flex justify-start lg:justify-end pl-0 lg:pl-[10px] pt-1">
            <MotionReveal delay={0.05} direction="down">
              <span className="font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-[#0b0b0b]/60 leading-[120%]">
                2024-26©
              </span>
            </MotionReveal>
          </div>
        </div>

        {/* =========================================================================
            ROW 2:
            - Left 50%:  Spacer
            - Right 50%: Subtitle statement starting at center line (max-w-[220px])
           ========================================================================= */}
        <div className="flex flex-row items-center justify-end w-full">
          <div className="w-full lg:w-1/2 flex justify-start pl-0 lg:pl-[10px]">
            <MotionReveal delay={0.1} direction="up">
              <p className="text-[12px] font-sans uppercase font-medium tracking-[-0.01em] leading-[120%] max-w-[220px]">
                <span className="text-[#0b0b0b]/60">WHERE EVERY SILHOUETTE FEELS </span>
                <span className="font-bold text-[#0b0b0b]">SINGULAR, VERIFIED</span>
                <span className="text-[#0b0b0b]/60">, AND </span>
                <span className="font-bold text-[#0b0b0b]">IMPOSSIBLE TO DUPLICATE</span>
              </p>
            </MotionReveal>
          </div>
        </div>

        {/* =========================================================================
            ROW 3:
            - Left 50%:  Spacer
            - Right 50%: 378px Editorial Video/Image Preview Card starting at center line
           ========================================================================= */}
        <div className="flex flex-row items-center justify-end w-full">
          <div className="w-full lg:w-1/2 flex justify-start pl-0 lg:pl-[10px]">
            <MotionReveal delay={0.15} direction="up" className="w-full max-w-[378px]">
              <motion.div
                onClick={scrollToLookbook}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group relative w-full aspect-[1.575] overflow-hidden rounded-none bg-black cursor-pointer shadow-lg select-none"
              >
                <img
                  src="/assets/lookbook/look-1.jpg"
                  alt="Ladha Archive Runway Preview"
                  className="w-full h-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
                    backgroundSize: '256px 256px',
                    backgroundRepeat: 'repeat',
                  }}
                />
              </motion.div>
            </MotionReveal>
          </div>
        </div>

        {/* =========================================================================
            ROW 4:
            - Left 50% (space-between):
                * Left Edge:  "↓ SEE THE ARCHIVE"
                * Right Edge: "LOOKBOOK" + 28px Circular Play Button (at center line)
            - Right 50%: Category Filter Bar
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-4 lg:gap-0 pb-4 border-b border-[#0b0b0b]/10">
          <div className="w-full lg:w-1/2 flex items-center justify-between pr-0 lg:pr-[10px] pt-2">
            <MotionReveal delay={0.15} direction="up">
              <button
                type="button"
                onClick={scrollToLookbook}
                className="inline-flex items-center font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-[#0b0b0b]/60 hover:text-[#0b0b0b] transition-colors cursor-pointer"
              >
                ↓ SEE THE LOOKBOOK
              </button>
            </MotionReveal>

            <MotionReveal delay={0.2} direction="up">
              <button
                type="button"
                onClick={scrollToLookbook}
                className="group flex items-center gap-[10px] hover:gap-[14px] transition-all duration-300 cursor-pointer"
                aria-label="Open Lookbook"
              >
                <span className="font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-[#0b0b0b] transition-colors">
                  Lookbook
                </span>
                <div className="w-7 h-7 rounded-full bg-[#0b0b0b] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="w-7 h-7">
                    <circle cx="14" cy="14" r="14" fill="#0B0B0B" />
                    <path d="M11.5 9.5L18.5 14L11.5 18.5V9.5Z" fill="white" />
                  </svg>
                </div>
              </button>
            </MotionReveal>
          </div>

          <div className="w-full lg:w-1/2 flex flex-wrap items-center justify-start lg:justify-end gap-1.5 pl-0 lg:pl-[10px] pt-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider border transition-colors ${
                    active
                      ? 'bg-[#0b0b0b] text-white border-[#0b0b0b]'
                      : 'bg-transparent text-[#0b0b0b]/65 border-[#0b0b0b]/15 hover:border-[#0b0b0b]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            ROW 5: CURATED 1-OF-1 VAULT PRODUCT GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom Full Catalog Trigger */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#0b0b0b]/10">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#0b0b0b]/70">
            <span>↓ EXPLORE FULL ARCHIVE ({products.length} PIECES)</span>
          </div>

          <RollingTextButton
            variant="dark"
            href="/shop"
            onClick={(e) => {
              e?.preventDefault();
              navigate('/shop');
            }}
            className="h-[40px] px-6 text-xs font-mono font-semibold tracking-wider"
          >
            OPEN FULL CATALOG →
          </RollingTextButton>
        </div>
      </div>
    </section>
  );
};
