import React from 'react';
import { Eye, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../context/RouterContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  theme?: 'light' | 'dark';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  theme = 'light',
}) => {
  const { addToCart, isInCart } = useCart();
  const { navigate } = useRouter();
  const inBag = isInCart(product.id);
  const available = product.inStock !== false;

  const isLight = theme === 'light';
  const cardBg = isLight
    ? 'bg-white text-[#0b0b0b] border-[#0b0b0b]/[0.12]'
    : 'bg-[#121212] text-white border-white/10';
  const mutedText = isLight ? 'text-[#0b0b0b]/55' : 'text-white/55';
  const hairlineBorder = isLight ? 'border-[#0b0b0b]/[0.1]' : 'border-white/10';

  const handleOpenProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product?id=${encodeURIComponent(product.id)}`);
  };

  return (
    <article
      className={`group relative flex flex-col border rounded-none transition-colors duration-300 ${cardBg} hover:border-[#ff4500]`}
    >
      {/* 4:5 Sharp Archival Media Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]">
        <a
          href={`/product?id=${encodeURIComponent(product.id)}`}
          onClick={handleOpenProduct}
          className="block w-full h-full"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </a>

        {/* Top Corner 1-of-1 Hangtag */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-[#0b0b0b]/85 backdrop-blur-sm border border-white/15">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              available ? 'bg-[#c7ff97]' : 'bg-white/40'
            }`}
          />
          <span className="font-mono text-[10px] tracking-widest uppercase text-white">
            {available ? '1-OF-1' : 'ARCHIVED'}
          </span>
        </div>

        {/* Grade Pill Top Right */}
        <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-[#0b0b0b]/80 backdrop-blur-sm border border-white/10 font-mono text-[10px] uppercase tracking-wider text-white/80">
          {product.id.toUpperCase()}
        </div>

        {/* Bottom-Pinned Hover Action Bar (Always accessible on touch, sharp on desktop hover) */}
        <div className="
          absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 border-t border-white/15
          bg-[#0b0b0b]/95 backdrop-blur-md
          lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300 ease-out
        ">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="flex items-center justify-center gap-1.5 py-3 text-[11px] font-mono uppercase tracking-wider text-white hover:bg-white hover:text-[#0b0b0b] transition-colors border-r border-white/15"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>
          <button
            type="button"
            disabled={!available}
            onClick={() => addToCart(product)}
            className={`flex items-center justify-center gap-1.5 py-3 text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors ${
              !available
                ? 'bg-neutral-800 text-white/40 cursor-not-allowed'
                : inBag
                ? 'bg-white text-[#0b0b0b]'
                : 'bg-[#ff4500] text-white hover:bg-[#e63e00]'
            }`}
          >
            <ShoppingBag size={13} />
            <span>{!available ? 'Sold Out' : inBag ? 'In Bag' : '+ Bag'}</span>
          </button>
        </div>
      </div>

      {/* Metadata & Specs Block */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
              {product.category} • {product.size.split('(')[0].trim()}
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-wider ${mutedText}`}>
              {product.condition.split('(')[0].trim()}
            </span>
          </div>

          <h3 className="font-sans text-base sm:text-lg font-semibold tracking-tight leading-snug">
            <a
              href={`/product?id=${encodeURIComponent(product.id)}`}
              onClick={handleOpenProduct}
              className="hover:text-[#ff4500] transition-colors"
            >
              {product.name}
            </a>
          </h3>
        </div>

        <div className={`pt-3 border-t ${hairlineBorder} flex items-baseline justify-between gap-2`}>
          <span className="font-mono text-sm sm:text-base font-semibold tracking-tight tabular-nums">
            KES {product.price.toLocaleString()}
          </span>
          <a
            href={`/product?id=${encodeURIComponent(product.id)}`}
            onClick={handleOpenProduct}
            className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest hover:text-[#ff4500] transition-colors ${mutedText}`}
          >
            <span>Specs</span>
            <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </article>
  );
};
