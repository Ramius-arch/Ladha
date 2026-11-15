import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { resolveAssetUrl } from '../data/siteContent';
import { CartItem, Product } from '../types/store';

const CART_STORAGE_KEY = 'ladha_cart_v1';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isDrawerOpen: boolean;
  toastMessage: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product) => 'added' | 'exists' | 'sold_out';
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadPersistedCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      image: resolveAssetUrl(item.image),
      quantity: 1,
    }));
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadPersistedCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const addToCart = useCallback(
    (product: Product): 'added' | 'exists' | 'sold_out' => {
      if (product.inStock === false) {
        showToast('PIECE SOLD OUT — 1-OF-1 ARCHIVED');
        return 'sold_out';
      }

      if (items.some((item) => item.id === product.id)) {
        showToast('ALREADY IN BAG — 1-OF-1 PIECE');
        setIsDrawerOpen(true);
        return 'exists';
      }

      const nextItem: CartItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: resolveAssetUrl(product.image),
        size: product.size,
        quantity: 1,
      };

      setItems((prev) => [...prev, nextItem]);
      showToast(`SECURED: ${product.name.toUpperCase()}`);
      setIsDrawerOpen(true);
      return 'added';
    },
    [items, showToast]
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count: items.length,
        subtotal,
        isDrawerOpen,
        toastMessage,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
