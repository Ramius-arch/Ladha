import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { RollingTextButton } from './ui/RollingTextButton';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { AmbientTrack } from '../hooks/useAmbientAudio';

interface HeaderProps {
  audioPlaying: boolean;
  currentTrack: AmbientTrack;
  onToggleAudio: () => void;
  onNextTrack: () => void;
}

/**
 * Flat full-width header matching Mattis (Framer forensic extraction):
 * Layout: [3-Chevron SVG] [Ladha®] | [Curated 1-of-1 Nairobi archive] ... [works / drops / lookbook / about] [BAG (N)]
 * On Home ('home'), floats transparently over Hero so the aperture crosshairs & video breathe uninterrupted.
 */
export const Header: React.FC<HeaderProps> = ({
  audioPlaying,
  currentTrack,
  onToggleAudio,
  onNextTrack,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count, openDrawer } = useCart();
  const { navigate, route } = useRouter();

  const navLinks = [
    { name: 'drops', href: '/shop', active: route === 'shop' },
    { name: 'the edit', href: '/#edit', active: false },
    { name: 'lookbook', href: '/#lookbook', active: false },
    { name: 'about', href: '/about', active: route === 'about' },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(href);
  };

  const isHome = route === 'home';

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 17, stiffness: 172, mass: 0.3 }}
        className={`${
          isHome
            ? 'absolute top-0 left-0 right-0 z-40 bg-transparent pt-4 sm:pt-6'
            : 'fixed top-0 left-0 right-0 z-[80] bg-[#0b0b0b]/90 backdrop-blur-md border-b border-white/[0.08]'
        } pointer-events-auto`}
      >
        <nav
          aria-label="Primary Navigation"
          className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-[30px] flex items-center justify-between h-14 sm:h-16"
        >
          {/* Left: Triple Chevron Logo + Brand + Tagline (1:1 Mattis Header) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <svg
                width="52"
                height="25"
                viewBox="0 0 52 25"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M0 12.4011L17.3333 0V12.4011L0 24.8022V12.4011Z"
                  fill="white"
                />
                <path
                  d="M17.3334 12.4011L34.6667 0V12.4011L17.3334 24.8022V12.4011Z"
                  fill="white"
                />
                <path
                  d="M34.6667 12.4011L52 0V12.4011L34.6667 24.8022V12.4011Z"
                  fill="white"
                />
              </svg>

              <span className="text-white font-semibold tracking-tight text-sm sm:text-base whitespace-nowrap">
                Ladha®{' '}
              </span>
            </a>

            {/* Divider + Tagline */}
            <div className="hidden lg:flex items-center">
              <div className="w-px h-5 bg-white/[0.18] mr-4" />
              <span className="text-white/60 text-[13px] tracking-tight font-normal whitespace-nowrap">
                Curated{' '}
                <span className="text-white">1-of-1 streetwear</span> archive
              </span>
            </div>
          </div>

          {/* Right: Nav Links + Sound Toggle + Bag CTA */}
          <div className="flex items-center gap-5 sm:gap-7">
            <div className="hidden md:flex items-center gap-1 text-[13px] font-normal tracking-tight text-white/70">
              {navLinks.map((item, idx) => (
                <React.Fragment key={item.name}>
                  {idx > 0 && (
                    <span className="text-white/20 mx-2 select-none">/</span>
                  )}
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`hover:text-white transition-colors duration-200 relative group py-1 uppercase ${
                      item.active ? 'text-[#ff4500]' : ''
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#ff4500] transition-all duration-300 group-hover:w-full" />
                  </a>
                </React.Fragment>
              ))}
            </div>

            {/* Subtle Ambient Audio Switcher */}
            <div className="hidden sm:flex items-center border border-white/15 bg-white/[0.04] backdrop-blur-sm">
              <button
                type="button"
                onClick={onToggleAudio}
                aria-label={audioPlaying ? 'Mute ambient audio' : 'Play ambient audio'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/75 hover:text-white transition-colors"
              >
                {audioPlaying ? <Volume2 size={12} className="text-[#c7ff97]" /> : <VolumeX size={12} />}
                <span>{audioPlaying ? `ON [${currentTrack.id}]` : 'SOUND'}</span>
              </button>
              {audioPlaying && (
                <button
                  type="button"
                  onClick={onNextTrack}
                  title="Skip Track"
                  className="px-2 py-1.5 border-l border-white/15 font-mono text-[10px] text-white/60 hover:text-[#ff4500] transition-colors"
                >
                  NEXT
                </button>
              )}
            </div>

            {/* Orange Bag Button — matches Mattis START A PROJECT CTA */}
            <RollingTextButton
              variant="orange"
              onClick={openDrawer}
              className="hidden sm:inline-flex h-[34px] px-4 text-[12px] font-semibold tracking-wider uppercase"
            >
              {`BAG (${count})`}
            </RollingTextButton>

            {/* Mobile Bag + Burger */}
            <div className="flex md:hidden items-center gap-2.5">
              <button
                type="button"
                onClick={openDrawer}
                className="px-3 py-1.5 bg-[#ff4500] text-white font-mono text-[11px] font-semibold uppercase tracking-wider"
              >
                BAG ({count})
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full bg-[#141414]/90 border border-white/10 text-white hover:text-[#ff4500] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="md:hidden fixed inset-0 z-[90] bg-[#0b0b0b] p-6 pt-24 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="font-sans text-3xl font-semibold tracking-tight uppercase text-white hover:text-[#ff4500] transition-colors border-b border-white/10 pb-4"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-white/50">
                  AMBIENT RUNWAY AUDIO
                </span>
                <button
                  type="button"
                  onClick={onToggleAudio}
                  className="px-3 py-1.5 border border-white/20 font-mono text-xs uppercase text-white"
                >
                  {audioPlaying ? `MUTE (${currentTrack.id})` : 'ENABLE SOUND'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDrawer();
                }}
                className="w-full py-3.5 bg-[#ff4500] text-white font-mono text-xs font-semibold uppercase tracking-widest"
              >
                OPEN BAG ({count})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
