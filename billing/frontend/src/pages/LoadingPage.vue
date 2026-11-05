<template>
  <div class="loading-root" :class="{ 'is-complete': progress >= 100 }">
    <!-- Pure Substrate (No faux grain, no harsh scanlines, ultra-diffuse ambient depth) -->
    <div class="ambient-glow" aria-hidden="true"></div>

    <!-- Centered Minimalist Stage -->
    <main class="loading-center">
      <div class="content-stack">
        <!-- 1. Pure Floating Logo (Zero borders, zero boxes) -->
        <div class="logo-presence">
          <img src="/assets/logo.png" alt="Ladha Logo" class="pure-logo" />
        </div>

        <!-- 2. Restrained Typographic Identity -->
        <div class="brand-presence">
          <h1 class="brand-title">
            {{ activeTenant.brand.name }} <span class="brand-sub">{{ activeTenant.brand.accent }}</span>
          </h1>
          <p class="brand-edition font-mono">
            {{ activeTenant.brand.edition || 'FINANCIAL OS v2.4' }}
          </p>
        </div>

        <!-- 3. Minimalist Hairline Progress & Tabular Monospace Counter -->
        <div class="progress-presence">
          <div class="progress-track">
            <div 
              class="progress-bar" 
              :style="{ transform: `scaleX(${progress / 100})` }"
            ></div>
          </div>

          <div class="progress-labels font-mono">
            <span class="step-label">{{ currentStepText }}</span>
            <span class="number-label tabular-num">{{ Math.round(progress) }}%</span>
          </div>
        </div>

        <!-- 4. Quiet Monospace Audit Feed (No nested cards, no visual noise) -->
        <div class="telemetry-feed font-mono">
          <div 
            v-for="(log, idx) in logSteps" 
            :key="idx" 
            class="feed-line"
            :class="{
              'feed-done': progress >= log.threshold,
              'feed-active': progress < log.threshold && progress >= (log.threshold - 25),
              'feed-pending': progress < (log.threshold - 25)
            }"
          >
            <span class="feed-code">0{{ idx + 1 }}</span>
            <span class="feed-text">{{ log.text }}</span>
            <span class="feed-status">
              <span v-if="progress >= log.threshold" class="status-done">ok</span>
              <span v-else-if="progress >= (log.threshold - 25)" class="status-active">...</span>
              <span v-else class="status-pending">&mdash;</span>
            </span>
          </div>
        </div>

        <!-- 5. Seamless Action Reveal (Emil Kowalski spring physics) -->
        <div class="action-slot">
          <transition name="action-spring">
            <div v-if="progress >= 100" class="complete-group">
              <button 
                type="button" 
                class="btn-enter" 
                @click="enterSystem"
                autofocus
              >
                <span>Enter Terminal</span>
                <span class="arrow">&rarr;</span>
              </button>
              <button 
                type="button" 
                class="btn-replay font-mono" 
                @click="replaySequence"
              >
                Replay sequence
              </button>
            </div>
            <div v-else class="pending-group">
              <button 
                type="button" 
                class="btn-skip font-mono" 
                @click="skipLoading"
              >
                Skip to terminal &rarr;
              </button>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- Quiet Bottom Meta (Clean, unboxed) -->
    <footer class="loading-bottom font-mono">
      <span>{{ activeTenant.industryName }}</span>
      <span class="equilibrium-note">Double-entry verified &bull; 0.00 variance</span>
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

    // Deliberate, perceptible pacing (~3.8 seconds total duration)
    const DURATION = 3800;

    const logSteps = computed(() => [
      {
        threshold: 25,
        text: 'Mounting distributed ledger kernel'
      },
      {
        threshold: 50,
        text: 'Verifying double-entry balance (0.00 variance)'
      },
      {
        threshold: 75,
        text: `Reconciling ${activeTenant.value.currency.code} settlement channels`
      },
      {
        threshold: 100,
        text: `${activeTenant.value.brand.complianceBadge || 'GAAP / IFRS'} compliance verified`
      }
    ]);

    const currentStepText = computed(() => {
      const p = progress.value;
      if (p < 25) return 'Mounting kernel';
      if (p < 50) return 'Checking invariants';
      if (p < 75) return 'Reconciling channels';
      if (p < 100) return 'Finalizing verification';
      return 'System verified';
    });

    // Custom multi-stage easing for organic, human-perceptible pacing
    const stepAnimation = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      // Multi-stage pacing curve: rapid initial rise, deliberate pauses on milestones, smooth final lock
      let eased;
      if (t < 0.25) {
        // 0 -> 25% over first 800ms
        eased = (t / 0.25) * 0.25;
      } else if (t < 0.55) {
        // 25% -> 55% over next 1100ms
        const progressInStage = (t - 0.25) / 0.3;
        eased = 0.25 + (Math.sin(progressInStage * Math.PI / 2) * 0.3);
      } else if (t < 0.85) {
        // 55% -> 85% over next 1100ms
        const progressInStage = (t - 0.55) / 0.3;
        eased = 0.55 + (Math.sin(progressInStage * Math.PI / 2) * 0.3);
      } else {
        // 85% -> 100% smooth landing over final 800ms
        const progressInStage = (t - 0.85) / 0.15;
        eased = 0.85 + (Math.sin(progressInStage * Math.PI / 2) * 0.15);
      }

      progress.value = Math.min(eased * 100, 100);

      if (t < 1) {
        animationFrame = requestAnimationFrame(stepAnimation);
      } else {
        progress.value = 100;
        if (route.query.auto === 'true') {
          setTimeout(() => {
            enterSystem();
          }, 500);
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
      currentStepText,
      enterSystem,
      skipLoading,
      replaySequence
    };
  }
});
</script>

<style scoped>
/* ==========================================================================
   Emil Kowalski Inspired Loading Philosophy:
   Quiet, restrained, zero noise, pure typography, spring physics.
   ========================================================================== */

.loading-root {
  min-height: 100vh;
  width: 100%;
  background: #09090b;
  color: #f4f4f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
  padding: 40px 24px;
  box-sizing: border-box;
}

/* Subtle, ultra-diffuse ambient depth (no grain, no scanlines) */
.ambient-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 320px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

/* Centered Stage */
.loading-center {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.content-stack {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* 1. Pure Floating Logo (ZERO BORDERS, ZERO BOXES) */
.logo-presence {
  margin-bottom: 24px;
}

.pure-logo {
  height: 44px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4));
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.loading-root:not(.is-complete) .pure-logo {
  animation: logo-float 4s ease-in-out infinite;
}

/* 2. Brand Identity */
.brand-presence {
  margin-bottom: 32px;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fafafa;
  margin: 0 0 4px;
}

.brand-sub {
  font-weight: 400;
  color: #a1a1aa;
}

.brand-edition {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #71717a;
  margin: 0;
}

/* 3. Hairline Progress Track */
.progress-presence {
  width: 100%;
  margin-bottom: 24px;
}

.progress-track {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: #f4f4f5;
  transform-origin: left center;
  transition: transform 0.1s linear;
  border-radius: 2px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.step-label {
  color: #71717a;
  letter-spacing: 0.02em;
}

.number-label {
  color: #d4af37;
  font-weight: 600;
}

/* 4. Quiet Monospace Audit Feed (Pure typography, no container box) */
.telemetry-feed {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
  text-align: left;
  margin-bottom: 32px;
  padding: 0 2px;
}

.feed-line {
  display: flex;
  align-items: baseline;
  font-size: 11px;
  letter-spacing: -0.01em;
  transition: opacity 0.3s ease, color 0.3s ease;
}

.feed-code {
  color: #52525b;
  margin-right: 10px;
  font-size: 10px;
}

.feed-text {
  flex: 1;
  color: #71717a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feed-status {
  margin-left: 8px;
  font-size: 10px;
}

.feed-line.feed-done .feed-text {
  color: #e4e4e7;
}

.feed-line.feed-done .status-done {
  color: #10b981;
}

.feed-line.feed-active .feed-text {
  color: #d4af37;
}

.feed-line.feed-active .status-active {
  color: #d4af37;
  animation: pulse-dot 1.2s infinite;
}

.feed-line.feed-pending {
  opacity: 0.25;
}

.feed-line.feed-pending .status-pending {
  color: #3f3f46;
}

/* 5. Action Slot (Emil Kowalski style minimal buttons) */
.action-slot {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.complete-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.btn-enter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #f4f4f5;
  color: #09090b;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-enter:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.btn-enter:active {
  transform: scale(0.98);
}

.btn-enter .arrow {
  transition: transform 0.16s ease;
}

.btn-enter:hover .arrow {
  transform: translateX(2px);
}

.btn-replay {
  background: transparent;
  border: none;
  color: #71717a;
  font-size: 11px;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.15s ease;
}

.btn-replay:hover {
  color: #a1a1aa;
}

.pending-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-skip {
  background: transparent;
  border: none;
  color: #52525b;
  font-size: 11px;
  cursor: pointer;
  padding: 6px 12px;
  transition: color 0.15s ease;
}

.btn-skip:hover {
  color: #a1a1aa;
}

/* Bottom Meta */
.loading-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #52525b;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.equilibrium-note {
  color: #3f3f46;
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Emil Kowalski Spring Transitions */
.action-spring-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-spring-leave-active {
  transition: opacity 0.15s ease;
}

.action-spring-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.action-spring-leave-to {
  opacity: 0;
}
</style>
