import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRouter } from '../../context/RouterContext';
import { Product } from '../../types/store';

interface HeroProps {
  featuredProducts: Product[];
}

/**
 * Hero section with 100% forensic parity to Mattis (https://mattis.framer.website):
 * 1. Background: Monochromatic black-and-white editorial video loop with high contrast & subtle vignette.
 * 2. Crosshairs: 4 discrete exterior framing lines (Top vertical, Left horizontal, Right horizontal, Bottom vertical)
 *    extending outward from the 740px aperture card to the viewport edges without cutting through the card or text.
 * 3. Card: 740px centered frosted-glass aperture (bg-[#ffffff08], backdrop-blur-[8px], border-[#ffffff2e])
 *    with 3D mouse-tilt physics and 4 glowing corner anchor dots.
 * 4. Stipple Grain: High z-index (z-30) tactile film grain overlay covering the hero including typography.
 * 5. Signature: Sweeping orange cursive SVG anchored at bottom-right overflowing outward into the dark space.
 * 6. Bottom-center square menu/scroll button (=) straddling the bottom border.
 */
export const Hero: React.FC<HeroProps> = ({ featuredProducts }) => {
  const { navigate } = useRouter();
  const leadPiece = featuredProducts[0];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseFromCenterX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseFromCenterY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(mouseFromCenterX);
    mouseY.set(mouseFromCenterY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#0b0b0b] text-white overflow-hidden pt-20 pb-16">
      {/* 1. Monochromatic Background Video Loop */}
      <video
        src="/assets/videos/streetwear-editorial.mp4"
        poster="/assets/lookbook/look-1.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none z-0 filter grayscale contrast-125"
      />

      {/* Subtle deep vignette gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b]/60 via-transparent to-[#0b0b0b]/80 pointer-events-none z-[1]" />

      {/* 2. Tactical Crosshairs Structure (Aperture Framing):
          Top vertical line + Left horizontal line + Right horizontal line + Bottom vertical line.
          They terminate at the card edges and NEVER cut through the text! */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
        {/* Top Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.68, 0, 0, 1] }}
          className="w-[1px] h-16 sm:h-20 lg:h-24 bg-white/[0.18] origin-top hidden md:block"
        />

        {/* Center Row: Left Line + 740px Card + Right Line */}
        <div className="w-full flex items-center justify-center">
          {/* Left Horizontal Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.68, 0, 0, 1] }}
            className="flex-1 h-[1px] bg-white/[0.18] origin-right hidden lg:block"
          />

          {/* Centered 740px Geometric Frosted Aperture Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 17,
              stiffness: 172,
              mass: 0.3,
              delay: 0.15,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative z-10 w-full max-w-[740px] mx-4 sm:mx-6 bg-[#ffffff08] backdrop-blur-[8px] border border-[#ffffff2e] p-[30px] pb-16 sm:pb-20 shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-visible"
          >
            {/* 4 Corner Anchor Dots */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />

            {/* Content Header */}
            <div className="flex flex-col gap-2">
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-mono text-[11px] sm:text-xs text-white uppercase tracking-widest select-none"
              >
                (EST. 2024 — DROP 04 // NAIROBI)
              </motion.p>

              {/* Main Title Row: LADHA® on left, ARCHIVE on right (Matches MATTIS® STUDIO 1:1) */}
              <div className="flex items-baseline justify-between gap-4 mt-2">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 17,
                    stiffness: 199,
                    mass: 0.3,
                    delay: 0.25,
                  }}
                  className="text-6xl sm:text-8xl md:text-[112px] font-semibold tracking-[-0.05em] leading-[0.82] uppercase text-white select-none"
                >
                  <span>LADHA</span>
                  <span className="text-xl sm:text-2xl font-mono text-white/80 ml-1.5 align-top font-normal">
                    ®
                  </span>
                </motion.h1>

                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white/90 uppercase select-none"
                >
                  ARCHIVE
                </motion.span>
              </div>
            </div>

            {/* Horizontal Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.68, 0, 0, 1] }}
              className="w-full h-[1px] bg-white/15 my-6 sm:my-8 origin-left"
            />

            {/* Bottom Content Row: Manifesto Left + Featured Drop / Curator Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left: Statement text */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-sans uppercase font-medium tracking-tight max-w-[95%]">
                  TASTE OVER TREND. WE ALIGN{' '}
                  <span className="text-white/50">90S ARCHIVAL STREETWEAR,</span> RAW
                  JAPANESE SELVEDGE, AND WORKWEAR INTO A SINGLE{' '}
                  <span className="font-bold text-white">1-OF-1 VAULT.</span>
                </p>
              </div>

              {/* Right: Featured Piece Avatar + Quick Claim Link (elevated cleanly above signature loop) */}
              <div
                onClick={() =>
                  navigate(
                    leadPiece
                      ? `/product?id=${encodeURIComponent(leadPiece.id)}`
                      : '/shop'
                  )
                }
                className="md:col-span-5 flex items-center gap-3 justify-start group cursor-pointer"
              >
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  src={leadPiece?.image || '/assets/lookbook/look-2.jpg'}
                  alt={leadPiece?.name || 'Nairobi Archive Lead Piece'}
                  className="w-10 h-10 rounded-full object-cover border border-white/30 shrink-0 shadow-sm"
                />
                <div className="text-left">
                  <div className="text-white font-medium text-sm leading-tight group-hover:text-[#ff4500] transition-colors">
                    {leadPiece ? leadPiece.name : 'Nairobi Vault Drop'}
                  </div>
                  <div className="text-white/60 font-mono text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c7ff97]" />
                    <span>
                      {leadPiece
                        ? `KES ${leadPiece.price.toLocaleString()} — 1/1`
                        : '1-OF-1 LIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Orange Cursive Signature SVG — Sweeping outside the card into the dark background */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 0.33, 0.3, 1.01] }}
              className="absolute -bottom-6 -right-16 sm:-right-28 md:-right-36 lg:-right-44 z-20 pointer-events-none select-none w-[380px] sm:w-[480px] md:w-[560px] lg:w-[620px]"
            >
              <img
                src="/assets/mattis_signature.svg"
                alt="Signature"
                className="w-full h-auto drop-shadow-[0_4px_24px_rgba(255,69,0,0.3)]"
              />
            </motion.div>

            {/* 4. Center Bottom Menu Square Button (=) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/#edit')}
                className="w-9 h-9 rounded-lg bg-[#0b0b0b] border border-white/20 flex flex-col items-center justify-center gap-1.5 shadow-xl hover:border-white/40 transition-colors cursor-pointer"
                aria-label="Explore Drops"
              >
                <span className="w-3.5 h-[2px] bg-white rounded-full" />
                <span className="w-3.5 h-[2px] bg-white rounded-full" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Horizontal Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.68, 0, 0, 1] }}
            className="flex-1 h-[1px] bg-white/[0.18] origin-left hidden lg:block"
          />
        </div>

        {/* Bottom Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.68, 0, 0, 1] }}
          className="w-[1px] h-16 sm:h-20 lg:h-24 bg-white/[0.18] origin-bottom hidden md:block"
        />
      </div>

      {/* 5. Category Sub-Bar: VINTAGE / STREETWEAR / SELVEDGE */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-wider text-white/50 select-none">
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="hover:text-white transition-colors cursor-pointer uppercase"
        >
          VINTAGE
        </button>
        <span className="text-white/20">/</span>
        <button
          type="button"
          onClick={() => navigate('/#edit')}
          className="hover:text-white transition-colors cursor-pointer uppercase"
        >
          STREETWEAR
        </button>
        <span className="text-white/20">/</span>
        <button
          type="button"
          onClick={() => navigate('/#lookbook')}
          className="hover:text-white transition-colors cursor-pointer uppercase"
        >
          LOOKBOOK
        </button>
      </div>

      {/* 6. Tactile Film Grain Overlay (z-30 covers whole viewport including typography) */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backgroundImage:
            "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
          backgroundSize: '256px 256px',
          backgroundRepeat: 'repeat',
          opacity: 0.12,
        }}
      />
    </section>
  );
};
