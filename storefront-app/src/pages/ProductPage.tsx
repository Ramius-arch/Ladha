import React, { useMemo, useState } from 'react';
import { ShoppingBag, MessageCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface ProductPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ products, onQuickView }) => {
  const { searchParams, navigate } = useRouter();
  const { addToCart, isInCart } = useCart();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo');

  const requestedId = searchParams.get('id') || 'bag-01';
  const product = useMemo(
    () => products.find((p) => p.id === requestedId) || products[0],
    [products, requestedId]
  );

  const related = useMemo(
    () => products.filter((p) => p.id !== product?.id).slice(0, 3),
    [products, product]
  );

  if (!product) return null;

  const measurements = (() => {
    if (unit === 'cm' && product.measurementsCm) return product.measurementsCm;
    if (unit === 'in' && product.measurementsIn) return product.measurementsIn;
    return product.measurements || {};
  })();

  const available = product.inStock !== false;
  const inBag = isInCart(product.id);

  const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
    `Hello LADHA, I want to instantly buy this 1-of-1 piece:\n\n*${product.name}*\nPrice: KES ${product.price.toLocaleString()}\nSize: ${product.size}\nItem Code: ${product.id.toUpperCase()}\n\nPlease confirm availability and courier dispatch!`
  )}`;

  return (
    <div className="min-h-screen bg-[#e9e9e9] text-[#0b0b0b]">
      {/* Top Breadcrumb Bar on Obsidian */}
      <div className="bg-[#0b0b0b] text-white pt-[92px] pb-6 px-5 sm:px-6 lg:px-[30px] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-white/55">
          <div className="flex items-center gap-2">
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
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop');
              }}
              className="hover:text-white transition-colors"
            >
              ALL DROPS
            </a>
            <span>/</span>
            <span className="text-[#ff4500]">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            <span>BACK TO CATALOG</span>
          </button>
        </div>
      </div>

      {/* Main Split Specimen Container */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-[30px] py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Specimen Photo & Motion Reel Frame */}
          <div className="lg:col-span-6 lg:sticky lg:top-[90px]">
            <div className="relative bg-[#0b0b0b] border border-[#0b0b0b]/15 aspect-[4/5] overflow-hidden">
              {product.videoPreview && mediaMode === 'video' ? (
                <video
                  src={product.videoPreview}
                  poster={product.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#0b0b0b]/90 border border-white/15 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white">
                <span
                  className={`w-2 h-2 rounded-full ${
                    available ? 'bg-[#c7ff97]' : 'bg-white/40'
                  }`}
                />
                <span>{available ? '1-OF-1 AVAILABLE' : 'SOLD OUT / ARCHIVED'}</span>
              </div>
              {product.videoPreview && (
                <div className="absolute bottom-4 left-4 flex border border-white/25 bg-[#0b0b0b]/90 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setMediaMode('photo')}
                    className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      mediaMode === 'photo' ? 'bg-white text-black font-bold' : 'text-white/75 hover:text-white'
                    }`}
                  >
                    Still Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('video')}
                    className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      mediaMode === 'video' ? 'bg-[#ff4500] text-white font-bold' : 'text-white/75 hover:text-white'
                    }`}
                  >
                    Motion Reel
                  </button>
                </div>
              )}
              <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-[#0b0b0b]/90 border border-white/15 font-mono text-[10px] uppercase tracking-widest text-white/80">
                REF // {product.id.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right Archival Telemetry & Acquisition Column */}
          <div className="lg:col-span-6 bg-white border border-[#0b0b0b]/15 p-6 sm:p-8 lg:p-10 flex flex-col gap-7">
            <div className="border-b border-[#0b0b0b]/15 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff4500]">
                  {product.category} • {product.size}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#0b0b0b] text-white">
                  {product.condition}
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] leading-[0.95] uppercase mt-2">
                {product.name}
              </h1>

              <div className="mt-5 flex items-baseline justify-between">
                <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
                  KES {product.price.toLocaleString()}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#0b0b0b]/55">
                  INCL. 16% VAT / eTIMS READY
                </span>
              </div>
            </div>

            {/* Condition & Narrative */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#0b0b0b]/55 block mb-1.5">
                CONDITION ASSESSMENT & NOTES
              </span>
              <p className="text-sm font-semibold text-[#0b0b0b] leading-relaxed mb-3">
                {product.conditionNote}
              </p>
              <p className="text-sm text-[#0b0b0b]/75 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Flat Measurements Table with IN / CM Unit Switcher */}
            <div className="border-t border-[#0b0b0b]/15 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
                  DIMENSIONS &amp; CAPACITY
                </h2>
                <div className="flex border border-[#0b0b0b]/25">
                  {(['in', 'cm'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setUnit(mode)}
                      className={`px-3 py-1 font-mono text-[11px] uppercase transition-colors ${
                        unit === mode
                          ? 'bg-[#0b0b0b] text-white'
                          : 'bg-white text-[#0b0b0b]/60 hover:text-[#0b0b0b]'
                      }`}
                    >
                      {mode.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <table className="w-full border-y border-[#0b0b0b]/15">
                <tbody className="divide-y divide-[#0b0b0b]/10">
                  {Object.entries(measurements)
                    .filter((entry): entry is [string, string] => Boolean(entry[1]))
                    .map(([k, v]) => (
                      <tr key={k} className="font-mono text-xs">
                        <td className="py-2.5 text-[#0b0b0b]/60 uppercase">
                          {k.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td className="py-2.5 text-right font-bold">{v}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className="font-mono text-[10px] text-[#0b0b0b]/50 mt-2.5">
                * Approximate hand-measured dimensions (in / cm) verified in Nairobi before claiming.
              </p>
            </div>

            {/* Material & Provenance */}
            <div className="border-t border-[#0b0b0b]/15 pt-6">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest mb-3">
                MATERIAL & PROVENANCE
              </h2>
              <table className="w-full border-y border-[#0b0b0b]/15">
                <tbody className="divide-y divide-[#0b0b0b]/10 font-mono text-xs">
                  <tr>
                    <td className="py-2.5 text-[#0b0b0b]/60 uppercase">FABRIC</td>
                    <td className="py-2.5 text-right font-semibold">{product.fabric}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-[#0b0b0b]/60 uppercase">PROVENANCE</td>
                    <td className="py-2.5 text-right font-semibold">{product.provenance}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-[#0b0b0b]/60 uppercase">TAGGED SIZE</td>
                    <td className="py-2.5 text-right font-semibold">{product.size}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                disabled={!available}
                onClick={() => addToCart(product)}
                className={`w-full py-4 px-6 font-mono text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                  !available
                    ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                    : inBag
                    ? 'bg-[#0b0b0b] text-[#c7ff97]'
                    : 'bg-[#ff4500] hover:bg-[#e63e00] text-white'
                }`}
              >
                <ShoppingBag size={15} />
                <span>
                  {!available
                    ? 'SOLD OUT — PERMANENTLY ARCHIVED'
                    : inBag
                    ? 'SECURED IN YOUR BAG →'
                    : 'ADD 1-OF-1 TO BAG →'}
                </span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 border border-[#0b0b0b]/25 hover:bg-[#0b0b0b] hover:text-white font-mono text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={14} />
                <span>INSTANT BUY ON WHATSAPP</span>
              </a>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-[#0b0b0b]/15 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[10px] uppercase tracking-wider text-[#0b0b0b]/65">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#ff4500] shrink-0" />
                <span>100% Authentic Vintage Curation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#ff4500] shrink-0" />
                <span>130°C Ozone Steam Sanitized</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#ff4500] shrink-0" />
                <span>Same-Day Nairobi Rider Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#ff4500] shrink-0" />
                <span>24H Defect Credit Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pieces */}
        {related.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#0b0b0b]/15">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff4500] block mb-1">
                  CURATED PAIRINGS
                </span>
                <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-[-0.04em] uppercase">
                  MORE FROM THIS DROP.
                </h2>
              </div>
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                }}
                className="font-mono text-xs uppercase tracking-widest hover:text-[#ff4500] transition-colors"
              >
                VIEW ALL DROPS →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onQuickView={onQuickView}
                  theme="light"
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
