<template>
  <div class="loading-page-root" :class="{ 'is-complete': progress >= 100 }">
    <!-- Ambient Atmospheric Background -->
    <div class="ambient-layer" aria-hidden="true">
      <div class="ambient-radial-glow"></div>
      <div class="ambient-mesh"></div>
      <div class="ambient-film-grain"></div>
    </div>

    <!-- Letterbox Frame Top Bar -->
    <header class="frame-bar top-bar">
      <div class="frame-inner">
        <span class="system-meta font-mono">KERNEL &bull; {{ activeTenant.brand.engineVersion || 'LEDGER OS v2.4' }}</span>
        <span class="system-status font-mono">
          <span class="status-dot" :class="{ 'dot-ready': progress >= 100 }"></span>
          {{ progress >= 100 ? 'SYSTEM READY' : 'BOOTSTRAP IN PROGRESS' }}
        </span>
      </div>
    </header>

    <!-- Central Stage -->
    <main class="loading-stage">
      <div class="stage-container">
        <!-- 1. Emblem & Brand Title -->
        <div class="brand-monolith">
          <div class="emblem-wrapper" :class="{ 'emblem-pulsing': progress < 100, 'emblem-locked': progress >= 100 }">
            <div class="emblem-halo"></div>
            <div class="emblem-frame">
              <img src="/assets/logo.png" alt="Emblem" class="emblem-img" />
            </div>
          </div>

          <h1 class="brand-heading">
            {{ activeTenant.brand.name }} 
            <span class="brand-script">{{ activeTenant.brand.accent }}</span>
          </h1>
          <p class="brand-tagline font-mono">
            {{ activeTenant.brand.edition || 'FINANCIAL OS' }} &bull; {{ activeTenant.industryName }}
          </p>
        </div>

        <!-- 2. High-Precision Hairline Progress Track -->
        <div class="progress-monolith">
          <div class="progress-meta font-mono">
            <span class="stage-phase-label">{{ currentStepLabel }}</span>
            <span class="percentage-readout tabular-num">{{ Math.round(progress) }}%</span>
          </div>

          <div class="hairline-track">
            <div 
              class="hairline-fill" 
              :style="{ width: progress + '%' }"
            >
              <div class="fill-spark"></div>
            </div>
          </div>
        </div>

        <!-- 3. Real-Time Telemetry Terminal Ticker -->
        <div class="telemetry-terminal">
          <div class="terminal-header font-mono">
            <span class="th-title">INITIALIZATION TELEMETRY</span>
            <span class="th-latency font-mono text-indigo-400">{{ activeTenant.brand.syncLatency || '18MS' }}</span>
          </div>

          <div class="terminal-body font-mono">
            <div 
              v-for="(log, idx) in logSteps" 
              :key="idx" 
              class="log-row"
              :class="{
                'log-done': progress >= log.threshold,
                'log-active': progress < log.threshold && progress >= (log.threshold - 25),
                'log-pending': progress < (log.threshold - 25)
              }"
            >
              <span class="log-indicator">
                <span v-if="progress >= log.threshold" class="check-icon">&#10003;</span>
                <span v-else-if="progress >= (log.threshold - 25)" class="spin-icon">&#9679;</span>
                <span v-else class="dash-icon">&bull;</span>
              </span>
              <span class="log-code">[{{ log.code }}]</span>
              <span class="log-message">{{ log.text }}</span>
            </div>
          </div>
        </div>

        <!-- 4. Action Dock -->
        <div class="action-dock">
          <transition name="fade">
            <div v-if="progress >= 100" class="complete-actions">
              <button 
                type="button" 
                class="btn-enter-terminal" 
                @click="enterSystem"
                autofocus
              >
                <span>ENTER LIVE TERMINAL</span>
                <span class="enter-arrow">&rarr;</span>
              </button>
              
              <button 
                type="button" 
                class="btn-replay font-mono" 
                @click="replaySequence"
              >
                &#8634; REPLAY BOOT
              </button>
            </div>
            <div v-else class="loading-actions">
              <button 
                type="button" 
                class="btn-skip font-mono" 
                @click="skipLoading"
              >
                BYPASS SEQUENCE &rarr;
              </button>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- Letterbox Frame Bottom Bar -->
    <footer class="frame-bar bottom-bar">
      <div class="frame-inner">
        <span class="footer-copy font-mono">&copy; {{ new Date().getFullYear() }} QUIXORA SOLUTIONS</span>
        <span class="footer-equilibrium font-mono text-emerald-400">
          <span class="eq-dot"></span>
          DOUBLE-ENTRY EQUILIBRIUM: 0.00 VARIANCE
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTenantConfig } from '../services/tenantConfig';

export default defineComponent({
  name: 'LoadingPage',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { activeTenant } = useTenantConfig();

    const progress = ref(0);
    let animationFrame = null;
    let startTime = null;

    // Target animation duration in milliseconds (smooth cinematic 1.8s)
    const DURATION = 1800;

    const logSteps = computed(() => [
      {
        threshold: 25,
        code: '01/04',
        text: 'MOUNTING DISTRIBUTED DOUBLE-ENTRY LEDGER KERNEL'
      },
      {
        threshold: 50,
        code: '02/04',
        text: 'VERIFYING ASSETS = LIABILITIES + EQUITY INVARIANCE (0.00 VAR)'
      },
      {
        threshold: 75,
        code: '03/04',
        text: `SYNCHRONIZING ${activeTenant.value.currency.code} AUTONOMOUS SETTLEMENT AUDITORS`
      },
      {
        threshold: 100,
        code: '04/04',
        text: `${activeTenant.value.brand.complianceBadge || 'GAAP / IFRS'} COMPLIANCE VERIFIED • READY`
      }
    ]);

    const currentStepLabel = computed(() => {
      const p = progress.value;
      if (p < 25) return 'BOOTSTRAPPING KERNEL';
      if (p < 50) return 'CHECKING INVARIANTS';
      if (p < 75) return 'SYNCING RAILS';
      if (p < 100) return 'FINALIZING AUDIT';
      return 'EQUILIBRIUM SECURED';
    });

    const stepAnimation = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      
      // Smooth cubic bezier easing
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      progress.value = Math.min(eased * 100, 100);

      if (t < 1) {
        animationFrame = requestAnimationFrame(stepAnimation);
      } else {
        progress.value = 100;
        // Check if auto-redirect is enabled via query param ?auto=true
        if (route.query.auto === 'true' || route.query.redirect) {
          setTimeout(() => {
            enterSystem();
          }, 400);
        }
      }
    };

    const startSequence = () => {
      progress.value = 0;
      startTime = null;
      animationFrame = requestAnimationFrame(stepAnimation);
    };

    const enterSystem = () => {
      const target = route.query.redirect || '/dashboard';
      router.push(target);
    };

    const skipLoading = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      progress.value = 100;
      enterSystem();
    };

    const replaySequence = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      startSequence();
    };

    onMounted(() => {
      startSequence();
    });

    onUnmounted(() => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    });

    return {
      activeTenant,
      progress,
      logSteps,
      currentStepLabel,
      enterSystem,
      skipLoading,
      replaySequence
    };
  }
});
</script>

<style scoped>
/* ==========================================================================
   Ciangoon & Apple Obsidian Glass Inspired Loading Page Architecture
   ========================================================================== */

.loading-page-root {
  min-height: 100vh;
  width: 100%;
  background: #050811;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  user-select: none;
}

/* 1. Ambient Lighting */
.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ambient-radial-glow {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(212, 175, 55, 0.05) 45%, transparent 70%);
  filter: blur(80px);
}

.ambient-mesh {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 15% 20%, rgba(6, 182, 212, 0.04), transparent 400px),
    radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.05), transparent 400px);
}

.ambient-film-grain {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0);
  background-size: 24px 24px;
  opacity: 0.35;
}

/* 2. Top & Bottom Letterbox Frame Bars */
.frame-bar {
  position: relative;
  z-index: 10;
  padding: 20px 32px;
  border-color: rgba(255, 255, 255, 0.06);
}

.top-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.bottom-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.frame-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.system-meta {
  color: #64748b;
  letter-spacing: 0.12em;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  letter-spacing: 0.08em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.8);
  animation: pulse-dot 1.6s infinite;
}

.status-dot.dot-ready {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
  animation: none;
}

/* 3. Central Loading Stage */
.loading-stage {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 24px;
}

.stage-container {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Brand Monolith */
.brand-monolith {
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.emblem-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.emblem-frame {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 
    0 12px 32px -8px rgba(0, 0, 0, 0.6),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.emblem-pulsing .emblem-frame {
  animation: float-slow 3s ease-in-out infinite;
}

.emblem-halo {
  position: absolute;
  inset: -8px;
  border-radius: 26px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  filter: blur(12px);
  z-index: 1;
  opacity: 0.6;
  animation: halo-breathe 2.4s ease-in-out infinite;
}

.emblem-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.brand-heading {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #ffffff;
  margin: 0 0 6px;
  line-height: 1.1;
}

.brand-script {
  font-weight: 300;
  font-style: italic;
  font-family: 'Times New Roman', serif;
  color: #d4af37;
  letter-spacing: -0.01em;
}

.brand-tagline {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #64748b;
  margin: 0;
}

/* Progress Monolith */
.progress-monolith {
  width: 100%;
  margin-bottom: 28px;
}

.progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 10px;
  padding: 0 2px;
}

.stage-phase-label {
  color: #94a3b8;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.percentage-readout {
  color: #d4af37;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.hairline-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
}

.hairline-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37 0%, #6366f1 65%, #10b981 100%);
  border-radius: 9999px;
  position: relative;
  transition: width 0.08s linear;
}

.fill-spark {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 12px #ffffff, 0 0 20px #6366f1;
}

/* Telemetry Terminal */
.telemetry-terminal {
  width: 100%;
  background: rgba(10, 15, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 28px;
  text-align: left;
  box-shadow: 
    0 12px 32px -6px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 10px;
  margin-bottom: 12px;
  font-size: 10px;
  letter-spacing: 0.1em;
}

.th-title {
  color: #64748b;
  font-weight: 800;
}

.th-latency {
  font-weight: 700;
}

.terminal-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
}

.log-row {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.log-indicator {
  width: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: #10b981;
  font-size: 11px;
  font-weight: bold;
}

.spin-icon {
  color: #f59e0b;
  font-size: 8px;
  animation: pulse-dot 1.2s infinite;
}

.dash-icon {
  color: #475569;
  font-size: 10px;
}

.log-code {
  color: #64748b;
  font-size: 10px;
}

.log-message {
  color: #94a3b8;
  letter-spacing: 0.02em;
  font-size: 10.5px;
}

.log-row.log-done .log-message {
  color: #e2e8f0;
}

.log-row.log-active .log-message {
  color: #f59e0b;
  font-weight: 600;
}

.log-row.log-pending {
  opacity: 0.35;
}

/* Action Dock */
.action-dock {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.complete-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-enter-terminal {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #050811;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-enter-terminal:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 45px rgba(255, 255, 255, 0.5);
  color: #050811;
}

.enter-arrow {
  transition: transform 0.2s ease;
}

.btn-enter-terminal:hover .enter-arrow {
  transform: translateX(3px);
}

.btn-replay {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 10.5px;
  font-weight: 600;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn-replay:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
}

.btn-skip {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.18s ease;
}

.btn-skip:hover {
  color: #d4af37;
}

/* Footer & Equilibrium */
.footer-copy {
  color: #475569;
  letter-spacing: 0.08em;
}

.footer-equilibrium {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.06em;
}

.eq-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes halo-breathe {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
