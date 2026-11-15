import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from '../../data/siteContent';

/**
 * FaqSection — 100% structural parity with Mattis FAQSection.tsx:
 * - Canvas: #e9e9e9 Light Gray with 4% multiply noise grain
 * - Top 30px Stepped Accent on right 50%
 * - Left 50%: "FAQ" label + Right-Aligned 92px display headline "BEFORE YOU CLAIM."
 * - Right 50%: Collapsible index (01..05) accordion rows + 30px sharp black rolling-text button
 */
export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-[#e9e9e9] text-[#0b0b0b] pt-[30px] px-5 sm:px-6 md:px-[30px] pb-[80px] overflow-hidden select-none scroll-mt-[64px]"
    >
      {/* 4% Noise Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply z-0"
        style={{
          backgroundImage: `url("https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png")`,
          backgroundSize: '128px 128px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Top 30px Stepped Accent: Right 50% steps up into Numbers section */}
      <div className="absolute -top-[30px] left-1/2 w-1/2 h-[30px] bg-[#e9e9e9] pointer-events-none z-20" />

      {/* Center 1px Hairline Divider — 8% opacity black */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-[#0b0b0b]/[0.08] pointer-events-none z-10" />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col">
        {/* Bilateral 2-Column Grid (50% / 50% split) */}
        <div className="w-full flex flex-col md:flex-row items-start gap-12 md:gap-0">
          {/* LEFT COLUMN: "FAQ" Label & Right-Aligned Display Title */}
          <div className="w-full md:w-1/2 md:pr-10 lg:pr-16 flex flex-col items-start md:items-end gap-[14px]">
            <p className="text-[12px] font-medium leading-[14.4px] tracking-[-0.01em] uppercase text-[#0b0b0b]/60 text-left md:text-right">
              FAQ
            </p>

            <h2 className="text-5xl sm:text-7xl lg:text-[92px] font-semibold leading-[0.82] lg:leading-[75.44px] tracking-[-0.05em] text-[#0b0b0b] uppercase text-left md:text-right select-none">
              BEFORE WE
              <br />
              DISPATCH.
            </h2>
          </div>

          {/* RIGHT COLUMN: Accordion Rows & Black Rectangular Button */}
          <div className="w-full md:w-1/2 md:pl-10 lg:pl-16 flex flex-col gap-10">
            <div className="w-full flex flex-col">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                const numStr = `0${idx + 1}`;
                return (
                  <div
                    key={faq.num}
                    className="relative w-full border-b border-[#0b0b0b]/[0.12] select-none cursor-pointer"
                    onClick={() => toggleFaq(idx)}
                  >
                    {/* Question Header */}
                    <div
                      className={`flex items-center justify-between gap-4 transition-all duration-200 ${
                        isOpen ? 'pt-5 pb-3.5' : 'py-5'
                      }`}
                    >
                      <div className="flex items-center">
                        {/* Index Number: animates out on expansion */}
                        <motion.span
                          animate={{
                            opacity: isOpen ? 0 : 1,
                            width: isOpen ? 0 : 'auto',
                            marginRight: isOpen ? 0 : 10,
                          }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden text-[11px] font-medium leading-[13.2px] tracking-[-0.01em] text-[#0b0b0b] shrink-0"
                        >
                          {numStr}
                        </motion.span>

                        {/* Question Text */}
                        <h3 className="text-[11px] font-medium leading-[13.2px] tracking-[-0.01em] uppercase text-[#0b0b0b]/60">
                          {faq.question}
                        </h3>
                      </div>

                      {/* Pure CSS Toggle Icon (+ / -) */}
                      <div className="w-4 h-4 relative flex items-center justify-center shrink-0">
                        <span className="w-3 h-[1.5px] bg-[#0b0b0b]/60 block" />
                        <motion.span
                          animate={{
                            scaleY: isOpen ? 0 : 1,
                            opacity: isOpen ? 0 : 1,
                          }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="w-[1.5px] h-3 bg-[#0b0b0b]/60 absolute block"
                        />
                      </div>
                    </div>

                    {/* Expandable Answer Drawer */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            bounce: 0.05,
                            duration: 0.35,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pb-[30px] pt-1">
                            <p className="text-[20px] font-medium leading-[24px] tracking-[-0.2px] text-[#0b0b0b] font-sans">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* ASK A QUESTION Button: 30px Black Sharp Rectangle with Rolling Text */}
            <div>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center h-[30px] px-3.5 bg-[#0b0b0b] text-white text-[12px] font-semibold tracking-[-0.01em] uppercase overflow-hidden select-none hover:bg-black transition-colors"
              >
                <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-7">
                  Ask a question
                </span>
                <span className="absolute inline-block transition-transform duration-300 ease-out translate-y-7 group-hover:translate-y-0">
                  Ask a question
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
