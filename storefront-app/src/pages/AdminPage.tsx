import React, { useEffect, useMemo, useState } from 'react';
import {
  Lock,
  ShieldCheck,
  ExternalLink,
  Plus,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Package,
  Receipt,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { Product, StoreOrder } from '../types/store';
import {
  getStoredOrders,
  resetCatalogToDefault,
  saveCatalogProducts,
} from '../services/storeDb';
import { useRouter } from '../context/RouterContext';
import { STORE_CONFIG } from '../config/storeConfig';

interface AdminPageProps {
  products: Product[];
  onCatalogMutated: () => void;
}

const LEDGER_TOKEN_KEY = 'authToken';

export const AdminPage: React.FC<AdminPageProps> = ({ products, onCatalogMutated }) => {
  const { navigate } = useRouter();
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);

  const [passcode, setPasscode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'security'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPiece, setNewPiece] = useState({
    name: '',
    category: 'STREETWEAR' as Product['category'],
    price: 900,
    size: 'Standard Daypack (Approx. 20L)',
    condition: 'Grade A Thrift (9.0/10)',
    era: 'Curated Thrift',
    image: '/assets/products/bag-01.jpg',
    description: 'Single-piece curated thrift backpack sanitized and graded in Nairobi.',
  });

  // Verify existing server-issued HttpOnly session cookie on mount (zero client-side bypass possible)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const data = (await res.json().catch(() => ({}))) as {
          authenticated?: boolean;
          expiresAt?: number;
          configured?: boolean;
          error?: string;
        };
        if (!active) return;
        if (res.ok && data.authenticated) {
          setAuthorized(true);
          setSessionExpiresAt(data.expiresAt || null);
        } else {
          setAuthorized(false);
          if (res.status === 503 && data.error) {
            setAuthError(data.error);
          }
        }
      } catch {
        if (active) setAuthorized(false);
      } finally {
        if (active) setCheckingSession(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (authorized) {
      setOrders(getStoredOrders());
    }
  }, [authorized]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || verifying) return;

    setVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        authenticated?: boolean;
        expiresAt?: number;
        error?: string;
      };

      if (res.ok && data.authenticated) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: 'Executive Controller',
            email: STORE_CONFIG.email,
            role: 'controller',
            organization: `${STORE_CONFIG.brandName} Nairobi`,
          })
        );
        setSessionExpiresAt(data.expiresAt || null);
        setPasscode('');
        setAuthorized(true);
      } else {
        setAuthError(data.error || 'Invalid security key. Access denied.');
        setPasscode('');
      }
    } catch {
      setAuthError('Unable to reach /api/auth security service. Ensure the server is running.');
    } finally {
      setVerifying(false);
    }
  };

  const handleLockSession = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } catch {
      // Proceed with local cleanup even if network drops
    }
    try {
      sessionStorage.removeItem('ladha_admin_token');
      localStorage.removeItem(LEDGER_TOKEN_KEY);
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
    setSessionExpiresAt(null);
    setAuthorized(false);
  };

  const handleOpenLedger = () => {
    window.location.href = '/admin/ledger/dashboard';
  };

  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    saveCatalogProducts(updated);
    onCatalogMutated();
  };

  const handlePriceChange = (productId: string, newPrice: number) => {
    if (!Number.isFinite(newPrice) || newPrice < 100) return;
    const updated = products.map((p) =>
      p.id === productId ? { ...p, price: Math.round(newPrice) } : p
    );
    saveCatalogProducts(updated);
    onCatalogMutated();
  };

  const handleAddSpecimen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPiece.name.trim()) return;
    const created: Product = {
      id: `bag-${Date.now().toString().slice(-5)}`,
      name: newPiece.name.trim(),
      category: newPiece.category,
      price: Number(newPiece.price) || 8500,
      size: newPiece.size.trim() || 'L',
      measurements: { chest: '23"', length: '28"' },
      condition: newPiece.condition,
      conditionNote: 'Ozone sanitized & single-stitch inspected',
      fabric: '100% Heavyweight Archival Cotton',
      provenance: newPiece.era || 'Gikomba / Toi Bale Selection',
      image: newPiece.image,
      description: newPiece.description,
      inStock: true,
    };
    saveCatalogProducts([created, ...products]);
    onCatalogMutated();
    setShowAddModal(false);
    setNewPiece({
      ...newPiece,
      name: '',
    });
  };

  const handleResetCatalog = () => {
    resetCatalogToDefault();
    onCatalogMutated();
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.provenance.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const metrics = useMemo(() => {
    const inStockCount = products.filter((p) => p.inStock).length;
    const soldOutCount = products.length - inStockCount;
    const archiveValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const verifiedGmv = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { inStockCount, soldOutCount, archiveValue, verifiedGmv };
  }, [products, orders]);

  // FAIL-CLOSED GATE: Do not mount any Admin DOM until server HttpOnly session is verified
  if (checkingSession) {
    return (
      <section className="min-h-[85vh] w-full bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-24">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
          VERIFYING SERVER SESSION...
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="min-h-[85vh] w-full bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-[#111111] border border-white/15 p-8 sm:p-10 relative shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#c7ff97] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c7ff97] animate-pulse" />
            <span>RESTRICTED STORE COMMAND GATE</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Operator Authentication
          </h1>
          <p className="text-xs text-white/60 font-mono mb-6">
            SERVER-SIDE HTTPONLY SESSION · MAX 5 ATTEMPTS // 15-MIN LOCKOUT
          </p>

          <form onSubmit={handleUnlock} className="space-y-5">
            <div>
              <label
                htmlFor="admin-security-key"
                className="block font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 mb-2"
              >
                Enter Manager Security Passphrase
              </label>
              <input
                id="admin-security-key"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                autoFocus
                className="w-full bg-black border border-white/25 px-4 py-3 text-white font-mono text-base tracking-[0.2em] focus:outline-none focus:border-[#c7ff97]"
              />
            </div>

            {authError && (
              <div className="flex items-start gap-2 bg-[#ff4500]/15 border border-[#ff4500]/40 px-3.5 py-2.5 text-xs font-mono text-[#ff4500]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-[#c7ff97] text-[#0b0b0b] font-mono text-xs font-bold uppercase tracking-[0.16em] py-3.5 hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{verifying ? 'VERIFYING DIGEST...' : 'UNLOCK STORE COMMAND PORTAL →'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-[#0b0b0b] text-white pt-24 pb-20 px-4 sm:px-8 max-w-[1440px] mx-auto">
      {/* Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#c7ff97] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>LADHA COMMAND CENTER // AUTHENTICATED SESSION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Archive Drop & Dispatch Control
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleOpenLedger}
            className="bg-[#ff4500] text-white font-mono text-xs uppercase tracking-widest px-4 py-2.5 hover:bg-[#ff571a] transition-colors flex items-center gap-2"
          >
            <span>Open Ladha Ledger (Double-Entry)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#c7ff97] text-[#0b0b0b] font-mono text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-white transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add 1-of-1 Piece</span>
          </button>

          <button
            type="button"
            onClick={handleLockSession}
            className="border border-white/25 text-white/80 hover:text-white hover:border-white font-mono text-xs uppercase tracking-widest px-3.5 py-2.5 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Gate</span>
          </button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-[#121212] border border-white/10 p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block mb-1">
            Total Archive Valuation
          </span>
          <span className="font-mono text-2xl font-bold text-white">
            KES {metrics.archiveValue.toLocaleString()}
          </span>
        </div>
        <div className="bg-[#121212] border border-white/10 p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block mb-1">
            Available 1-of-1 Pieces
          </span>
          <span className="font-mono text-2xl font-bold text-[#c7ff97]">
            {metrics.inStockCount} / {products.length}
          </span>
        </div>
        <div className="bg-[#121212] border border-white/10 p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block mb-1">
            Claimed / Sold Out
          </span>
          <span className="font-mono text-2xl font-bold text-[#ff4500]">
            {metrics.soldOutCount}
          </span>
        </div>
        <div className="bg-[#121212] border border-white/10 p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 block mb-1">
            Local Order Registry GMV
          </span>
          <span className="font-mono text-2xl font-bold text-white">
            KES {metrics.verifiedGmv.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-transparent text-white/70 border-white/20 hover:border-white/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>1-of-1 Inventory ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-transparent text-white/70 border-white/20 hover:border-white/50'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Order Registry ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-transparent text-white/70 border-white/20 hover:border-white/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security &amp; Handover</span>
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, piece, category..."
                className="bg-[#121212] border border-white/20 pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#c7ff97]"
              />
            </div>
            <button
              type="button"
              onClick={handleResetCatalog}
              className="border border-white/20 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-white/70 hover:text-white hover:border-white flex items-center gap-1.5"
              title="Restore default archival catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed</span>
            </button>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      {activeTab === 'inventory' ? (
        <div className="overflow-x-auto border border-white/15 bg-[#111111]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/15 font-mono text-[10px] uppercase tracking-widest text-white/50">
                <th className="py-3.5 px-4">Specimen</th>
                <th className="py-3.5 px-4">Category / Era</th>
                <th className="py-3.5 px-4">Size / Grade</th>
                <th className="py-3.5 px-4">Price (KES)</th>
                <th className="py-3.5 px-4">1-of-1 Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover border border-white/15 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="font-mono text-[11px] text-white/50">
                        {item.id}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-white/80">
                    <div>{item.category}</div>
                    <div className="text-white/50 text-[11px]">{item.provenance}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-white/80">
                    <div>Size: {item.size}</div>
                    <div className="text-white/50 text-[11px]">{item.condition}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    <input
                      type="number"
                      defaultValue={item.price}
                      onBlur={(e) => handlePriceChange(item.id, Number(e.target.value))}
                      className="w-28 bg-black border border-white/20 px-2.5 py-1 text-white font-mono text-xs focus:border-[#c7ff97] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    {item.inStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c7ff97]/15 text-[#c7ff97] text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>IN STOCK</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ff4500]/20 text-[#ff4500] text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>CLAIMED</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(item.id)}
                      className="border border-white/25 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                    >
                      {item.inStock ? 'Mark Claimed' : 'Restore Stock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'orders' ? (
        <div className="overflow-x-auto border border-white/15 bg-[#111111]">
          {orders.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs text-white/50">
              No local storefront orders recorded in this browser session yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 font-mono text-[10px] uppercase tracking-widest text-white/50">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer & Phone</th>
                  <th className="py-3.5 px-4">Dispatch Zone</th>
                  <th className="py-3.5 px-4">M-Pesa / Receipt</th>
                  <th className="py-3.5 px-4 text-right">Total (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-xs text-[#c7ff97]">{ord.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{ord.customerName}</div>
                      <div className="font-mono text-xs text-white/50">{ord.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-white/80">{ord.estate}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="px-2 py-0.5 bg-white/10 text-white">
                        {ord.mpesaReceipt || ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-right">
                      KES {Number(ord.total).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-white/15 bg-[#111111] p-6 space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#c7ff97]">
              LIVE STORE CONTACT CONFIGURATION
            </div>
            <h2 className="text-lg font-bold">Active Public Dispatch Details</h2>
            <dl className="divide-y divide-white/10 border-y border-white/10 font-mono text-xs">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-white/50 uppercase">Display Phone</dt>
                <dd className="text-white font-semibold">{STORE_CONFIG.phoneDisplay}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-white/50 uppercase">WhatsApp Endpoint</dt>
                <dd className="text-[#c7ff97]">wa.me/{STORE_CONFIG.whatsappDigits}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-white/50 uppercase">M-Pesa Buy Goods Till</dt>
                <dd className="text-white font-semibold">
                  {STORE_CONFIG.hasMpesaTill
                    ? STORE_CONFIG.mpesaTill
                    : `Not Active — Direct Pay on Delivery (${STORE_CONFIG.phoneLocal})`}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-white/50 uppercase">Store Email</dt>
                <dd className="text-white font-semibold">{STORE_CONFIG.email}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-white/50 uppercase">Session Mode</dt>
                <dd className="text-[#c7ff97]">
                  HttpOnly Signed Cookie{sessionExpiresAt ? ` (Expires ${new Date(sessionExpiresAt).toLocaleTimeString()})` : ''}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-white/15 bg-[#111111] p-6 space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#ff4500]">
              CLIENT HANDOVER &amp; CREDENTIAL ROTATION
            </div>
            <h2 className="text-lg font-bold">How to Safely Change Password or Phone</h2>
            <p className="text-xs text-white/70 leading-relaxed">
              For maximum security, credentials are never stored in browser code and no public password-reset endpoint is exposed. Rotate secrets inside <strong>Vercel Dashboard → Project Settings → Environment Variables</strong> (protected by Vercel 2FA), then redeploy:
            </p>
            <ul className="space-y-2 font-mono text-xs text-white/80 bg-black border border-white/10 p-4">
              <li><span className="text-[#c7ff97]">ADMIN_PASSCODE</span> — Strong manager passphrase (8+ chars)</li>
              <li><span className="text-[#c7ff97]">ADMIN_SECRET</span> — Random 32+ char hex cookie-signing key</li>
              <li><span className="text-[#c7ff97]">VITE_STORE_WHATSAPP</span> — WhatsApp digits (e.g. 254706678338)</li>
              <li><span className="text-[#c7ff97]">VITE_STORE_PHONE_DISPLAY</span> — Formatted phone (e.g. +254 706 678 338)</li>
              <li><span className="text-[#c7ff97]">VITE_MPESA_TILL</span> — Safaricom Buy Goods Till / Paybill</li>
              <li><span className="text-[#c7ff97]">VITE_STORE_EMAIL</span> — Store support &amp; privacy email</li>
            </ul>
          </div>
        </div>
      )}

      {/* Add Specimen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/20 w-full max-w-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4">Add 1-of-1 Archival Specimen</h2>
            <form onSubmit={handleAddSpecimen} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">
                  Piece Title
                </label>
                <input
                  type="text"
                  required
                  value={newPiece.name}
                  onChange={(e) => setNewPiece({ ...newPiece, name: e.target.value })}
                  placeholder="e.g. 1994 Avirex Distressed Flight Jacket"
                  className="w-full bg-black border border-white/25 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">
                    Price (KES)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPiece.price}
                    onChange={(e) => setNewPiece({ ...newPiece, price: Number(e.target.value) })}
                    className="w-full bg-black border border-white/25 px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    required
                    value={newPiece.size}
                    onChange={(e) => setNewPiece({ ...newPiece, size: e.target.value })}
                    className="w-full bg-black border border-white/25 px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="border border-white/25 px-4 py-2 font-mono text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c7ff97] text-black font-mono text-xs font-bold uppercase tracking-widest px-5 py-2"
                >
                  Publish to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
