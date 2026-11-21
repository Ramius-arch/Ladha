import React, { useEffect, useMemo, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from '../components/ui/ProductCard';
import { useRouter } from '../context/RouterContext';

interface ShopPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const CATEGORIES = ['ALL', 'SPORT & COMMUTE', 'STREETWEAR', 'GRAPHIC & RETRO', 'KIDS & SCHOOL'];

export const ShopPage: React.FC<ShopPageProps> = ({ products, onQuickView }) => {
  const { searchParams, navigate } = useRouter();

  const initialCat = (() => {
    const param = (searchParams.get('category') || 'ALL').toUpperCase();
    return CATEGORIES.includes(param) ? param : 'ALL';
  })();

  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  useEffect(() => {
    const param = (searchParams.get('category') || '').toUpperCase();
    if (!param) return;
    if (CATEGORIES.includes(param)) setActiveCategory(param);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const catMatch =
        activeCategory === 'ALL' || item.category.toUpperCase() === activeCategory.toUpperCase();
      const stockMatch = !onlyInStock || item.inStock !== false;
      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.size.toLowerCase().includes(q);
      return catMatch && stockMatch && searchMatch;
    });

    if (sortMode === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortMode === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, activeCategory, searchQuery, sortMode, onlyInStock]);

  const resetAll = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setSortMode('featured');
    setOnlyInStock(false);
  };

  return (
    <div className="min-h-screen bg-[#e9e9e9] text-[#0b0b0b]">
      {/* Top Dark Header Canvas */}
      <section className="relative bg-[#0b0b0b] text-white pt-[110px] pb-14 px-5 sm:px-6 lg:px-[30px] border-b border-white/10">
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
            <span className="text-[#ff4500]">DROPS ARCHIVE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff4500] block mb-3">
                VAULT DIRECTORY // 1-OF-1 ONLY
              </span>
              <h1 className="font-sans text-[52px] sm:text-[76px] lg:text-[92px] font-semibold tracking-[-0.05em] leading-[0.82em] uppercase">
                ALL DROPS.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="font-mono text-xs uppercase tracking-wider text-white/65 leading-relaxed">
                SOURCED IN NAIROBI • SANITIZED AT 130°C • ZERO RESTOCKS ONCE CLAIMED
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Controls & Filter Bar */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] py-10">
        <div className="bg-white border border-[#0b0b0b]/15 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#0b0b0b] text-white border-[#0b0b0b]'
                    : 'bg-transparent text-[#0b0b0b]/70 border-[#0b0b0b]/15 hover:border-[#ff4500] hover:text-[#ff4500]'
                }`}
              >
                {cat === 'ALL' ? 'ALL PIECES' : cat}
              </button>
            ))}
          </div>

          {/* Search, Stock Toggle, Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[210px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0b0b0b]/45 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH ARCHIVE..."
                aria-label="Search archive pieces"
                className="w-full pl-9 pr-3 py-2 bg-[#f4f4f4] border border-[#0b0b0b]/15 font-mono text-xs uppercase text-[#0b0b0b] placeholder:text-[#0b0b0b]/40 outline-none focus:border-[#ff4500]"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyInStock((prev) => !prev)}
              className={`px-3 py-2 border font-mono text-[11px] uppercase tracking-wider transition-colors ${
                onlyInStock
                  ? 'bg-[#0b0b0b] text-[#c7ff97] border-[#0b0b0b]'
                  : 'bg-[#f4f4f4] text-[#0b0b0b]/70 border-[#0b0b0b]/15 hover:border-[#0b0b0b]'
              }`}
            >
              {onlyInStock ? '✓ IN STOCK ONLY' : 'SHOW AVAILABLE ONLY'}
            </button>

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
              aria-label="Sort pieces"
              className="px-3 py-2 bg-[#f4f4f4] border border-[#0b0b0b]/15 font-mono text-[11px] uppercase text-[#0b0b0b] outline-none focus:border-[#ff4500] cursor-pointer"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        {/* Meta Count Strip */}
        <div className="mt-6 mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[#0b0b0b]/60 border-b border-[#0b0b0b]/15 pb-3">
          <span>
            SHOWING {filteredProducts.length} OF {products.length} PIECES
          </span>
          <span>1-OF-1 CURATION • KENYA SHILLINGS (KES)</span>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                theme="light"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#0b0b0b]/15 py-20 px-6 text-center">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff4500]">
              NO MATCHING PIECES FOUND
            </span>
            <h2 className="font-sans text-2xl font-semibold tracking-tight uppercase mt-2">
              TRY ANOTHER ARCHIVE FILTER OR SEARCH TERM
            </h2>
            <button
              type="button"
              onClick={resetAll}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-[#0b0b0b] hover:bg-[#ff4500] text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <RotateCcw size={13} />
              <span>RESET ALL FILTERS</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
