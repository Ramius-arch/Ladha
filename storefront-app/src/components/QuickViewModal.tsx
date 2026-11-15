import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Product } from '../types/store';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const { addToCart, isInCart } = useCart();
  const { navigate } = useRouter();

  const measurements = (() => {
    if (!product) return {};
    if (unit === 'cm' && product.measurementsCm) return product.measurementsCm;
    if (unit === 'in' && product.measurementsIn) return product.measurementsIn;
    return product.measurements || {};
  })();

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            data-lenis-prevent
            className="relative z-10 w-full max-w-[920px] max-h-[90vh] overflow-y-auto bg-[#e9e9e9] text-[#0b0b0b] border border-white/20 grid grid-cols-1 md:grid-cols-12"
          >
            {/* Left Image Column */}
            <div className="md:col-span-6 bg-[#0b0b0b] relative aspect-[4/5] md:aspect-auto md:min-h-[480px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#0b0b0b]/85 border border-white/15 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    product.inStock !== false ? 'bg-[#c7ff97]' : 'bg-white/40'
                  }`}
                />
                <span>{product.inStock !== false ? '1-OF-1 IN VAULT' : 'ARCHIVED'}</span>
              </div>
            </div>

            {/* Right Spec Column */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-start justify-between gap-4 border-b border-[#0b0b0b]/15 pb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#0b0b0b]/55 block">
                      {product.category} // {product.id.toUpperCase()}
                    </span>
                    <h2 className="font-sans text-2xl font-semibold tracking-tight leading-tight mt-1">
                      {product.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close quick view"
                    className="p-2 border border-[#0b0b0b]/20 hover:bg-[#0b0b0b] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-bold tracking-tight tabular-nums">
                    KES {product.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-[11px] uppercase px-2 py-0.5 bg-[#0b0b0b] text-white">
                    {product.condition}
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#0b0b0b]/75 leading-relaxed">
                  {product.description}
                </p>

                {/* Measurements Table with IN / CM Toggle */}
                <div className="mt-6 border-t border-[#0b0b0b]/15 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#0b0b0b]/60">
                      FLAT-LAY TELEMETRY
                    </span>
                    <div className="flex border border-[#0b0b0b]/20">
                      {(['in', 'cm'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setUnit(mode)}
                          className={`px-2.5 py-1 font-mono text-[10px] uppercase transition-colors ${
                            unit === mode
                              ? 'bg-[#0b0b0b] text-white'
                              : 'bg-transparent text-[#0b0b0b]/60 hover:text-[#0b0b0b]'
                          }`}
                        >
                          {mode.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-[#0b0b0b]/10 border-y border-[#0b0b0b]/10">
                    {Object.entries(measurements)
                      .filter((entry): entry is [string, string] => Boolean(entry[1]))
                      .map(([key, value]) => (
                        <div key={key} className="py-2 flex items-center justify-between font-mono text-xs">
                          <span className="text-[#0b0b0b]/60 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-semibold text-[#0b0b0b]">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={product.inStock === false}
                  onClick={() => {
                    const res = addToCart(product);
                    if (res === 'added' || res === 'exists') onClose();
                  }}
                  className="w-full py-3.5 px-5 bg-[#ff4500] hover:bg-[#e63e00] disabled:bg-neutral-500 text-white font-mono text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag size={14} />
                  <span>
                    {product.inStock === false
                      ? 'SOLD OUT — ARCHIVED'
                      : isInCart(product.id)
                      ? 'ALREADY IN BAG'
                      : 'SECURE 1-OF-1 PIECE'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/product?id=${encodeURIComponent(product.id)}`);
                  }}
                  className="w-full py-3 px-4 border border-[#0b0b0b]/25 hover:bg-[#0b0b0b] hover:text-white font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>VIEW FULL ARCHIVE FILE</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
