import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MotionReveal } from '../ui/MotionReveal';
import { useRouter } from '../../context/RouterContext';

/**
 * SelectionProtocolSection — 100% structural parity with Mattis StrategySection.tsx:
 * - Canvas: Electric Orange (#ff4500) with subtle 4% film grain and pb-0
 * - Center Divider: 1px vertical line at 50% width (bg-white/[0.18])
 * - Row 1: Left "CURATED" | "1-OF-1 ARCHIVE"; Right "2024-26©" + 92px right-aligned 3-line display headline
 * - Row 2 (items-end): Left manifesto copy with bold white highlights + link;
 *   Right 2-column subgrid with tall vertical monochrome portrait flush to section bottom + giant stat
 */
export const SelectionProtocolSection: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section
      id="protocol"
      className="relative w-full bg-[#ff4500] text-white overflow-hidden pt-8 sm:pt-10 lg:pt-[30px] pb-0 px-6 sm:px-8 lg:px-[30px] scroll-mt-[64px]"
    >
      {/* Subtle Noise Grain Overlay (Framer parity: 4% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
          backgroundSize: '256px 256px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Centered Vertical Divider Line (50% position, white 18% opacity) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/[0.18] z-[1] hidden lg:block" />

      {/* Main 1440px Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col gap-12 sm:gap-16 lg:gap-20">
        {/* ROW 1: TOP (Grid 2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-start">
          {/* Top Left: Curated & 500+ Bales Sorted */}
          <div className="lg:pr-[30px]">
            <MotionReveal delay={0.05} direction="down">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-white/60">
                <span className="text-white font-semibold tracking-widest">CURATED</span>
                <span>500+ BALES SORTED</span>
              </div>
            </MotionReveal>
          </div>

          {/* Top Right: 2024-26© and TASTE BEFORE TREND. */}
          <div className="lg:pl-[30px] flex justify-between items-start gap-6 sm:gap-8">
            <MotionReveal delay={0.05} direction="down">
              <span className="font-mono text-xs uppercase tracking-wider text-white/60 shrink-0 select-none">
                2024-26©
              </span>
            </MotionReveal>

            <div className="flex-1 flex justify-end">
              <MotionReveal delay={0.1} direction="up" className="w-full">
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[92px] font-semibold uppercase tracking-[-0.05em] leading-[0.82em] text-white text-right select-none">
                  <span className="block overflow-hidden">
                    <span className="inline-block">TASTE</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="inline-block">BEFORE</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="inline-block">TREND.</span>
                  </span>
                </h2>
              </MotionReveal>
            </div>
          </div>
        </div>

        {/* ROW 2: BOTTOM (Grid 2 columns, items-end so portrait sits flush to bottom edge) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-end">
          {/* Bottom Left: Manifesto Copy + About Link */}
          <div className="lg:pr-[30px] flex flex-col justify-between self-stretch gap-10 sm:gap-14 pb-6 lg:pb-[30px]">
            <MotionReveal delay={0.15} direction="up">
              <p className="text-xs sm:text-sm font-sans uppercase font-medium tracking-tight text-white/80 leading-relaxed max-w-md">
                COLLECTORS DECIDE{' '}
                <span className="font-bold text-white">IF A PIECE IS GRAIL-GRADE</span>{' '}
                THE SECOND THEY FEEL THE WEIGHT. WE REJECT 94% OF EVERY WEEKLY BALE—SHAPED
                BY{' '}
                <span className="font-bold text-white">
                  HEAVYWEIGHT FIBERS, SINGLE-STITCH HEMS, AND 130°C OZONE SANITIZATION.
                </span>
              </p>
            </MotionReveal>

            <MotionReveal delay={0.2} direction="up">
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-white hover:text-white/80 transition-colors tracking-wider group w-fit"
              >
                <span>Our Curation Protocol</span>
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            </MotionReveal>
          </div>

          {/* Bottom Right: 2-Column Subgrid (Tall Flush Portrait Left, 6% Counter Right) */}
          <div className="lg:pl-[30px] grid grid-cols-1 sm:grid-cols-2 gap-8 items-end w-full">
            {/* Sub-col 1: Tall Vertical Editorial Portrait Photo — Flush to Section Bottom */}
            <MotionReveal
              delay={0.2}
              direction="up"
              className="w-full flex justify-start sm:justify-center"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-none aspect-[569/885] overflow-hidden bg-black shadow-2xl group select-none">
                <img
                  src="/assets/lookbook/look-2.jpg"
                  alt="Ladha Archive Editorial Portrait"
                  className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </MotionReveal>

            {/* Sub-col 2: 6% Counter and Selection Benchmark Label */}
            <div className="flex flex-col justify-end items-start sm:items-end text-left sm:text-right pb-6 lg:pb-[30px]">
              <MotionReveal delay={0.25} direction="up">
                <div className="text-6xl sm:text-7xl lg:text-[78px] font-semibold tracking-[-0.07em] leading-none text-white select-none">
                  6%
                </div>
              </MotionReveal>
              <MotionReveal delay={0.3} direction="up">
                <p className="mt-3 text-xs sm:text-[13px] font-sans text-white/85 leading-snug max-w-[200px]">
                  Acceptance rate across every 500-piece archival bale we inspect in Nairobi
                </p>
              </MotionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
