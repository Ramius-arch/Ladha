import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProofNumbersSection — 100% structural parity with Mattis NumbersProof.tsx:
 * - Canvas: #ff4500 Electric Orange with 4% tactile stipple grain
 * - Center 1px Hairline Divider at 50%
 * - Left 50%: 3 Stacked Rows with Checkerboard White Dots ([Dot] | 500+, <2HR | [Dot], [Dot] | 100%)
 * - Right 50%: 92px Display Headline, Copy & Curator Profile Card
 * - Stepped Bottom Accent: Left 50% #ff4500, Right 50% #e9e9e9 (30px height)
 */
export const ProofNumbersSection: React.FC = () => {
  return (
    <section
      id="proof"
      className="relative w-full bg-[#ff4500] text-white pt-[30px] px-5 sm:px-6 md:px-[30px] pb-[120px] overflow-hidden select-none"
    >
      {/* 4% Noise Grain Overlay matching Framer tactile stipple */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png")`,
          backgroundSize: '128px 128px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Center 1px Hairline Divider — 50% axis with 18% white opacity */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-white/[0.18] pointer-events-none z-10" />

      {/* Main Inner Container (max-w-[1440px]) */}
      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col gap-[30px]">
        {/* Top Section Label: "HOW WE DO IT" */}
        <div className="w-full">
          <p className="text-[12px] font-medium leading-[14.4px] tracking-[-0.01em] uppercase text-white/70">
            How we do it
          </p>
        </div>

        {/* Bilateral 2-Column Row (50% / 50% split) */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-end gap-16 md:gap-0">
          {/* LEFT COLUMN: 3 Stacked Rows with Checkerboard White Dots */}
          <div className="w-full md:w-1/2 md:pr-10 lg:pr-16 flex flex-col gap-[50px]">
            {/* ROW 0: [Dot] (left) | 500+ (right) */}
            <div className="grid grid-cols-2 max-w-[500px] w-full items-start">
              <div className="relative pt-2">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="flex flex-col">
                <span className="text-5xl sm:text-[58px] font-semibold tracking-[-0.07em] text-white leading-none font-sans">
                  500+
                </span>
                <p className="text-[12px] font-medium leading-[14.4px] tracking-[-0.01em] uppercase text-white/70 mt-3">
                  Garments <span className="text-white">inspected weekly</span> across{' '}
                  <span className="text-white">Gikomba &amp; Toi</span>
                </p>
              </div>
            </div>

            {/* ROW 1: <2HR (left) | [Dot] (right) */}
            <div className="grid grid-cols-2 max-w-[500px] w-full items-start">
              <div className="flex flex-col">
                <span className="text-5xl sm:text-[58px] font-semibold tracking-[-0.07em] text-white leading-none font-sans">
                  &lt;2HR
                </span>
                <p className="text-[12px] font-medium leading-[14.4px] tracking-[-0.01em] uppercase text-white/70 mt-3">
                  Same-day <span className="text-white">rider dispatch</span> across
                  <br className="hidden sm:block" />
                  Nairobi estates
                </p>
              </div>

              <div className="relative pt-2 flex justify-end pr-4 sm:pr-8">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* ROW 2: [Dot] (left) | 100% (right) */}
            <div className="grid grid-cols-2 max-w-[500px] w-full items-start">
              <div className="relative pt-2">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="flex flex-col">
                <span className="text-5xl sm:text-[58px] font-semibold tracking-[-0.07em] text-white leading-none font-sans">
                  100%
                </span>
                <p className="text-[12px] font-medium leading-[14.4px] tracking-[-0.01em] uppercase text-white/70 mt-3">
                  Singular <span className="text-white">1-of-1 inventory</span> with
                  <br className="hidden sm:block" />
                  KRA eTIMS invoicing
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 92px Display Headline, Copy & Curator Profile */}
          <div className="w-full md:w-1/2 md:pl-10 lg:pl-16 flex flex-col gap-[50px]">
            <h2 className="text-5xl sm:text-7xl lg:text-[92px] font-semibold leading-[0.82] tracking-[-0.05em] text-white uppercase max-w-[600px] select-none">
              EVERY PIECE HERE SURVIVED A 94% REJECTION RATE.
            </h2>

            <div className="flex flex-col gap-[30px]">
              <p className="text-[12px] font-medium uppercase leading-[14.4px] tracking-[-0.01em] text-white/60 max-w-[340px]">
                <span className="text-white">We don&apos;t chase fast fashion</span>. We
                archive garments where heavyweight fabric, stitch integrity, and patina make
                a <span className="text-white">permanent statement</span>.
              </p>

              {/* Lead Curator Profile Card */}
              <div className="flex items-center gap-4">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                  src="/assets/lookbook/look-4.jpg"
                  alt="Kamau Njoroge"
                  className="w-[50px] h-[50px] rounded-full object-cover shrink-0 select-none shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium leading-[18.2px] tracking-[-0.01em] text-white">
                    Kamau Njoroge
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium leading-[13.2px] tracking-[-0.01em] text-white/90">
                    <span>Head of Curation at</span>
                    <span className="text-[13px] font-medium leading-[15.6px] tracking-[-0.01em] text-white">
                      Ladha®
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepped Bottom Accent: Left 50% #ff4500, Right 50% #e9e9e9 */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[30px] flex pointer-events-none z-20">
        <div className="w-1/2 h-full bg-[#ff4500] border-r border-white/[0.18]" />
        <div className="w-1/2 h-full bg-[#e9e9e9]" />
      </div>
    </section>
  );
};
