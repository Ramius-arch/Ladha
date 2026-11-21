import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { RollingTextButton } from './ui/RollingTextButton';
import { STORE_CONFIG } from '../config/storeConfig';

export const CartDrawer: React.FC = () => {
  const { items, count, subtotal, isDrawerOpen, closeDrawer, removeFromCart } = useCart();
  const { navigate } = useRouter();

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const whatsappText = (() => {
    if (items.length === 0) return '';
    let msg = '*LADHA — DIRECT BAG CLAIM*\n\n';
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.size}) — KES ${item.price.toLocaleString()}\n`;
    });
    msg += `\n*Subtotal: KES ${subtotal.toLocaleString()}*\nConfirm availability & courier dispatch!`;
    return STORE_CONFIG.whatsappUrl(msg);
  })();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            data-lenis-prevent
            className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-[440px] bg-[#0b0b0b] text-white border-l border-white/15 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c7ff97]" />
                  <span>1-OF-1 VAULT RESERVATION</span>
                </div>
                <h2 className="font-sans text-xl font-semibold tracking-tight uppercase mt-1">
                  YOUR BAG ({count})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close bag drawer"
                className="p-2 border border-white/15 text-white/75 hover:text-white hover:border-[#ff4500] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-3">
                    VAULT BAG IS EMPTY
                  </span>
                  <p className="text-sm text-white/70 max-w-[260px] leading-relaxed mb-6">
                    Every piece on LADHA is singular (1-of-1). Explore current Nairobi curated drops before they sell out.
                  </p>
                  <RollingTextButton
                    variant="orange"
                    onClick={() => {
                      closeDrawer();
                      navigate('/shop');
                    }}
                  >
                    EXPLORE ALL DROPS
                  </RollingTextButton>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border border-white/10 bg-[#121212]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover shrink-0 bg-[#1a1a1a]"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                              {item.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="text-white/40 hover:text-[#ff4500] transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <h3 className="font-sans text-sm font-semibold tracking-tight text-white truncate mt-0.5">
                            {item.name}
                          </h3>
                          <span className="font-mono text-[10px] text-white/55 block mt-0.5">
                            SIZE: {item.size}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="font-mono text-xs font-semibold text-white">
                            KES {item.price.toLocaleString()}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#c7ff97]">
                            QTY: 1 ONLY
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/15 bg-[#121212] flex flex-col gap-3">
                <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-wider text-white/60">
                  <span>Subtotal (Excl. Courier)</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-5 bg-[#ff4500] hover:bg-[#e63e00] text-white font-mono text-xs font-semibold uppercase tracking-widest flex items-center justify-between transition-colors"
                >
                  <span>
                    {STORE_CONFIG.hasMpesaTill ? 'CHECKOUT WITH M-PESA STK' : 'PROCEED TO CHECKOUT'}
                  </span>
                  <ArrowRight size={15} />
                </button>

                <a
                  href={whatsappText}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 border border-white/20 hover:bg-white hover:text-[#0b0b0b] text-white font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>CLAIM ON WHATSAPP</span>
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
