import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { LOOKBOOK_REELS, EDITORIAL_GALLERY } from '../../data/siteContent';
import { LookbookEntry } from '../../types/store';
import { useRouter } from '../../context/RouterContext';

interface LookSlideProps {
  look: LookbookEntry;
  index: number;
  onNavigate: (path: string) => void;
}

/**
 * Single full-bleed Lookbook slide adhering 100% to Mattis WorksBento.tsx forensic tokens:
 * - Opaque #0b0b0b base container (prevents any bleed-through or text stacking across slides!)
 * - Fullscreen blurred backdrop (filter brightness 0.60, blur 12px, scale 105)
 * - 10% authentic film grain texture overlay
 * - 1px vertical hairline at 50% width (white/18)
 * - Giant horizontal infinite marquee ticker behind foreground card (80px-160px Geist 600 uppercase)
 * - 12-column HUD layout:
 *   * Col 1-2: Index (01) / (02) / (03) / (04) at top (pt-[30px])
 *   * Col 3-10 (Center 8 cols): Sharp aspect-[1.73678] media card + 8-col bottom metadata grid
 *   * Col 11-12: LOOKBOOK at top (pt-[30px], text-right)
 */
const LookSlide: React.FC<LookSlideProps> = ({ look, index, onNavigate }) => {
  const numLabel = `(0${index + 1})`;

  return (
    <div className="relative w-full h-[100dvh] lg:h-full flex flex-col justify-between overflow-hidden bg-[#0b0b0b]">
      {/* 1. FULLSCREEN BLURRED BACKDROP & FILM GRAIN TEXTURE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {look.video ? (
          <video
            src={look.video}
            poster={look.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.55] blur-[16px] scale-110"
          />
        ) : (
          <img
            src={look.image}
            alt=""
            className="w-full h-full object-cover filter brightness-[0.55] blur-[16px] scale-110"
          />
        )}

        {/* Subtle dark tint */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Authentic 10% Film Grain Overlay */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
            backgroundSize: '256px 256px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Center 1px Vertical Hairline (white 18% opacity) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/[0.18] hidden lg:block" />
      </div>

      {/* 2. GIANT HORIZONTAL BACKGROUND TICKER (BEHIND FOREGROUND CARD)
          Positioned at top-[40%] on mobile so it sits cleanly behind the media frame and never collides with bottom metadata */}
      <div className="absolute top-[40%] sm:top-[44%] lg:top-1/2 -translate-y-1/2 left-0 right-0 z-[1] overflow-hidden pointer-events-none select-none opacity-75">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="flex gap-[14px] whitespace-nowrap w-max will-change-transform"
        >
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="font-sans text-[64px] sm:text-[104px] lg:text-[140px] xl:text-[160px] font-semibold uppercase tracking-[-0.04em] leading-[0.82em] text-white"
            >
              {look.title}
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. RESPONSIVE HUD & FOREGROUND CARD LAYOUT (max-w-[1440px]) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[20px] h-full flex flex-col justify-between lg:block">
        {/* Mobile/Tablet Top HUD Row (< lg) */}
        <div className="flex lg:hidden items-center justify-between w-full pt-6 pb-2 z-20 shrink-0">
          <span className="font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-white/70">
            {numLabel}
          </span>
          <span className="font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-white/70">
            LOOKBOOK
          </span>
        </div>

        {/* Main Grid: Full-width on mobile/tablet, 12-column HUD on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full flex-1 lg:h-full items-center lg:items-stretch gap-x-1">
          {/* Desktop Top-Left Col 1-2: Index (01) / (02) / (03) / (04) */}
          <div className="hidden lg:block lg:col-span-2 lg:pt-[30px] z-20">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-white/60">
              {numLabel}
            </span>
          </div>

          {/* Center Stage: Full width on mobile, Col 3-10 (8 Columns) on Desktop */}
          <div className="col-span-1 lg:col-span-8 h-full flex flex-col items-center justify-center z-10 py-2 lg:py-0">
            <div className="w-full max-w-[min(100%,calc((100dvh-180px)*1.73678))] flex flex-col gap-3.5 lg:gap-4">
              {/* Foreground Sharp Media Card (aspect-[4/3] on mobile for fuller presence, aspect-[1.73678] on sm+) */}
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/shop');
                }}
                className="group relative w-full aspect-[4/3] sm:aspect-[1.73678] overflow-hidden rounded-none bg-black shadow-2xl border border-white/15 block cursor-pointer"
                aria-label={`View ${look.title}`}
              >
                {look.video ? (
                  <video
                    src={look.video}
                    poster={look.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Subtle inner noise texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
                    backgroundSize: '256px 256px',
                    backgroundRepeat: 'repeat',
                  }}
                />
              </a>

              {/* Bottom Meta Row: Clean 2-row stack on mobile, 8-column split on sm+ */}
              <div className="flex flex-col sm:grid sm:grid-cols-8 w-full pt-1 gap-2.5 sm:gap-0 items-start text-[11px] sm:text-[12px] font-medium uppercase tracking-[-0.01em] bg-[#0b0b0b]/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-3 sm:p-0 border border-white/10 sm:border-0">
                {/* Title & Subtitle (Left 4 cols on sm+) */}
                <div className="w-full sm:col-span-4 sm:pr-4">
                  <span className="font-sans text-white font-semibold block leading-snug">
                    {look.title}
                  </span>
                  <span className="font-sans text-white/70 block leading-snug mt-0.5 text-[11px]">
                    {look.subtitle}
                  </span>
                </div>

                {/* Right 4 cols: Tags + Location/Drop Stamp */}
                <div className="w-full sm:col-span-4 flex items-center sm:items-start justify-between gap-2 pt-2 sm:pt-0 border-t border-white/10 sm:border-0">
                  <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5 text-white/65">
                    {look.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="font-sans">
                        {tIdx > 0 ? <span className="sm:hidden mr-2 text-white/30">•</span> : null}
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-right text-white/75 shrink-0">
                    <span className="font-sans">
                      {look.year} // {look.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Top-Right Col 11-12: LOOKBOOK */}
          <div className="hidden lg:block lg:col-span-2 lg:pt-[30px] text-right z-20">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[-0.01em] text-white/60">
              LOOKBOOK
            </span>
          </div>
        </div>

        {/* Mobile bottom spacer for balanced vertical centering */}
        <div className="h-4 lg:hidden shrink-0" />
      </div>
    </div>
  );
};

export const LookbookShowcase: React.FC = () => {
  const { navigate } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 3 sequential bottom-to-top curtain wipes across the 400vh pinned track
  // Each slide gets a dedicated full-screen hold window before the next wipe begins,
  // and Slide (04) holds 100% uncropped from 0.86 -> 1.00 before releasing into ReputationProofSection.
  const clipTop1 = useTransform(scrollYProgress, [0.06, 0.28], [100, 0], { clamp: true });
  const clipPath1 = useMotionTemplate`inset(${clipTop1}% 0px 0px 0px)`;

  const clipTop2 = useTransform(scrollYProgress, [0.36, 0.58], [100, 0], { clamp: true });
  const clipPath2 = useMotionTemplate`inset(${clipTop2}% 0px 0px 0px)`;

  const clipTop3 = useTransform(scrollYProgress, [0.66, 0.86], [100, 0], { clamp: true });
  const clipPath3 = useMotionTemplate`inset(${clipTop3}% 0px 0px 0px)`;

  const contactSheet = (
    <div className="relative z-10 w-full bg-[#0b0b0b] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] py-12">
        <div className="flex items-center justify-between mb-6 font-mono text-[11px] uppercase tracking-widest text-white/55">
          <span>CONTACT SHEET // NBO STILLS</span>
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('/shop');
            }}
            className="text-white hover:text-[#ff4500] transition-colors"
          >
            BROWSE PIECES →
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {EDITORIAL_GALLERY.map((item) => (
            <div
              key={item.id}
              className="group border border-white/10 bg-[#121212] overflow-hidden cursor-pointer hover:border-[#ff4500] transition-colors duration-300"
              onClick={() => navigate('/shop')}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-[1.08] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-2 flex items-center justify-between font-mono text-[10px] uppercase text-white/65 border-t border-white/10">
                <span className="group-hover:text-white transition-colors">{item.title}</span>
                <span className="group-hover:text-[#ff4500] transition-colors">{item.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="lookbook"
      className="relative w-full bg-[#0b0b0b] text-white [overflow-x:clip] select-none scroll-mt-[64px]"
    >
      <div ref={containerRef} className="relative w-full h-[400vh] bg-[#0b0b0b]">
        {/* Sticky 100dvh Viewport Container pinned to top on both mobile and desktop */}
        <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#0b0b0b]">
          {/* Slide 0: Base stationary layer */}
          <div className="absolute inset-0 w-full h-full z-10">
            <LookSlide look={LOOKBOOK_REELS[0]} index={0} onNavigate={navigate} />
          </div>

          {/* Slide 1: Curtain unmasking over Slide 0 */}
          <motion.div
            className="absolute inset-0 w-full h-full z-20"
            style={{ clipPath: clipPath1 }}
          >
            <LookSlide look={LOOKBOOK_REELS[1]} index={1} onNavigate={navigate} />
          </motion.div>

          {/* Slide 2: Curtain unmasking over Slide 1 */}
          <motion.div
            className="absolute inset-0 w-full h-full z-30"
            style={{ clipPath: clipPath2 }}
          >
            <LookSlide look={LOOKBOOK_REELS[2]} index={2} onNavigate={navigate} />
          </motion.div>

          {/* Slide 3: Curtain unmasking over Slide 2 */}
          <motion.div
            className="absolute inset-0 w-full h-full z-40"
            style={{ clipPath: clipPath3 }}
          >
            <LookSlide look={LOOKBOOK_REELS[3]} index={3} onNavigate={navigate} />
          </motion.div>
        </div>
      </div>

      {contactSheet}
    </section>
  );
};
