/**
 * Universal Stock Reservation TTL Sweeper Daemon
 * Periodically monitors and reclaims abandoned stock reservations across all stores.
 * Ensures 1-of-1 pieces and finite inventory are never locked permanently by abandoned checkouts.
 */

const { Op } = require('sequelize');
const db = require('../../models');
const ladhaService = require('../ladhaService');
const { clearCache } = require('../../middleware/cacheHandler');

const StockReservation = db.StockReservation;
const Order = db.Order;
const PaymentIntent = db.PaymentIntent;

class ReservationSweeper {
  constructor() {
    this.timer = null;
    this.isRunning = false;
    this.lastSweepAt = null;
    this.totalReclaimedCount = 0;
  }

  /**
   * Scans and reclaims all expired active reservations
   * @returns {Promise<{ reclaimed: number, reservations: Array }>}
   */
  async sweepExpiredReservations() {
    const now = new Date();
    this.lastSweepAt = now;

    try {
      const expiredReservations = await StockReservation.findAll({
        where: {
          status: 'active',
          expiresAt: {
            [Op.lte]: now
          }
        },
        include: [{ model: Order, include: [{ model: PaymentIntent, as: 'paymentIntents' }] }]
      });

      if (!expiredReservations || expiredReservations.length === 0) {
        return { reclaimed: 0, reservations: [] };
      }

      console.log(`[ReservationSweeper] Found ${expiredReservations.length} expired reservation(s) to reclaim.`);
      const reclaimedList = [];

      for (const res of expiredReservations) {
        const order = res.Order;
        const productId = res.productId;
        const reservationId = res.reservationId;

        // 1. Release live inventory back to catalog adapter
        try {
          await ladhaService.releaseItem(productId, res.reservationId);
          console.log(`[ReservationSweeper] Released item ${productId} for reservation ${reservationId}`);
        } catch (releaseErr) {
          console.warn(`[ReservationSweeper] Could not notify storefront for ${productId}:`, releaseErr.message);
        }

        // 2. Mark reservation status as expired
        res.status = 'expired';
        await res.save();

        // 3. Mark Order as expired if still pending payment
        if (order && order.status === 'pending_payment') {
          order.status = 'expired';
          await order.save();
          console.log(`[ReservationSweeper] Order ${order.orderNumber} marked as expired.`);
        }

        // 4. Mark pending PaymentIntent as expired
        if (order && order.paymentIntents && order.paymentIntents.length > 0) {
          for (const pi of order.paymentIntents) {
            if (pi.status === 'requires_action') {
              pi.status = 'expired';
              pi.failureReason = 'Reservation expired (15m TTL checkout timeout)';
              await pi.save();
            }
          }
        }

        reclaimedList.push({
          id: res.id,
          productId,
          reservationId,
          orderNumber: order ? order.orderNumber : null,
          expiredAt: res.expiresAt
        });
        this.totalReclaimedCount++;
      }

      clearCache('/api/reports*');
      return { reclaimed: reclaimedList.length, reservations: reclaimedList };

    } catch (error) {
      console.error('[ReservationSweeper] Error sweeping expired reservations:', error.message);
      return { reclaimed: 0, error: error.message };
    }
  }

  /**
   * Starts the background interval sweeper
   * @param {number} intervalMs Sweep interval in milliseconds (defaults to 30,000ms / 30s)
   */
  startSweeper(intervalMs = 30000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[ReservationSweeper] Started daemon with interval ${intervalMs}ms.`);

    // Run immediate sweep on startup
    this.sweepExpiredReservations().catch(err => {
      console.warn('[ReservationSweeper] Startup sweep warning:', err.message);
    });

    this.timer = setInterval(() => {
      this.sweepExpiredReservations().catch(err => {
        console.warn('[ReservationSweeper] Interval sweep warning:', err.message);
      });
    }, intervalMs);

    // Unref timer so it does not block node process shutdown in tests
    if (this.timer && this.timer.unref) {
      this.timer.unref();
    }
  }

  /**
   * Stops the background interval sweeper
   */
  stopSweeper() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[ReservationSweeper] Sweeper daemon stopped.');
  }

  /**
   * Telemetry status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSweepAt: this.lastSweepAt,
      totalReclaimedCount: this.totalReclaimedCount
    };
  }
}

module.exports = new ReservationSweeper();
