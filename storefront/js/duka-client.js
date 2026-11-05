/**
 * DukaEngine — Universal Headless Storefront SDK
 * 
 * Features:
 * - Drop-in Client Library for ANY web storefront (HTML5, Next.js, Remix, Astro)
 * - Persistent LocalStorage Cart Engine with Stock Reservation
 * - Native Safaricom M-Pesa STK Push Modal with Real-Time Polling & Dev Simulator Quick-Action
 * - Custom Event Telemetry ('duka:order:completed', 'duka:cart:updated')
 */

class DukaClient {
    constructor(config = {}) {
        this.storeId = config.storeId || 'ladha-nairobi';
        this.apiUrl = (config.apiUrl || 'http://localhost:5000').replace(/\/$/, '');
        this.currency = config.currency || 'KES';
        this.cartKey = `duka_cart_${this.storeId}`;
        this.pollingInterval = null;

        this.cart = {
            items: this.loadCart(),
            add: (item) => this.addToCart(item),
            remove: (id) => this.removeFromCart(id),
            updateQty: (id, qty) => this.updateQuantity(id, qty),
            clear: () => this.clearCart(),
            getItems: () => [...this.cart.items],
            getSubtotal: () => this.cart.items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0),
            getCount: () => this.cart.items.reduce((sum, i) => sum + (i.quantity || 1), 0)
        };

        this.injectModalStyles();
    }

    /* ================= CART OPERATIONS ================= */

    loadCart() {
        try {
            const raw = localStorage.getItem(this.cartKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.cart.items));
            window.dispatchEvent(new CustomEvent('duka:cart:updated', { detail: { cart: this.cart } }));
        } catch (e) {}
    }

    addToCart(item) {
        const existing = this.cart.items.find(i => i.id === item.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
        } else {
            this.cart.items.push({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image || (item.images && item.images[0]) || '',
                variantId: item.variantId || null,
                quantity: item.quantity || 1
            });
        }
        this.saveCart();
    }

    removeFromCart(id) {
        this.cart.items = this.cart.items.filter(i => i.id !== id);
        this.saveCart();
    }

    updateQuantity(id, qty) {
        const item = this.cart.items.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(0, qty);
            if (item.quantity === 0) {
                this.removeFromCart(id);
                return;
            }
            this.saveCart();
        }
    }

    clearCart() {
        this.cart.items = [];
        this.saveCart();
    }

    /* ================= CHECKOUT & M-PESA STK MODAL ================= */

    async checkout({ customer, items, paymentMethod = 'mpesa', onCompleted, onError }) {
        const rawItems = (items && items.length) ? items : this.cart.items;
        if (!rawItems.length) {
            alert('Your cart is empty.');
            return;
        }

        const normalizedItems = rawItems.map(i => ({
            id: i.id,
            title: i.title || i.name || 'Store Item',
            price: Number(i.price) || 0,
            quantity: Number(i.quantity) || 1,
            variantId: i.variantId || null,
            image: i.image || ''
        }));

        const idempotencyKey = 'idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

        try {
            const res = await fetch(`${this.apiUrl}/api/stores/${this.storeId}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Store-Id': this.storeId,
                    'Idempotency-Key': idempotencyKey
                },
                body: JSON.stringify({
                    customer,
                    items: normalizedItems,
                    payment: { method: paymentMethod }
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Checkout request failed.');
            }

            if (paymentMethod === 'mpesa') {
                this.showMpesaModal({
                    order: data.order,
                    mpesa: data.mpesa,
                    phone: customer.phone,
                    onCompleted,
                    onError
                });
            } else {
                this.clearCart();
                if (onCompleted) onCompleted(data.order);
            }

            return data;
        } catch (err) {
            if (onError) onError(err);
            else alert(err.message || 'Checkout error.');
            throw err;
        }
    }

    showMpesaModal({ order, mpesa, phone, onCompleted, onError }) {
        this.closeMpesaModal();

        const isSimulator = mpesa.mode === 'simulator';
        const modal = document.createElement('div');
        modal.id = 'duka-mpesa-modal-wrap';
        modal.innerHTML = `
            <div class="duka-modal-backdrop"></div>
            <div class="duka-modal-card">
                <button class="duka-modal-close" id="duka-modal-close-btn">&times;</button>
                <div class="duka-modal-header">
                    <span class="duka-mpesa-pill">SAFARICOM M-PESA</span>
                    <span class="duka-mode-badge">${isSimulator ? 'SIMULATOR ACTIVE' : 'LIVE GATEWAY'}</span>
                </div>
                <div class="duka-modal-body">
                    <div class="duka-stk-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00c853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                        <span class="duka-pulse-ring"></span>
                    </div>
                    <h3 class="duka-modal-title">Enter M-Pesa PIN</h3>
                    <p class="duka-modal-instruction">
                        An STK Push has been sent to <strong>${phone}</strong>.<br>
                        Enter your M-Pesa PIN to complete payment of <strong>KES ${order.total.toLocaleString()}</strong>.
                    </p>
                    <div class="duka-countdown-wrap">
                        <span class="duka-countdown-bar" id="duka-countdown-bar"></span>
                    </div>
                    <div class="duka-status-ticker" id="duka-stk-status">
                        Waiting for customer input on phone...
                    </div>

                    ${isSimulator ? `
                    <div class="duka-sim-panel">
                        <p class="duka-sim-tag">DEVELOPER TEST ACTION:</p>
                        <div class="duka-sim-btns">
                            <button class="duka-sim-btn-approve" id="duka-sim-approve-btn">⚡ Simulate Customer Entered PIN</button>
                            <button class="duka-sim-btn-cancel" id="duka-sim-cancel-btn">Cancel Prompt</button>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind Close
        modal.querySelector('#duka-modal-close-btn').onclick = () => this.closeMpesaModal();
        modal.querySelector('.duka-modal-backdrop').onclick = () => this.closeMpesaModal();

        // Bind Simulator Actions if present
        if (isSimulator) {
            const approveBtn = modal.querySelector('#duka-sim-approve-btn');
            const cancelBtn = modal.querySelector('#duka-sim-cancel-btn');

            if (approveBtn) {
                approveBtn.onclick = async () => {
                    approveBtn.textContent = 'Processing Approval...';
                    approveBtn.disabled = true;
                    await fetch(`${this.apiUrl}/api/mpesa/simulate-action`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ checkoutRequestId: mpesa.checkoutRequestId, action: 'APPROVE' })
                    });
                };
            }

            if (cancelBtn) {
                cancelBtn.onclick = async () => {
                    await fetch(`${this.apiUrl}/api/mpesa/simulate-action`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ checkoutRequestId: mpesa.checkoutRequestId, action: 'CANCEL' })
                    });
                };
            }
        }

        // Start Auto-Polling
        this.startPolling(mpesa.checkoutRequestId, order, onCompleted, onError);
    }

    startPolling(checkoutRequestId, order, onCompleted, onError) {
        let attempts = 0;
        const maxAttempts = 40; // 60 seconds total at 1.5s interval
        const bar = document.getElementById('duka-countdown-bar');
        const statusEl = document.getElementById('duka-stk-status');

        this.pollingInterval = setInterval(async () => {
            attempts++;
            const pct = Math.max(0, 100 - (attempts / maxAttempts) * 100);
            if (bar) bar.style.width = pct + '%';

            try {
                const res = await fetch(`${this.apiUrl}/api/mpesa/query/${checkoutRequestId}`);
                const data = await res.json();

                if (data.paymentStatus === 'PAID') {
                    clearInterval(this.pollingInterval);
                    this.showPaymentSuccess(order, data.mpesaReceipt, onCompleted);
                    return;
                }

                if (data.paymentStatus === 'FAILED') {
                    clearInterval(this.pollingInterval);
                    if (statusEl) {
                        statusEl.textContent = 'Payment Cancelled or Request Timed Out.';
                        statusEl.style.color = '#e53935';
                    }
                    if (onError) onError(new Error('M-Pesa payment cancelled.'));
                    return;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(this.pollingInterval);
                    if (statusEl) {
                        statusEl.textContent = 'No response received. Please try again.';
                        statusEl.style.color = '#e53935';
                    }
                }
            } catch (e) {}
        }, 1500);
    }

    showPaymentSuccess(order, receipt, onCompleted) {
        const card = document.querySelector('.duka-modal-card');
        if (!card) return;

        card.innerHTML = `
            <div class="duka-success-body">
                <div class="duka-check-circle">✓</div>
                <h2 class="duka-success-title">Payment Confirmed</h2>
                <div class="duka-receipt-box">
                    <span class="duka-receipt-label">M-PESA RECEIPT:</span>
                    <strong class="duka-receipt-code">${receipt || 'CONFIRMED'}</strong>
                </div>
                <p class="duka-success-desc">
                    Order <strong>${order.id}</strong> has been received.<br>
                    You will receive an SMS confirmation shortly.
                </p>
                <div class="duka-actions-stack" style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;">
                    <a href="${this.apiUrl}/api/commerce/invoices/${order.id}/etims-pdf" target="_blank" class="duka-btn-etims" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #059669; color: #ffffff; text-decoration: none; padding: 0.75rem 1rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.04em; transition: background 0.15s ease;">
                        <span>📄</span>
                        <span>DOWNLOAD KRA eTIMS TAX INVOICE (PDF)</span>
                    </a>
                    <button class="duka-btn-finish" id="duka-finish-btn" style="background: #1e293b; color: #ffffff; border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Return to Store</button>
                </div>
            </div>
        `;

        this.clearCart();

        const finishBtn = card.querySelector('#duka-finish-btn');
        if (finishBtn) {
            finishBtn.onclick = () => {
                this.closeMpesaModal();
                if (onCompleted) onCompleted(order, receipt);
            };
        }

        window.dispatchEvent(new CustomEvent('duka:order:completed', {
            detail: { order, receipt, storeId: this.storeId }
        }));
    }

    closeMpesaModal() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        const existing = document.getElementById('duka-mpesa-modal-wrap');
        if (existing) existing.remove();
    }

    injectModalStyles() {
        if (document.getElementById('duka-sdk-styles')) return;
        const style = document.createElement('style');
        style.id = 'duka-sdk-styles';
        style.textContent = `
            #duka-mpesa-modal-wrap {
                position: fixed;
                inset: 0;
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            }
            .duka-modal-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(10, 10, 10, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }
            .duka-modal-card {
                position: relative;
                width: 100%;
                max-width: 440px;
                background: #ffffff;
                color: #0a0a0a;
                border: 1px solid #1a1a1a;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
                padding: 2rem;
                border-radius: 4px;
                animation: dukaPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes dukaPop {
                from { opacity: 0; transform: scale(0.96) translateY(8px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .duka-modal-close {
                position: absolute;
                top: 1rem;
                right: 1.2rem;
                background: transparent;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #888888;
                line-height: 1;
            }
            .duka-modal-close:hover { color: #000000; }
            .duka-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .duka-mpesa-pill {
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.1em;
                color: #00c853;
                background: #e8f5e9;
                padding: 4px 8px;
                border-radius: 2px;
            }
            .duka-mode-badge {
                font-size: 9px;
                font-weight: 800;
                color: #666666;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }
            .duka-stk-icon {
                position: relative;
                width: 60px;
                height: 60px;
                margin: 0 auto 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f1f8e9;
                border-radius: 50%;
            }
            .duka-pulse-ring {
                position: absolute;
                inset: -6px;
                border: 2px solid #00c853;
                border-radius: 50%;
                animation: dukaPulse 1.8s infinite;
            }
            @keyframes dukaPulse {
                0% { transform: scale(0.9); opacity: 0.8; }
                100% { transform: scale(1.3); opacity: 0; }
            }
            .duka-modal-title {
                margin: 0 0 0.5rem;
                font-size: 1.35rem;
                font-weight: 900;
                text-align: center;
                letter-spacing: -0.02em;
            }
            .duka-modal-instruction {
                font-size: 13px;
                line-height: 1.5;
                color: #555555;
                text-align: center;
                margin: 0 0 1.5rem;
            }
            .duka-countdown-wrap {
                width: 100%;
                height: 4px;
                background: #eeeeee;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 1rem;
            }
            .duka-countdown-bar {
                display: block;
                height: 100%;
                width: 100%;
                background: #00c853;
                transition: width 0.5s linear;
            }
            .duka-status-ticker {
                font-size: 11px;
                font-weight: 600;
                color: #777777;
                text-align: center;
                font-family: monospace;
            }
            .duka-sim-panel {
                margin-top: 1.5rem;
                padding-top: 1rem;
                border-top: 1px dashed #dddddd;
                background: #fafafa;
                padding: 1rem;
                border-radius: 4px;
            }
            .duka-sim-tag {
                font-size: 9px;
                font-weight: 800;
                letter-spacing: 0.1em;
                color: #999999;
                margin: 0 0 0.6rem;
            }
            .duka-sim-btns {
                display: flex;
                gap: 0.5rem;
            }
            .duka-sim-btn-approve {
                flex: 2;
                background: #00c853;
                color: #ffffff;
                border: none;
                padding: 0.55rem 0.75rem;
                font-size: 11px;
                font-weight: 800;
                cursor: pointer;
                border-radius: 2px;
            }
            .duka-sim-btn-approve:hover { background: #00a844; }
            .duka-sim-btn-cancel {
                flex: 1;
                background: #ffffff;
                color: #e53935;
                border: 1px solid #e53935;
                padding: 0.55rem 0.75rem;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                border-radius: 2px;
            }
            .duka-success-body {
                text-align: center;
                padding: 1rem 0;
            }
            .duka-check-circle {
                width: 64px;
                height: 64px;
                background: #00c853;
                color: #ffffff;
                font-size: 32px;
                font-weight: 900;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.25rem;
            }
            .duka-success-title {
                font-size: 1.5rem;
                font-weight: 900;
                margin: 0 0 1rem;
            }
            .duka-receipt-box {
                background: #f5f5f5;
                padding: 0.85rem;
                border-radius: 4px;
                margin-bottom: 1.25rem;
                font-family: monospace;
            }
            .duka-receipt-label {
                display: block;
                font-size: 10px;
                color: #888888;
                margin-bottom: 2px;
            }
            .duka-receipt-code {
                font-size: 1.2rem;
                font-weight: 900;
                letter-spacing: 0.15em;
                color: #000000;
            }
            .duka-success-desc {
                font-size: 13px;
                color: #666666;
                line-height: 1.5;
                margin-bottom: 1.75rem;
            }
            .duka-btn-finish {
                background: #0a0a0a;
                color: #ffffff;
                border: none;
                width: 100%;
                padding: 0.85rem;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
}

// Global exposure
if (typeof window !== 'undefined') {
    window.DukaClient = DukaClient;
}
