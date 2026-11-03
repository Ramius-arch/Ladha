<template>
  <div 
    class="cinema-root" 
    ref="scrollWrapper"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    
    <!-- 1. Pinned Fullscreen Interactive Canvas (100vw x 100vh) -->
    <div class="cinema-stage">
      
      <!-- ACT I LAYER: The Midnight Study (Chiaroscuro & Parallax) -->
      <div 
        class="act-visual-plane plane-act-1" 
        :class="{ 'act-active': currentChapter === 1 }"
        :style="{ opacity: scene1Opacity }"
      >
        <img 
          src="/assets/cinematic/scene1_midnight.jpg" 
          class="act-hero-media" 
          alt="Midnight Study" 
          loading="lazy" 
          decoding="async" 
        />
        <div class="interactive-light-mesh light-tungsten"></div>
      </div>

      <!-- ACT II LAYER: The Mainframe Topology (Laser Scanline & Geometric Depth) -->
      <div 
        class="act-visual-plane plane-act-2" 
        :class="{ 'act-active': currentChapter === 2 }"
        :style="{ opacity: scene2Opacity }"
      >
        <img 
          src="/assets/cinematic/scene2_engine.jpg" 
          class="act-hero-media" 
          alt="Mainframe Architecture" 
          loading="lazy" 
          decoding="async" 
        />
        <div class="interactive-light-mesh light-cyan"></div>
      </div>

      <!-- ACT III LAYER: Lake Como Sovereignty (Atmospheric Dawn Bloom) -->
      <div 
        class="act-visual-plane plane-act-3" 
        :class="{ 'act-active': currentChapter === 3 }"
        :style="{ opacity: scene3Opacity }"
      >
        <img 
          src="/assets/cinematic/scene3_resolution.jpg" 
          class="act-hero-media" 
          alt="Dawn Sovereignty" 
          loading="lazy" 
          decoding="async" 
        />
        <div class="interactive-light-mesh light-golden"></div>
      </div>

      <!-- Subtle 35mm Grain Film Texture -->
      <div class="cinema-grain-filter"></div>

      <!-- Minimalist Luxury Navigation Header -->
      <header class="cinema-nav-bar">
        <div class="nav-brand-group">
          <img src="/assets/logo.png" alt="Ladha" class="nav-logo" />
          <span class="nav-brand-text">LADHA <span class="nav-brand-muted">LEDGER</span></span>
        </div>

        <nav class="nav-act-selector hidden md:flex">
          <button :class="['nav-act-btn', { active: currentChapter === 1 }]" @click="scrollToChapter(1)">
            <span class="act-pip"></span>
            <span>I. Archival Drops</span>
          </button>
          <button :class="['nav-act-btn', { active: currentChapter === 2 }]" @click="scrollToChapter(2)">
            <span class="act-pip"></span>
            <span>II. M-Pesa Engine</span>
          </button>
          <button :class="['nav-act-btn', { active: currentChapter === 3 }]" @click="scrollToChapter(3)">
            <span class="act-pip"></span>
            <span>III. Sovereignty</span>
          </button>
        </nav>

        <router-link to="/dashboard" class="nav-launch-terminal">
          <span>ENTER TERMINAL</span>
          <span class="terminal-arrow">&rarr;</span>
        </router-link>
      </header>

      <!-- 2. Fullscreen Kinetic Narrative Canvas -->
      <div class="cinema-narrative-stage">
        
        <!-- ACT I: THE BURDEN (Chiaroscuro Fade-In & Mouse Tilt) -->
        <transition name="morph-chiaroscuro">
          <div 
            v-if="currentChapter === 1" 
            class="act-narrative-block block-act-1"
          >
            <div class="act-eyebrow">
              <span class="eyebrow-accent accent-amber"></span>
              <span>SCENE 01 &bull; 1-OF-1 ARCHIVAL COMMERCE</span>
            </div>

            <h1 class="cinema-title">
              Rare garments.<br />
              Nairobi drops.<br />
              <span class="text-silver">The quiet power of sovereign retail.</span>
            </h1>

            <p class="cinema-prose">
              You source rare 1-of-1 archival streetwear — not to spend midnight reconciling invoices, chasing unverified M-Pesa codes, or hand-calculating KRA VAT.
            </p>

            <div class="cinematic-metrics">
              <div class="metric-item">
                <span class="m-val text-amber-200">100% Audited</span>
                <span class="m-lbl">Double-Entry Trial Balance Verification</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-item">
                <span class="m-val">KES 26,500</span>
                <span class="m-lbl">Live Drop M-Pesa Settlement Cleared</span>
              </div>
            </div>

            <div class="scroll-affordance">
              <span class="cue-icon">&darr;</span>
              <span>SCROLL TO EXPLORE ENGINE</span>
            </div>
          </div>
        </transition>

        <!-- ACT II: THE ARCHITECTURE (Laser Scanline & Telemetry Sweep) -->
        <transition name="morph-scanline">
          <div 
            v-if="currentChapter === 2" 
            class="act-narrative-block block-act-2"
          >
            <div class="act-eyebrow">
              <span class="eyebrow-accent accent-cyan"></span>
              <span>SCENE 02 &bull; AUTONOMOUS REVENUE ENGINE</span>
            </div>

            <h2 class="cinema-title">
              Instant Lipa Na M-Pesa.<br />
              <span class="text-silver">Settled directly into the general ledger.</span>
            </h2>

            <p class="cinema-prose">
              A private financial architecture built for curated fashion storefronts. Checkout reserves 1-of-1 inventory in ACID transactions and books KRA 16% Output VAT in Account 2200.
            </p>

            <div class="telemetry-hud-card">
              <div class="hud-cell">
                <span class="hud-num text-cyan-300">18ms</span>
                <span class="hud-name">Ledger Latency</span>
              </div>
              <div class="hud-cell">
                <span class="hud-num text-emerald-300">KES 0.00</span>
                <span class="hud-name">Audit Variance</span>
              </div>
              <div class="hud-cell">
                <span class="hud-num">16% KRA</span>
                <span class="hud-name">Automated Tax</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- ACT III: SOVEREIGNTY (Atmospheric Dawn Bloom) -->
        <transition name="morph-dawnbloom">
          <div 
            v-if="currentChapter === 3" 
            class="act-narrative-block block-act-3"
          >
            <div class="act-eyebrow">
              <span class="eyebrow-accent accent-gold"></span>
              <span>SCENE 03 &bull; SOVEREIGN CLARITY</span>
            </div>

            <h2 class="cinema-title-grand">
              You curate the drops.<br />
              <span class="text-silver">We govern the ledger.</span>
            </h2>

            <p class="cinema-prose">
              From Westlands to Karen. A single double-entry ledger accounts for every shilling, every courier dispatch, and every garment in audited harmony.
            </p>

            <div class="action-dock">
              <router-link to="/dashboard" class="btn-primary-monolith">
                <span>ENTER LIVE TERMINAL</span>
                <span>&rarr;</span>
              </router-link>
              <router-link to="/billing-engine" class="btn-ghost-monolith">
                <span>VIEW TRIAL BALANCE</span>
              </router-link>
            </div>
          </div>
        </transition>

      </div>

      <!-- Bottom Pacing Bar -->
      <footer class="cinema-bottom-bar">
        <span class="bar-meta">LADHA ENTERPRISE LEDGER</span>
        <div class="bar-progress-pips">
          <span :class="['progress-pip', { active: currentChapter === 1 }]"></span>
          <span :class="['progress-pip', { active: currentChapter === 2 }]"></span>
          <span :class="['progress-pip', { active: currentChapter === 3 }]"></span>
        </div>
        <span class="bar-meta">ACT 0{{ currentChapter }} OF 03</span>
      </footer>

    </div>

    <!-- Lenis Momentum Scroll Distance (300vh) -->
    <div class="lenis-scroll-container">
      <div class="scroll-chamber"></div>
      <div class="scroll-chamber"></div>
      <div class="scroll-chamber"></div>
    </div>

  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import Lenis from 'lenis';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const scrollWrapper = ref(null);
    const scrollProgress = ref(0);
    
    // Non-reactive variables to prevent 60-144fps Vue VNode re-renders
    let rawMouseX = 0;
    let rawMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    let lenisInstance = null;
    let rafId = null;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      rawMouseX = (e.clientX / innerWidth - 0.5) * 2;
      rawMouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      rawMouseX = 0;
      rawMouseY = 0;
    };

    const handleScroll = (e) => {
      const p = e.progress || 0;
      scrollProgress.value = Math.min(Math.max(p, 0), 1);
    };

    // Smooth Scene Crossfades
    const scene1Opacity = computed(() => {
      const p = scrollProgress.value;
      if (p <= 0.25) return 1;
      if (p <= 0.45) return (0.45 - p) / 0.2;
      return 0;
    });

    const scene2Opacity = computed(() => {
      const p = scrollProgress.value;
      if (p < 0.25) return 0;
      if (p < 0.45) return (p - 0.25) / 0.2;
      if (p <= 0.65) return 1;
      if (p <= 0.85) return (0.85 - p) / 0.2;
      return 0;
    });

    const scene3Opacity = computed(() => {
      const p = scrollProgress.value;
      if (p < 0.65) return 0;
      if (p < 0.85) return (p - 0.65) / 0.2;
      return 1;
    });

    const currentChapter = computed(() => {
      const p = scrollProgress.value;
      if (p < 0.35) return 1;
      if (p < 0.70) return 2;
      return 3;
    });

    const scrollToChapter = (chapter) => {
      if (!lenisInstance) return;
      const targets = { 1: 0, 2: 0.5, 3: 1 };
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (targets[chapter] || 0) * maxScroll;
      lenisInstance.scrollTo(targetScroll, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };

    onMounted(() => {
      // Initialize Lenis Momentum Physics
      try {
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5
        });

        lenisInstance.on('scroll', handleScroll);
      } catch (err) {
        console.warn('Lenis momentum scroll init skipped', err);
      }

      // Hardware-accelerated CSS custom variable updates without Vue re-renders
      function updatePhysics(time) {
        if (lenisInstance) {
          lenisInstance.raf(time);
        }

        const dx = rawMouseX - smoothMouseX;
        const dy = rawMouseY - smoothMouseY;

        if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
          smoothMouseX += dx * 0.08;
          smoothMouseY += dy * 0.08;
          if (scrollWrapper.value) {
            scrollWrapper.value.style.setProperty('--mouse-x', smoothMouseX.toFixed(3));
            scrollWrapper.value.style.setProperty('--mouse-y', smoothMouseY.toFixed(3));
          }
        }

        rafId = requestAnimationFrame(updatePhysics);
      }

      rafId = requestAnimationFrame(updatePhysics);
    });

    onUnmounted(() => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) {
        try {
          lenisInstance.destroy();
        } catch (e) {}
      }
    });

    return {
      scrollWrapper,
      scrollProgress,
      scene1Opacity,
      scene2Opacity,
      scene3Opacity,
      currentChapter,
      scrollToChapter,
      handleMouseMove,
      handleMouseLeave
    };
  }
});
</script>

<style scoped>
.cinema-root {
  background: #000000;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
  --mouse-x: 0;
  --mouse-y: 0;
}

/* 1. Fullscreen Pinned Viewport */
.cinema-stage {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 10;
}

.act-visual-plane {
  position: absolute;
  inset: -20px;
  pointer-events: none;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.plane-act-1 {
  transform: scale(1.06) translate3d(calc(var(--mouse-x, 0) * -18px), calc(var(--mouse-y, 0) * -12px), 0);
}

.plane-act-2 {
  transform: scale(1.05) translate3d(calc(var(--mouse-x, 0) * -24px), calc(var(--mouse-y, 0) * -16px), 0);
}

.plane-act-3 {
  transform: scale(1.04) translate3d(calc(var(--mouse-x, 0) * -15px), calc(var(--mouse-y, 0) * -10px), 0);
}

.act-hero-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Interactive Mouse-Tracking Light Meshes via CSS Variables */
.interactive-light-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.light-tungsten {
  background: radial-gradient(circle 600px at calc(45% + var(--mouse-x, 0) * 12%) calc(55% + var(--mouse-y, 0) * 10%), rgba(245, 158, 11, 0.12) 0%, transparent 70%), linear-gradient(to right, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0.15) 100%);
}

.light-cyan {
  background: radial-gradient(ellipse 900px 400px at calc(50% + var(--mouse-x, 0) * 15%) calc(50% + var(--mouse-y, 0) * 15%), rgba(6, 182, 212, 0.15) 0%, transparent 70%), linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 60%);
}

.light-golden {
  background: radial-gradient(circle 800px at calc(70% + var(--mouse-x, 0) * 10%) calc(35% + var(--mouse-y, 0) * 10%), rgba(254, 240, 138, 0.16) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 80%), linear-gradient(to right, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.55) 45%, rgba(0, 0, 0, 0.15) 100%);
}

/* Subtle 35mm Film Grain */
.cinema-grain-filter {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  z-index: 15;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Minimalist Floating Navigation Bar */
.cinema-nav-bar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1240px;
  height: 56px;
  padding: 0 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 50;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 15, 28, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-logo {
  height: 24px;
  width: auto;
}

.nav-brand-text {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #d4af37;
}

.nav-brand-muted {
  color: #94a3b8;
  font-size: 11px;
}

.nav-act-selector {
  display: flex;
  gap: 24px;
}

.nav-act-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.act-pip {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #64748b;
  transition: all 0.2s ease;
}

.nav-act-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-act-btn.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-act-btn.active .act-pip {
  background: #d4af37;
  box-shadow: 0 0 6px #d4af37;
}

.nav-launch-terminal {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #070c18;
  padding: 8px 18px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #d4af37;
  transition: all 0.2s ease;
}

.nav-launch-terminal:hover {
  background: #e5c158;
  transform: scale(1.02);
}

/* 2. Narrative Center Stage */
.cinema-narrative-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 8vw;
  padding-right: 8vw;
  z-index: 30;
  pointer-events: none;
}

.act-narrative-block {
  max-width: 680px;
  pointer-events: auto;
  will-change: transform, opacity;
}

.block-act-1 {
  transform: translate3d(calc(var(--mouse-x, 0) * 12px), calc(var(--mouse-y, 0) * 8px), 0);
}

.block-act-2 {
  transform: translate3d(calc(var(--mouse-x, 0) * 14px), calc(var(--mouse-y, 0) * 10px), 0);
}

.block-act-3 {
  transform: translate3d(calc(var(--mouse-x, 0) * 10px), calc(var(--mouse-y, 0) * 6px), 0);
}

.act-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 24px;
}

.eyebrow-accent {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.accent-amber { background: #d4af37; box-shadow: 0 0 10px #d4af37; }
.accent-cyan { background: #06b6d4; box-shadow: 0 0 10px #06b6d4; }
.accent-gold { background: #10b981; box-shadow: 0 0 10px #10b981; }

.cinema-title {
  font-size: clamp(34px, 4.4vw, 58px);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin: 0 0 20px 0;
}

.cinema-title-grand {
  font-size: clamp(38px, 4.8vw, 64px);
  line-height: 1.06;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: #ffffff;
  margin: 0 0 20px 0;
}

.text-silver {
  color: #94a3b8;
  font-weight: 600;
}

.cinema-prose {
  font-size: 16px;
  line-height: 1.65;
  color: #cbd5e1;
  max-width: 540px;
  margin-bottom: 32px;
}

/* Metrics Row */
.cinematic-metrics {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 18px 24px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  width: fit-content;
  margin-bottom: 32px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-val {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  font-feature-settings: "tnum";
}

.m-lbl {
  font-size: 11px;
  color: #64748b;
  letter-spacing: 0.02em;
}

.metric-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
}

.scroll-affordance {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.16em;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.cue-icon {
  font-size: 14px;
  animation: bounceSlow 2s infinite ease-in-out;
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* Telemetry Card */
.telemetry-hud-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px 24px;
  border-radius: 14px;
  background: rgba(10, 15, 28, 0.75);
  border: 1px solid rgba(6, 182, 212, 0.25);
  box-shadow: 0 0 30px -10px rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(16px);
  max-width: 520px;
}

.hud-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hud-num {
  font-size: 22px;
  font-weight: 800;
  font-feature-settings: "tnum";
}

.hud-name {
  font-size: 11px;
  color: #64748b;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Action Monolith Buttons */
.action-dock {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary-monolith {
  padding: 14px 28px;
  border-radius: 10px;
  background: #d4af37;
  color: #070c18;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 10px 25px -8px rgba(212, 175, 55, 0.4);
}

.btn-primary-monolith:hover {
  background: #e5c158;
  transform: translateY(-2px);
}

.btn-ghost-monolith {
  padding: 14px 24px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
}

.btn-ghost-monolith:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Bottom Bar */
.cinema-bottom-bar {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1240px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 40;
}

.bar-meta {
  font-size: 10px;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.bar-progress-pips {
  display: flex;
  gap: 8px;
}

.progress-pip {
  width: 28px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.progress-pip.active {
  background: #d4af37;
  box-shadow: 0 0 8px #d4af37;
}

/* 3. Lenis Momentum Scroll Container */
.lenis-scroll-container {
  position: relative;
  width: 100%;
  z-index: 1;
}

.scroll-chamber {
  height: 100vh;
  width: 100%;
}

/* Morph Scene Transitions */
.morph-chiaroscuro-enter-active,
.morph-chiaroscuro-leave-active,
.morph-scanline-enter-active,
.morph-scanline-leave-active,
.morph-dawnbloom-enter-active,
.morph-dawnbloom-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.morph-chiaroscuro-enter-from,
.morph-scanline-enter-from,
.morph-dawnbloom-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.morph-chiaroscuro-leave-to,
.morph-scanline-leave-to,
.morph-dawnbloom-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
