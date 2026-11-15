import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { useRouter } from '../../context/RouterContext';

/**
 * ReputationProofSection — 100% structural parity with Mattis WhyUsReputation.tsx:
 * - Canvas: #e9e9e9 Light Gray, max-w-[1440px]
 * - 1px vertical hairline divider down the exact center (50%)
 * - Top row: Left "Why Ladha?" label, Right 92px headline "BUILT ON REPUTATION"
 * - Staggered interlocking cards along the vertical center line:
 *   * Card 1 (Left): Black (#0b0b0b) box, 377x280px, flush right against center line ("/4.9+" rating)
 *   * Card 2 (Right): White (#ffffff) box, 377x280px, flush left against center line, staggered below Card 1 ("/94%" repeat/referral)
 *   * Trust Badge (Left): 100x100px square flush right against center line below Card 2 with 3-chevron mark
 */
export const ReputationProofSection: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section
      id="why-us"
      className="relative w-full bg-[#e9e9e9] text-[#0b0b0b] px-5 sm:px-6 md:px-[30px] pt-[30px] pb-16 md:pb-24 overflow-hidden select-none"
    >
      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* Center 1px Vertical Hairline Divider — Framer Parity */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#0b0b0b]/10 pointer-events-none hidden md:block" />

        {/* 1. TOP HEADER ROW (Left: Label / Right: BUILT ON REPUTATION) */}
        <div className="flex flex-col md:flex-row items-start w-full mb-8 md:mb-12">
          <div className="w-full md:w-1/2 md:pr-8 mb-4 md:mb-0">
            <span className="font-mono text-xs uppercase tracking-wider text-[#0b0b0b]/60">
              Why Ladha?
            </span>
          </div>

          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="font-sans text-5xl sm:text-6xl md:text-[68px] lg:text-[92px] font-semibold leading-[0.82em] tracking-[-0.05em] uppercase text-[#0b0b0b]">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  Built on
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  className="inline-block"
                >
                  reputation
                </motion.span>
              </span>
            </h2>
          </div>
        </div>

        {/* 2. DESKTOP STAGGERED PUZZLE CARDS (>= 768px / md:) */}
        <div className="hidden md:flex w-full">
          {/* Left 50% Column */}
          <div className="w-1/2 flex flex-col items-end">
            {/* Card 1: Black Box (377x280px, flush against center divider) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-[377px] h-[280px] bg-[#0b0b0b] text-white p-6 flex flex-col justify-between"
            >
              <p className="font-sans text-xs font-normal text-white leading-relaxed">
                Verified collector rating across Nairobi &amp; East Africa
              </p>

              <div className="flex items-end justify-between w-full">
                <div className="flex items-baseline text-[56px] lg:text-[64px] font-medium tracking-[-0.07em] leading-none text-white">
                  <span className="opacity-60 mr-0.5">/</span>
                  <AnimatedCounter target={4.9} decimals={1} prefix="" suffix="+" />
                </div>

                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className="group flex items-center gap-1.5 text-xs text-white hover:opacity-80 transition-opacity"
                >
                  <span>Grading Matrix</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>

            {/* Spacer matching Card 2 height */}
            <div className="h-[280px] w-full" />

            {/* Trust Avatar & Logo Box (100x100px, flush against center divider) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-[100px] h-[100px] relative overflow-hidden flex items-center justify-center bg-[#0b0b0b]"
            >
              <img
                src="/assets/lookbook/look-2.jpg"
                alt="Ladha Collector Archive"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              />
              {/* Overlay 3-chevron logo */}
              <svg
                width="52"
                height="25"
                viewBox="0 0 52 25"
                fill="none"
                className="relative z-10 w-[52px] h-[25px]"
                aria-hidden="true"
              >
                <path d="M0 12.4011L17.3333 0V12.4011L0 24.8022V12.4011Z" fill="white" />
                <path d="M17.3334 12.4011L34.6667 0V12.4011L17.3334 24.8022V12.4011Z" fill="white" />
                <path d="M34.6666 12.4011L52 0V12.4011L34.6666 24.8022V12.4011Z" fill="white" />
              </svg>
            </motion.div>
          </div>

          {/* Right 50% Column */}
          <div className="w-1/2 flex flex-col items-start">
            {/* Spacer matching Card 1 height */}
            <div className="h-[280px] w-full" />

            {/* Card 2: White Box (377x280px, flush against center divider) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="w-[377px] h-[280px] bg-white text-[#0b0b0b] p-6 flex flex-col justify-between shadow-sm"
            >
              <p className="font-sans text-xs font-normal text-[#0b0b0b]/60 leading-relaxed">
                Drops claimed by<br />repeat archive collectors
              </p>

              <div className="flex items-end justify-between w-full">
                <div className="flex items-baseline text-[56px] lg:text-[64px] font-medium tracking-[-0.07em] leading-none text-[#0b0b0b]">
                  <span className="opacity-40 mr-0.5">/</span>
                  <AnimatedCounter target={94} decimals={0} prefix="" suffix="%" />
                </div>

                <a
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/shop');
                  }}
                  className="group flex items-center gap-1.5 text-xs text-[#0b0b0b] hover:opacity-80 transition-opacity"
                >
                  <span>Claim a Piece</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. MOBILE STACKED CARDS (< 768px / md:) */}
        <div className="flex md:hidden flex-col gap-6 items-center w-full">
          <div className="w-full max-w-md h-[240px] bg-[#0b0b0b] text-white p-6 flex flex-col justify-between">
            <p className="font-sans text-xs font-normal text-white leading-relaxed">
              Verified collector rating across Nairobi &amp; East Africa
            </p>
            <div className="flex items-end justify-between w-full">
              <div className="flex items-baseline text-5xl font-medium tracking-[-0.07em] leading-none text-white">
                <span className="opacity-60 mr-0.5">/</span>
                <AnimatedCounter target={4.9} decimals={1} prefix="" suffix="+" />
              </div>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
                className="group flex items-center gap-1.5 text-xs text-white hover:opacity-80 transition-opacity"
              >
                <span>Grading Matrix</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="w-full max-w-md h-[240px] bg-white text-[#0b0b0b] p-6 flex flex-col justify-between shadow-sm">
            <p className="font-sans text-xs font-normal text-[#0b0b0b]/60 leading-relaxed">
              Drops claimed by repeat archive collectors
            </p>
            <div className="flex items-end justify-between w-full">
              <div className="flex items-baseline text-5xl font-medium tracking-[-0.07em] leading-none text-[#0b0b0b]">
                <span className="opacity-40 mr-0.5">/</span>
                <AnimatedCounter target={94} decimals={0} prefix="" suffix="%" />
              </div>
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                }}
                className="group flex items-center gap-1.5 text-xs text-[#0b0b0b] hover:opacity-80 transition-opacity"
              >
                <span>Claim a Piece</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
