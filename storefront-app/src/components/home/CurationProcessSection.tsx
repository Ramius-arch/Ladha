import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { CURATION_STEPS } from '../../data/siteContent';

export const CurationProcessSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(['01']));

  const toggleStep = (num: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  return (
    <section
      id="curation"
      className="relative w-full bg-[#0b0b0b] text-white overflow-hidden select-none z-[8]"
    >
      {/* Top Stepped Cut (#e9e9e9 left / #0b0b0b right — exact Mattis ProcessServices geometry) */}
      <div className="w-full h-[30px] flex flex-row">
        <div className="w-1/2 h-full bg-[#e9e9e9]" />
        <div className="w-1/2 h-full bg-[#0b0b0b]" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] pt-10 pb-16 sm:pb-24">
        <div className="flex flex-col md:flex-row items-start w-full pb-12 border-b border-white/10">
          <div className="w-full md:w-1/2 md:pr-8 mb-4 md:mb-0">
            <span className="font-mono text-xs uppercase tracking-widest text-white/55">
              CURATION PROTOCOL // 04 STAGES
            </span>
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-medium leading-[1.12] tracking-[-0.02em] text-white max-w-[560px]">
              Every garment enters our Kilimani vault unwashed and unsorted — and leaves only after surgical grading, steam ozone, and flat-lay measurement verification.
            </h2>
          </div>
        </div>

        {/* 4 Numbered Protocol Accordion Rows */}
        <div className="divide-y divide-white/10">
          {CURATION_STEPS.map((step) => {
            const isOpen = openIds.has(step.num);
            return (
              <div key={step.num} className="w-full group/step">
                <button
                  type="button"
                  onClick={() => toggleStep(step.num)}
                  className="w-full py-6 sm:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left group"
                >
                  <div className="w-full md:w-1/2 flex items-baseline gap-5">
                    <span className="font-mono text-[11px] text-white/45">{step.num}</span>
                    <span className="font-sans text-lg sm:text-xl font-medium tracking-tight text-white group-hover:text-[#ff4500] transition-colors">
                      {step.title}
                    </span>
                  </div>

                  <div className="w-full md:w-1/2 md:pl-8 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-white/55">
                      {step.spec}
                    </span>
                    <span className="w-8 h-8 border border-white/15 flex items-center justify-center text-white group-hover:border-[#ff4500] group-hover:text-[#ff4500] transition-colors">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pl-[calc(50%+2rem)] grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        <p className="sm:col-span-7 text-sm text-white/75 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="sm:col-span-5 relative aspect-[1.5] overflow-hidden border border-white/15">
                          <img
                            src={step.image}
                            alt={step.title}
                            loading="lazy"
                            className="w-full h-full object-cover grayscale contrast-[1.08] group-hover/step:grayscale-0 group-hover/step:contrast-100 hover:grayscale-0 hover:contrast-100 hover:scale-105 transition-all duration-500 ease-out"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Stepped Cut (#0b0b0b left / #ff4500 right — steps into ProofNumbersSection) */}
      <div className="w-full h-[30px] flex flex-row">
        <div className="w-1/2 h-full bg-[#0b0b0b]" />
        <div className="w-1/2 h-full bg-[#ff4500]" />
      </div>
    </section>
  );
};
