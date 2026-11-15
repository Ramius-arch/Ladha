import React from 'react';
import { CURATION_STEPS, GRADING_MATRIX } from '../data/siteContent';
import { RollingTextButton } from '../components/ui/RollingTextButton';
import { useRouter } from '../context/RouterContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[#e9e9e9] text-[#0b0b0b]">
      {/* Top Hero Header */}
      <section className="bg-[#0b0b0b] text-white pt-[110px] pb-16 px-5 sm:px-6 lg:px-[30px] border-b border-white/10">
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
            <span className="text-[#ff4500]">THE ARCHIVE & 6% RULE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff4500] block mb-3">
                MANIFESTO // NAIROBI ARCHIVAL HOUSE
              </span>
              <h1 className="font-sans text-[52px] sm:text-[76px] lg:text-[92px] font-semibold tracking-[-0.05em] leading-[0.82em] uppercase">
                TASTE OVER
                <br />
                TREND.
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm text-white/75 leading-relaxed">
                LADHA is an archival streetwear and curated vintage floor founded in Nairobi. Instead of volume thrift dumps, we extract the rarest 6% of East Africa&apos;s incoming textile bales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange Banner: The 6% Rule */}
      <section className="bg-[#ff4500] text-white px-5 sm:px-6 lg:px-[30px] py-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/80 block mb-2">
              PROTOCOL // 01
            </span>
            <h2 className="font-sans text-5xl sm:text-6xl font-semibold tracking-[-0.05em] leading-[0.85em] uppercase">
              500 BALES.
              <br />
              ONLY 30 PIECES.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg leading-relaxed font-medium text-white/95">
              Fast fashion repeats endlessly. True 90s single-stitch cotton, deadstock selvedge looms, and heavyweight duck canvas are finite artifacts. Every single garment released in a LADHA drop is singular — once checked out, it disappears permanently from our floor.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Stage Pipeline */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] py-16">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff4500] block mb-2">
          OPERATIONS PIPELINE
        </span>
        <h2 className="font-sans text-4xl sm:text-5xl font-semibold tracking-[-0.04em] uppercase mb-10">
          FROM BALE TO VAULT.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CURATION_STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-[#0b0b0b]/15 p-6 sm:p-8 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#0b0b0b]/55 mb-3">
                  <span>STAGE {step.num}</span>
                  <span className="text-[#ff4500]">{step.spec}</span>
                </div>
                <h3 className="font-sans text-2xl font-semibold tracking-tight uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-[#0b0b0b]/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="aspect-[1.6] overflow-hidden border border-[#0b0b0b]/10 mt-2">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Condition Grading Matrix */}
      <section className="bg-[#0b0b0b] text-white px-5 sm:px-6 lg:px-[30px] py-16 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#c7ff97] block mb-2">
                HONEST ASSESSMENT STANDARD
              </span>
              <h2 className="font-sans text-4xl sm:text-5xl font-semibold tracking-[-0.04em] uppercase">
                CONDITION GRADING MATRIX.
              </h2>
            </div>
            <RollingTextButton
              variant="orange"
              onClick={() => navigate('/shop')}
              className="font-mono text-xs"
            >
              SHOP GRADED DROPS →
            </RollingTextButton>
          </div>

          <div className="border border-white/15 divide-y divide-white/15">
            {GRADING_MATRIX.map((row) => (
              <div
                key={row.grade}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center"
              >
                <div className="md:col-span-4 font-mono text-sm font-bold text-white">
                  {row.grade}
                </div>
                <div className="md:col-span-2 font-mono text-xs text-[#ff4500]">
                  {row.score}
                </div>
                <div className="md:col-span-6 text-sm text-white/75 leading-relaxed">
                  {row.characteristics}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
