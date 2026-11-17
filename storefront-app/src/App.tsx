import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from './hooks/useLenis';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { CartProvider, useCart } from './context/CartContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { FooterContact } from './components/FooterContact';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DEFAULT_PRODUCTS } from './data/siteContent';
import { fetchLiveCatalog, getStoredProducts } from './services/storeDb';
import { Product } from './types/store';

const PAGE_TITLES: Record<string, string> = {
  home: 'LADHA — Taste Over Trend. | Nairobi Vintage & Streetwear Archive',
  shop: 'All Drops — LADHA Nairobi Archive',
  product: 'Archive Specimen — LADHA',
  checkout: 'Claim & M-Pesa Checkout — LADHA',
  about: 'The 6% Curation Rule — LADHA',
  legal: 'Legal, KDPA & Disclosures — LADHA',
  admin: 'Store Command Center — LADHA',
  not_found: 'Archive Not Found — LADHA',
};

const StorefrontShell: React.FC = () => {
  useLenis();
  const { route } = useRouter();
  const { toastMessage } = useCart();
  const { isPlaying, currentTrack, togglePlay, nextTrack } = useAmbientAudio();

  const [products, setProducts] = useState<Product[]>(() => DEFAULT_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const reloadProducts = useCallback(async () => {
    const hydrated = await fetchLiveCatalog();
    setProducts(hydrated);
  }, []);

  useEffect(() => {
    reloadProducts();

    const handleStorageSync = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener('ladha-db-updated', handleStorageSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('ladha-db-updated', handleStorageSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, [reloadProducts]);

  useEffect(() => {
    if (route !== 'product') {
      document.title = PAGE_TITLES[route] || PAGE_TITLES.home;
    }
  }, [route]);

  return (
    <div className="min-h-screen w-full bg-[#0b0b0b] text-white flex flex-col">
      <Header
        audioPlaying={isPlaying}
        currentTrack={currentTrack}
        onToggleAudio={togglePlay}
        onNextTrack={nextTrack}
      />

      <main className="flex-1 w-full">
        {route === 'home' && <HomePage products={products} onQuickView={setQuickViewProduct} />}
        {route === 'shop' && <ShopPage products={products} onQuickView={setQuickViewProduct} />}
        {route === 'product' && (
          <ProductPage products={products} onQuickView={setQuickViewProduct} />
        )}
        {route === 'checkout' && <CheckoutPage onCatalogMutated={() => setProducts(getStoredProducts())} />}
        {route === 'about' && <AboutPage />}
        {route === 'legal' && <LegalPage />}
        {route === 'admin' && (
          <AdminPage products={products} onCatalogMutated={() => setProducts(getStoredProducts())} />
        )}
        {route === 'not_found' && <NotFoundPage />}
      </main>

      <FooterContact />

      <CartDrawer />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      {/* Crisp Editorial Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] px-5 py-3 bg-[#0b0b0b] text-white border border-[#ff4500] shadow-2xl font-mono text-xs uppercase tracking-widest flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#c7ff97]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <StorefrontShell />
      </CartProvider>
    </RouterProvider>
  );
}

export default App;
