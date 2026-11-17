import { DEFAULT_PRODUCTS, resolveAssetUrl } from '../data/siteContent';
import { DispatchLead, Product, StoreOrder } from '../types/store';

const KEYS = {
  PRODUCTS: 'ladha_products_v1',
  ORDERS: 'ladha_orders_v1',
  LEADS: 'ladha_dispatch_leads_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('ladha-db-updated', { detail: { key } }));
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}

function normalizeProduct(p: Product): Product {
  return {
    ...p,
    image: resolveAssetUrl(p.image),
    inStock: p.inStock !== false,
  };
}

export function getStoredProducts(): Product[] {
  const stored = readStorage<Product[] | null>(KEYS.PRODUCTS, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored.map(normalizeProduct);
  }
  const seeded = DEFAULT_PRODUCTS.map(normalizeProduct);
  writeStorage(KEYS.PRODUCTS, seeded);
  return seeded;
}

export async function fetchLiveCatalog(): Promise<Product[]> {
  if (typeof window !== 'undefined' && window.location.port === '3001') {
    try {
      const apiResp = await fetch('/api/products');
      if (apiResp.ok) {
        const payload = (await apiResp.json()) as { products?: Product[] };
        if (payload.products && payload.products.length > 0) {
          const normalized = payload.products.map(normalizeProduct);
          writeStorage(KEYS.PRODUCTS, normalized);
          return normalized;
        }
      }
    } catch {
      // Fallback to static JSON or localStorage
    }
  }

  try {
    const jsonResp = await fetch('/data/products.json');
    if (jsonResp.ok) {
      const payload = (await jsonResp.json()) as Product[];
      if (Array.isArray(payload) && payload.length > 0) {
        const stored = readStorage<Product[] | null>(KEYS.PRODUCTS, null);
        // Preserve admin stock mutations if already persisted locally
        if (!stored || stored.length === 0) {
          const normalized = payload.map(normalizeProduct);
          writeStorage(KEYS.PRODUCTS, normalized);
          return normalized;
        }
      }
    }
  } catch {
    // Fallback to bundled catalog
  }

  return getStoredProducts();
}

export function getStoredOrders(): StoreOrder[] {
  return readStorage<StoreOrder[]>(KEYS.ORDERS, []);
}

export function saveCatalogProducts(products: Product[]): Product[] {
  const normalized = products.map(normalizeProduct);
  writeStorage(KEYS.PRODUCTS, normalized);
  return normalized;
}

export function resetCatalogToDefault(): Product[] {
  const seeded = DEFAULT_PRODUCTS.map(normalizeProduct);
  writeStorage(KEYS.PRODUCTS, seeded);
  return seeded;
}

export function saveOrderLocally(order: StoreOrder): void {
  const orders = readStorage<StoreOrder[]>(KEYS.ORDERS, []);
  writeStorage(KEYS.ORDERS, [order, ...orders]);
}

export function markProductsSoldOut(productIds: string[]): Product[] {
  const products = getStoredProducts().map((p) =>
    productIds.includes(p.id) ? { ...p, inStock: false } : p
  );
  writeStorage(KEYS.PRODUCTS, products);

  if (typeof window !== 'undefined' && window.location.port === '3001') {
    for (const id of productIds) {
      fetch(`/api/products/${encodeURIComponent(id)}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: false, reason: 'Checked out on Storefront' }),
      }).catch(() => undefined);
    }
  }

  return products;
}

export function submitOrderRecord(order: StoreOrder): void {
  saveOrderLocally(order);
  if (typeof window !== 'undefined' && window.location.port === '3001') {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => undefined);
  }
}

export function saveDispatchLead(lead: Omit<DispatchLead, 'id' | 'createdAt'>): DispatchLead {
  const entry: DispatchLead = {
    id: `LEAD-${Date.now()}`,
    ...lead,
    createdAt: new Date().toISOString(),
  };
  const existing = readStorage<DispatchLead[]>(KEYS.LEADS, []);
  writeStorage(KEYS.LEADS, [entry, ...existing]);
  return entry;
}
