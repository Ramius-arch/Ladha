/**
 * Ladha Commerce Integration Service for Qx_Billing
 * 
 * Manages bidirectional communication between Qx_Billing and Ladha Storefront:
 * 1. Product Catalog queries & real-time inventory inspection
 * 2. 1-of-1 Archival Piece reservation & release logic
 * 3. Kenyan E.164 phone number normalization & customer reconciliation
 * 4. Regional shipping fee calculation & line-item separation
 * 5. Order synchronization into Ladha's audit repository
 */

const http = require('http');
const https = require('https');
const url = require('url');

class LadhaService {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.LADHA_API_URL || 'http://localhost:3001';
    }

    /**
     * Internal HTTP request helper
     */
    async _request(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            const targetUrl = new url.URL(endpoint, this.baseUrl);
            const client = targetUrl.protocol === 'https:' ? https : http;

            const payloadStr = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

            const reqOptions = {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'QxBilling-IntegrationEngine/1.0',
                    ...(payloadStr ? { 'Content-Length': Buffer.byteLength(payloadStr) } : {}),
                    ...(options.headers || {})
                }
            };

            const req = client.request(targetUrl, reqOptions, (res) => {
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = data ? JSON.parse(data) : {};
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsed);
                        } else {
                            reject(new Error(parsed.error || `Ladha API returned status ${res.statusCode}: ${data}`));
                        }
                    } catch (e) {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(data);
                        } else {
                            reject(new Error(`Failed to parse response: ${data}`));
                        }
                    }
                });
            });

            req.on('error', (err) => {
                reject(new Error(`Could not connect to Ladha API at ${this.baseUrl}: ${err.message}`));
            });

            if (payloadStr) {
                req.write(payloadStr);
            }

            req.end();
        });
    }

    /**
     * Check if Ladha Storefront API is reachable
     */
    async checkHealth() {
        try {
            return await this._request('/api/health');
        } catch (e) {
            return { status: 'offline', error: e.message };
        }
    }

    /**
     * Fetch entire curated product catalog from Ladha
     */
    async getProducts() {
        const res = await this._request('/api/products');
        return res.products || [];
    }

    /**
     * Fetch single product by ID
     */
    async getProduct(productId) {
        const res = await this._request(`/api/products/${productId}`);
        return res.product || null;
    }

    /**
     * Reserve a 1-of-1 archival garment during checkout
     */
    async reserveItem(productId, reservationId) {
        return await this._request(`/api/products/${productId}/stock`, {
            method: 'POST',
            body: {
                inStock: false,
                reason: `RESERVED_FOR_CHECKOUT_${reservationId}`,
                reservationId
            }
        });
    }

    /**
     * Release a 1-of-1 archival garment back to inventory if payment fails/cancels
     */
    async releaseItem(productId, reservationId) {
        return await this._request(`/api/products/${productId}/stock`, {
            method: 'POST',
            body: {
                inStock: true,
                reason: `RELEASED_FROM_FAILED_CHECKOUT_${reservationId}`,
                reservationId
            }
        });
    }

    /**
     * Fetch order history from Ladha
     */
    async getOrders() {
        const res = await this._request('/api/orders');
        return res.orders || [];
    }

    /**
     * Sync completed order into Ladha's permanent ledger
     */
    async recordOrder(order) {
        return await this._request('/api/orders', {
            method: 'POST',
            body: order
        });
    }

    /**
     * Nuance Logic: Kenyan Phone Number Normalization
     * Standardizes local formats (0712..., 0112..., +254712..., 254712...) to E.164 (2547...)
     */
    normalizePhone(phone) {
        if (!phone) return '';
        let cleaned = phone.replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0') && cleaned.length === 10) {
            return '254' + cleaned.substring(1);
        }
        if (cleaned.startsWith('254') && cleaned.length === 12) {
            return cleaned;
        }
        if (cleaned.length === 9) {
            return '254' + cleaned;
        }
        return cleaned;
    }

    /**
     * Nuance Logic: Nairobi Regional Shipping Tariff
     */
    calculateShippingFee(region) {
        if (!region) return 300;
        const normalized = region.toLowerCase();
        if (normalized.includes('cbd') || normalized.includes('town')) return 200;
        if (normalized.includes('kilimani') || normalized.includes('westlands') || normalized.includes('lavington')) return 250;
        if (normalized.includes('ruaka') || normalized.includes('thika') || normalized.includes('rongai') || normalized.includes('kikuyu')) return 400;
        if (normalized.includes('mombasa') || normalized.includes('kisumu') || normalized.includes('nakuru') || normalized.includes('eldoret')) return 500;
        return 350; // Standard Nairobi default
    }
}

module.exports = new LadhaService();
