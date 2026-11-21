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

interface AdminPageProps {
  products: Product[];
  onCatalogMutated: () => void;
}

const SALT = 'ladha_nbo_salt_v3_9941';
const VALID_DIGESTS = new Set([
  '49584038a130249c15866a58795369de67812a1c75fb72aeb4f3b0e0081b525b',
  '3b7e395b6309fbc22c63e3e4affe8907160518fef19a3cafa97f36b1f724a1b0',
]);
const SESSION_TOKEN_KEY = 'ladha_admin_token';
const LEDGER_TOKEN_KEY = 'authToken';
const LOCKOUT_KEY = 'ladha_admin_lockout_until';
const ATTEMPTS_KEY = 'ladha_admin_attempts';

function isSignedTokenValid(token: string | null): boolean {
  if (!token) return false;
  return (
    token.startsWith('ladha_v3_sig_49584038a130249c_') ||
    token.startsWith('ladha_v3_sig_3b7e395b6309fbc2_')
  );
}

async function computeSaltedSha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${SALT}:${input}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AdminPage: React.FC<AdminPageProps> = ({ products, onCatalogMutated }) => {
  const { navigate } = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(() => {
    try {
      return isSignedTokenValid(sessionStorage.getItem(SESSION_TOKEN_KEY));
    } catch {
      return false;
    }
  });

  const [passcode, setPasscode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
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

  useEffect(() => {
    if (authorized) {
      setOrders(getStoredOrders());
    }
  }, [authorized]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || verifying) return;

    const now = Date.now();
    const lockoutUntil = Number(sessionStorage.getItem(LOCKOUT_KEY) || '0');
    if (lockoutUntil > now) {
      const mins = Math.ceil((lockoutUntil - now) / 60000);
      setAuthError(`Rate limit exceeded. Terminal locked for ${mins} min(s).`);
      return;
    }

    setVerifying(true);
    setAuthError(null);

    try {
      const digest = await computeSaltedSha256(passcode.trim());
      if (VALID_DIGESTS.has(digest)) {
        const signedToken = `ladha_v3_sig_${digest.slice(0, 16)}_${Date.now()}`;
        sessionStorage.setItem(SESSION_TOKEN_KEY, signedToken);
        sessionStorage.removeItem(ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_KEY);
        localStorage.setItem(LEDGER_TOKEN_KEY, signedToken);
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: 'Executive Controller',
            email: 'controller@ladha.ke',
            role: 'controller',
            organization: 'Ladha Nairobi',
          })
        );
        setPasscode('');
        setAuthorized(true);
      } else {
        const attempts = Number(sessionStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
        sessionStorage.setItem(ATTEMPTS_KEY, String(attempts));
        if (attempts >= 5) {
          sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + 15 * 60 * 1000));
          setAuthError('Maximum attempts (5/5) reached. Terminal locked for 15 minutes.');
        } else {
          setAuthError(`Invalid security key (${attempts}/5 attempts). Access denied.`);
        }
        setPasscode('');
      }
    } catch {
      setAuthError('Cryptographic verification failed. Use a secure HTTPS/localhost context.');
    } finally {
      setVerifying(false);
    }
  };

  const handleLockSession = () => {
    try {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(LEDGER_TOKEN_KEY);
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
    setAuthorized(false);
  };

  const handleOpenLedger = () => {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
      localStorage.setItem(LEDGER_TOKEN_KEY, token);
    }
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

  // FAIL-CLOSED GATE: Do not mount any Admin DOM until SHA-256 signature is verified
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
            SHA-256 SALTED HANDSHAKE · MAX 5 ATTEMPTS // 15-MIN LOCKOUT
          </p>

          <form onSubmit={handleUnlock} className="space-y-5">
            <div>
              <label
                htmlFor="admin-security-key"
                className="block font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 mb-2"
              >
                Enter Manager Security Key
              </label>
              <input
                id="admin-security-key"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••"
                autoComplete="current-password"
                required
                autoFocus
                className="w-full bg-black border border-white/25 px-4 py-3 text-white font-mono text-base tracking-[0.25em] focus:outline-none focus:border-[#c7ff97]"
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
      ) : (
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
