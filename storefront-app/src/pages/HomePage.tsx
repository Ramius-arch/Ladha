import React from 'react';
import { Product } from '../types/store';
import { Hero } from '../components/home/Hero';
import { SelectionProtocolSection } from '../components/home/SelectionProtocolSection';
import { DropsCatalogSection } from '../components/home/DropsCatalogSection';
import { LookbookShowcase } from '../components/home/LookbookShowcase';
import { ReputationProofSection } from '../components/home/ReputationProofSection';
import { CurationProcessSection } from '../components/home/CurationProcessSection';
import { ProofNumbersSection } from '../components/home/ProofNumbersSection';
import { FaqSection } from '../components/home/FaqSection';

interface HomePageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

/**
 * Main Content Sections — 1:1 Mattis Sibling Sticky Curtain Architecture:
 * - Clean full-width straight horizontal cuts (border-radius: 0px)
 * - Ascending z-index layers so incoming sections wipe cleanly over previous ones
 * - ReputationProofSection uses md:-mt-[100vh] to curtain-wipe over the pinned LookbookShowcase
 */
export const HomePage: React.FC<HomePageProps> = ({ products, onQuickView }) => {
  return (
    <main className="w-full flex flex-col">
      {/* 1. Hero: 740px Framed Frosted Aperture with Crosshair lines, Corner Dots & B&W Video Loop */}
      <Hero featuredProducts={products} />

      {/* 2. Selection Protocol (Strategy): #ff4500 Electric Orange Canvas */}
      <div className="relative z-[2] w-full">
        <SelectionProtocolSection />
      </div>

      {/* 3. Showreel + Curated Vault Drops: #e9e9e9 Light Gray Canvas */}
      <div className="relative z-[3] w-full">
        <DropsCatalogSection products={products} onQuickView={onQuickView} />
      </div>

      {/* 4. Lookbook Bento: #0b0b0b Deep Black Pinned Curtain Canvas */}
      <div className="relative z-[4] w-full">
        <LookbookShowcase />
      </div>

      {/* 5. Built On Reputation: Clean transition after pinned Lookbook completes */}
      <div className="relative z-[5] w-full">
        <ReputationProofSection />
      </div>

      {/* 6. Process & Capabilities: #e9e9e9 Light Gray Canvas with 5 Expandables */}
      <div className="relative z-[6] w-full">
        <CurationProcessSection />
      </div>

      {/* 7. Numbers Proof ("HOW WE DO IT"): #ff4500 Electric Orange with Stepped Bottom Accent */}
      <div className="relative z-[7] w-full">
        <ProofNumbersSection />
      </div>

      {/* 8. FAQ ("BEFORE WE DISPATCH."): #e9e9e9 Light Gray Canvas */}
      <div className="relative z-[8] w-full">
        <FaqSection />
      </div>
    </main>
  );
};
