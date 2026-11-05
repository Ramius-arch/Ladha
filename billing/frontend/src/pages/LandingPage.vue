<template>
  <div class="landing-root" ref="rootElement">
    <!-- 1. Ambient Cinematic Video / Veo Atmospheric Layer -->
    <div class="ambient-media-layer" aria-hidden="true">
      <video 
        v-if="ambientVideoActive"
        ref="ambientVideoRef"
        class="ambient-video-stream" 
        autoplay 
        loop 
        muted 
        playsinline
        poster="/assets/cinematic/scene1_midnight.jpg"
      >
        <source src="/assets/videos/ambient_texture.mp4" type="video/mp4" />
      </video>
      <!-- Atmospheric Gradient Scrim & Vignette -->
      <div class="ambient-scrim"></div>
      <div class="ambient-radial-glow"></div>
      <div class="ambient-film-grain"></div>
    </div>

    <!-- 2. Minimalist Luxury Header -->
    <header class="landing-header">
      <div class="header-inner">
        <router-link to="/" class="brand-group">
          <div class="brand-logo-frame">
            <img src="/assets/logo.png" alt="LADHA Logo" class="brand-logo" />
          </div>
          <div class="brand-text-block">
            <span class="brand-name font-mono">LADHA <span class="brand-accent">Ledger</span></span>
            <span class="brand-sub font-mono">FINANCIAL OS v2.4</span>
          </div>
        </router-link>

        <nav class="nav-links hidden md:flex">
          <a href="#overview" class="nav-link">Overview</a>
          <a href="#interactive-preview" class="nav-link">Platform Preview</a>
          <a href="#architecture" class="nav-link">Architecture</a>
          <a href="#theatre" class="nav-link">Video Walkthrough</a>
        </nav>

        <div class="header-actions">
          <button 
            type="button" 
            class="ambient-toggle-btn"
            @click="toggleAmbientVideo"
            :title="ambientVideoActive ? 'Pause ambient motion' : 'Resume ambient motion'"
          >
            <span class="pulse-dot" :class="{ 'pulse-active': ambientVideoActive }"></span>
            <span class="hidden sm:inline font-mono text-[10px]">{{ ambientVideoActive ? 'CINEMATIC MOTION' : 'STATIC MODE' }}</span>
          </button>
          
          <router-link to="/dashboard" class="btn-launch-terminal">
            <span>ENTER TERMINAL</span>
            <span class="btn-arrow">&rarr;</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- 3. Hero Section (Introductory & Elegant) -->
    <main class="landing-main">
      <section id="overview" class="hero-section">
        <div class="hero-content">
          <div class="hero-eyebrow-pill">
            <span class="pill-dot"></span>
            <span class="font-mono">SOVEREIGN FINANCIAL OS &bull; AUTONOMOUS REVENUE ENGINE</span>
          </div>

          <h1 class="hero-headline">
            Financial Intelligence.<br />
            <span class="calligraphic-accent">In mathematical equilibrium.</span>
          </h1>

          <p class="hero-subtext">
            An autonomous double-entry billing engine, real-time multi-rail settlement auditor, and institutional diligence suite. Built for modern high-velocity commerce, subscription SaaS, and sovereign cashflow.
          </p>

          <div class="hero-cta-group">
            <router-link to="/dashboard" class="btn-primary-glow">
              <span>Launch Live Terminal</span>
              <span class="cta-arrow">&rarr;</span>
            </router-link>

            <a href="#theatre" class="btn-secondary-glass">
              <span class="play-icon">&#9658;</span>
              <span>Watch 88s Walkthrough</span>
            </a>

            <router-link to="/billing-engine" class="btn-ghost-link">
              <span>View General Ledger</span>
              <span>&nearr;</span>
            </router-link>
          </div>

          <!-- Live Audited Telemetry Strip -->
          <div class="telemetry-strip">
            <div class="telemetry-cell">
              <span class="t-label font-mono">SYSTEM STATE</span>
              <span class="t-value text-emerald-400 font-bold">
                <span class="t-dot"></span> 99.98% NOMINAL
              </span>
            </div>
            <div class="telemetry-sep"></div>
            <div class="telemetry-cell">
              <span class="t-label font-mono">DOUBLE-ENTRY LEDGER</span>
              <span class="t-value text-amber-400 font-bold">0.00 VARIANCE</span>
            </div>
            <div class="telemetry-sep"></div>
            <div class="telemetry-cell">
              <span class="t-label font-mono">SYNC LATENCY</span>
              <span class="t-value text-indigo-400 font-bold">18MS</span>
            </div>
            <div class="telemetry-sep"></div>
            <div class="telemetry-cell">
              <span class="t-label font-mono">STATUTORY AUDIT</span>
              <span class="t-value text-cyan-400 font-bold">GAAP / IFRS READY</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Interactive Live Platform Preview Stage -->
      <section id="interactive-preview" class="preview-section">
        <div class="section-header">
          <span class="section-tag font-mono">INTERACTIVE PLATFORM SIMULATOR</span>
          <h2 class="section-title">Institutional software. Zero friction.</h2>
          <p class="section-desc">
            Explore the core architectural modules live. Toggle between executive intelligence, settlement sweeps, debt underwriting, and double-entry trial balance.
          </p>
        </div>

        <div class="preview-browser-frame">
          <!-- Window Title Bar -->
          <div class="browser-top-bar">
            <div class="window-controls">
              <span class="control-dot dot-close"></span>
              <span class="control-dot dot-min"></span>
              <span class="control-dot dot-max"></span>
            </div>
            <div class="browser-address font-mono">
              <span class="lock-icon">&#128274;</span>
              <span>ladha.ledger.internal / {{ activeTabMeta.slug }}</span>
            </div>
            <div class="browser-badge font-mono">
              <span class="status-live-dot"></span>
              <span>LIVE REPLICA</span>
            </div>
          </div>

          <!-- Module Navigation Tabs -->
          <div class="browser-tabs-bar">
            <button 
              v-for="tab in previewTabs" 
              :key="tab.id"
              class="browser-tab-btn font-mono"
              :class="{ 'tab-active': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <span class="tab-index">{{ tab.num }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Interactive Module Canvas -->
          <div class="browser-body">
            <!-- TAB 1: EXECUTIVE HUB -->
            <transition name="fade-slide" mode="out-in">
              <div v-if="activeTab === 'hub'" key="hub" class="module-view view-hub">
                <div class="hub-hero-card">
                  <div class="hub-hero-left">
                    <span class="badge-tag font-mono">LEDGER ENGINE v2.4 &bull; REAL-TIME</span>
                    <h3 class="hub-title">Executive Cashflow & GMV Trajectory</h3>
                    <p class="hub-sub">Continuous settlement audit across 1-of-1 commerce and recurring subscriptions.</p>
                  </div>
                  <div class="hub-hero-right">
                    <div class="kpi-mini font-mono">
                      <span class="kpi-mini-lbl">30-DAY GMV</span>
                      <span class="kpi-mini-val text-amber-400">KES 113,000</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div class="mini-kpi-card">
                    <span class="mk-lbl font-mono">SALES GMV</span>
                    <span class="mk-val text-amber-400 font-bold">KES 113,000</span>
                    <span class="mk-trend text-emerald-400 font-mono">&uarr; +18.5%</span>
                  </div>
                  <div class="mini-kpi-card">
                    <span class="mk-lbl font-mono">ACTIVE CLIENTS</span>
                    <span class="mk-val text-cyan-400 font-bold">12 VIPs</span>
                    <span class="mk-trend text-emerald-400 font-mono">&uarr; +12.2%</span>
                  </div>
                  <div class="mini-kpi-card">
                    <span class="mk-lbl font-mono">AVERAGE BASKET</span>
                    <span class="mk-val text-emerald-400 font-bold">KES 4,036</span>
                    <span class="mk-trend text-emerald-400 font-mono">&uarr; +14.8%</span>
                  </div>
                  <div class="mini-kpi-card">
                    <span class="mk-lbl font-mono">ORDERS CLEARED</span>
                    <span class="mk-val text-orange-400 font-bold">28 Drops</span>
                    <span class="mk-trend text-emerald-400 font-mono">&uarr; +25.0%</span>
                  </div>
                </div>
              </div>

              <!-- TAB 2: COMMAND CENTER -->
              <div v-else-if="activeTab === 'command'" key="command" class="module-view view-command">
                <div class="command-grid">
                  <div class="command-card">
                    <div class="cmd-top">
                      <span class="cmd-icon">&#128260;</span>
                      <span class="cmd-badge font-mono">M-PESA STK</span>
                    </div>
                    <h4 class="cmd-title">Audit Settlements</h4>
                    <p class="cmd-desc">Autonomous match between Safaricom STK callbacks and internal Accounts Receivable (1200).</p>
                    <button class="cmd-btn" @click="simulateAction('Audit Settlements')">Run Audit Sweep &rarr;</button>
                  </div>

                  <div class="command-card">
                    <div class="cmd-top">
                      <span class="cmd-icon">&#128274;</span>
                      <span class="cmd-badge font-mono">INVENTORY LOCK</span>
                    </div>
                    <h4 class="cmd-title">Sweep Holds</h4>
                    <p class="cmd-desc">Release expired checkout reservations to guarantee 1-of-1 archival item integrity.</p>
                    <button class="cmd-btn" @click="simulateAction('Sweep Holds')">Release Holds &rarr;</button>
                  </div>

                  <div class="command-card">
                    <div class="cmd-top">
                      <span class="cmd-icon">&#128220;</span>
                      <span class="cmd-badge font-mono">DEBIT = CREDIT</span>
                    </div>
                    <h4 class="cmd-title">Trial Balance</h4>
                    <p class="cmd-desc">Mathematical proof verifying debit equals credit invariance across ledger accounts.</p>
                    <button class="cmd-btn" @click="simulateAction('Trial Balance')">Verify Equilibrium &rarr;</button>
                  </div>
                </div>
              </div>

              <!-- TAB 3: CAPITAL & UNDERWRITING -->
              <div v-else-if="activeTab === 'diligence'" key="diligence" class="module-view view-diligence">
                <div class="diligence-layout">
                  <div class="underwriting-card">
                    <div class="uc-header">
                      <span class="font-mono text-xs text-slate-400">INSTITUTIONAL CREDIT SCORECARD</span>
                      <span class="uc-grade font-mono">PRIME GRADE (2.62x DSCR)</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div class="uc-stat">
                        <span class="uc-lbl font-mono">DSCR (COVERAGE)</span>
                        <span class="uc-val text-amber-400">2.62x</span>
                        <span class="uc-bench font-mono">Bank Min: &ge; 1.25x</span>
                      </div>
                      <div class="uc-stat">
                        <span class="uc-lbl font-mono">QUICK RATIO</span>
                        <span class="uc-val text-emerald-400">3.75x</span>
                        <span class="uc-bench font-mono">Immediate Cash</span>
                      </div>
                    </div>
                  </div>

                  <div class="simulator-card">
                    <span class="font-mono text-xs text-slate-400">LOAN BORROWING POWER SIMULATOR</span>
                    <div class="sim-slider-row mt-3">
                      <span class="font-mono text-xs">Facility Amount:</span>
                      <span class="font-mono font-bold text-amber-400">KES {{ Number(simAmount).toLocaleString() }}</span>
                    </div>
                    <input 
                      type="range" 
                      min="100000" 
                      max="1000000" 
                      step="50000" 
                      v-model="simAmount" 
                      class="sim-range mt-2 w-full"
                    />
                    <div class="sim-feedback mt-3 text-xs font-mono flex justify-between text-slate-400">
                      <span>Monthly Debt Service: <b class="text-white">KES {{ Math.round(simAmount * 0.048).toLocaleString() }}</b></span>
                      <span class="text-emerald-400 font-bold">Decision: APPROVED</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB 4: GENERAL LEDGER -->
              <div v-else-if="activeTab === 'ledger'" key="ledger" class="module-view view-ledger">
                <div class="ledger-table-wrap">
                  <table class="ledger-table font-mono text-xs">
                    <thead>
                      <tr>
                        <th>ACCOUNT</th>
                        <th>NAME</th>
                        <th>CLASS</th>
                        <th class="text-right">DEBITS (KES)</th>
                        <th class="text-right">CREDITS (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1100</td>
                        <td>M-Pesa Clearing & Settlement</td>
                        <td><span class="pill-asset">ASSET</span></td>
                        <td class="text-right text-emerald-400">38,900.00</td>
                        <td class="text-right text-slate-500">-</td>
                      </tr>
                      <tr>
                        <td>2200</td>
                        <td>VAT Output Tax (16%)</td>
                        <td><span class="pill-liability">LIABILITY</span></td>
                        <td class="text-right text-slate-500">-</td>
                        <td class="text-right text-amber-400">5,365.52</td>
                      </tr>
                      <tr>
                        <td>4000</td>
                        <td>Sales Revenue</td>
                        <td><span class="pill-revenue">REVENUE</span></td>
                        <td class="text-right text-slate-500">-</td>
                        <td class="text-right text-amber-400">30,603.43</td>
                      </tr>
                      <tr>
                        <td>4100</td>
                        <td>Delivery & Logistics Tariff</td>
                        <td><span class="pill-revenue">REVENUE</span></td>
                        <td class="text-right text-slate-500">-</td>
                        <td class="text-right text-amber-400">2,931.05</td>
                      </tr>
                      <tr class="ledger-total-row font-bold">
                        <td colspan="3">EQUILIBRIUM VERIFICATION (DEBITS = CREDITS)</td>
                        <td class="text-right text-emerald-400">KES 38,900.00</td>
                        <td class="text-right text-emerald-400">KES 38,900.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>

      <!-- 5. Four Architectural Pillars (Editorial Grid) -->
      <section id="architecture" class="pillars-section">
        <div class="section-header">
          <span class="section-tag font-mono">SYSTEM INVARIANTS</span>
          <h2 class="section-title">Engineered for institutional rigor.</h2>
          <p class="section-desc">
            Four structural guarantees that eliminate human error, reconcile fragmented payment channels, and establish audit-ready clarity.
          </p>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-num font-mono">01</div>
            <h3 class="pillar-heading">Mathematical Equilibrium</h3>
            <p class="pillar-text">
              Every invoice, settlement, and customer disbursement creates balanced compound journal entries. Pure double-entry invariance guarantees zero drift across assets, liabilities, and retained earnings.
            </p>
            <div class="pillar-badge font-mono">DEBIT &equiv; CREDIT</div>
          </div>

          <div class="pillar-card">
            <div class="pillar-num font-mono">02</div>
            <h3 class="pillar-heading">Autonomous Settlement</h3>
            <p class="pillar-text">
              Instant reconciliation across mobile money (M-Pesa STK push), card networks, and bank wire transfers. Expired checkout holds and inventory reservations are automatically swept in ACID transactions.
            </p>
            <div class="pillar-badge font-mono">ZERO DRIFT SWEEP</div>
          </div>

          <div class="pillar-card">
            <div class="pillar-num font-mono">03</div>
            <h3 class="pillar-heading">Diligence & Credit Studio</h3>
            <p class="pillar-text">
              Real-time GAAP/IFRS financial statements, debt-service coverage (DSCR) modeling, and certified investor data room exports ready for commercial bank credit facilities and institutional underwriting.
            </p>
            <div class="pillar-badge font-mono">DSCR &gt; 2.50x PRIME</div>
          </div>

          <div class="pillar-card">
            <div class="pillar-num font-mono">04</div>
            <h3 class="pillar-heading">Multi-Domain SaaS Kernel</h3>
            <p class="pillar-text">
              A white-label architecture engineered to adapt to any business model — from high-velocity D2C and B2B SaaS recurring revenue, to freight haulage and clinical billing — with zero UI rewrites.
            </p>
            <div class="pillar-badge font-mono">PLUG & PLAY PRESETS</div>
          </div>
        </div>
      </section>

      <!-- 6. Video Walkthrough Showcase Theatre (Veo / HD Walkthrough) -->
      <section id="theatre" class="theatre-section">
        <div class="section-header">
          <span class="section-tag font-mono">CINEMATIC SYSTEM WALKTHROUGH</span>
          <h2 class="section-title">Watch the platform in action.</h2>
          <p class="section-desc">
            A continuous 88-second high-definition walkthrough capturing real-time telemetry, period velocity switches, command center actions, and double-entry reconciliation.
          </p>
        </div>

        <div class="theatre-container">
          <div class="theatre-video-box">
            <video 
              controls
              playsinline
              class="walkthrough-video"
              poster="/assets/cinematic/scene1_midnight.jpg"
            >
              <source src="/assets/videos/ledger_walkthrough.mp4" type="video/mp4" />
              <source src="/assets/videos/ledger_preview.gif" type="image/gif" />
              Your browser does not support HTML5 video.
            </video>
          </div>

          <div class="theatre-chapters font-mono">
            <div class="chapter-item">
              <span class="ch-time">00:00</span>
              <span class="ch-name">Executive Obsidian HUD</span>
            </div>
            <div class="chapter-item">
              <span class="ch-time">00:24</span>
              <span class="ch-name">Settlement Command Center</span>
            </div>
            <div class="chapter-item">
              <span class="ch-time">00:48</span>
              <span class="ch-name">Frosted Ceramic Light Mode</span>
            </div>
            <div class="chapter-item">
              <span class="ch-time">01:02</span>
              <span class="ch-name">Underwriting & Debt Studio</span>
            </div>
            <div class="chapter-item">
              <span class="ch-time">01:18</span>
              <span class="ch-name">Double-Entry Trial Balance</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Grand Call-To-Action Monolith -->
      <section class="cta-section">
        <div class="cta-card">
          <span class="cta-micro-badge font-mono">PRODUCTION-GRADE ARCHITECTURE</span>
          <h2 class="cta-headline">Experience the sovereign financial standard.</h2>
          <p class="cta-sub">
            Launch the interactive terminal right now to review live settlement records, trial balance equilibrium, and underwriting models.
          </p>
          <div class="cta-buttons">
            <router-link to="/dashboard" class="btn-primary-large">
              <span>ENTER LIVE TERMINAL</span>
              <span>&rarr;</span>
            </router-link>
            <router-link to="/reports" class="btn-glass-large">
              <span>EXPLORE DILIGENCE SUITE</span>
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- 8. Minimalist Editorial Footer -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <span class="footer-brand font-mono">LADHA LEDGER &bull; FINANCIAL OS</span>
          <span class="footer-tagline">Engineered for autonomous revenue, double-entry invariance, and institutional capital.</span>
        </div>

        <div class="footer-center">
          <span class="system-health-pill font-mono">
            <span class="green-dot"></span>
            ALL ENGINES NOMINAL
          </span>
        </div>

        <div class="footer-right font-mono text-xs">
          <span>&copy; {{ new Date().getFullYear() }} Quixora Solutions. All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const ambientVideoActive = ref(true);
    const ambientVideoRef = ref(null);
    const activeTab = ref('hub');
    const simAmount = ref(500000);

    const previewTabs = [
      { id: 'hub', num: '01', label: 'Executive Hub', slug: 'dashboard' },
      { id: 'command', num: '02', label: 'Command Center', slug: 'settlements' },
      { id: 'diligence', num: '03', label: 'Debt Studio', slug: 'reports' },
      { id: 'ledger', num: '04', label: 'Trial Balance', slug: 'billing-engine' }
    ];

    const activeTabMeta = computed(() => {
      return previewTabs.find(t => t.id === activeTab.value) || previewTabs[0];
    });

    const toggleAmbientVideo = () => {
      ambientVideoActive.value = !ambientVideoActive.value;
      if (ambientVideoRef.value) {
        if (ambientVideoActive.value) {
          ambientVideoRef.value.play().catch(() => {});
        } else {
          ambientVideoRef.value.pause();
        }
      }
    };

    const simulateAction = (name) => {
      alert(`[Live Action] ${name} executed successfully with 0.00 ledger variance.`);
    };

    return {
      ambientVideoActive,
      ambientVideoRef,
      activeTab,
      previewTabs,
      activeTabMeta,
      simAmount,
      toggleAmbientVideo,
      simulateAction
    };
  }
});
</script>

<style scoped>
/* ==========================================================================
   Ciangoon-Inspired Minimalist Editorial Styling
   Apple Obsidian Glass & Swiss Brutalist Typography Discipline
   ========================================================================== */

.landing-root {
  min-height: 100vh;
  background: #050811;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 1. Ambient Cinematic Layer */
.ambient-media-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ambient-video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.18;
  filter: saturate(140%) contrast(110%);
}

.ambient-scrim {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(180deg, rgba(5, 8, 17, 0.7) 0%, rgba(5, 8, 17, 0.92) 50%, #050811 100%);
}

.ambient-radial-glow {
  position: absolute;
  top: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.16) 0%, rgba(212, 175, 55, 0.06) 45%, transparent 70%);
  filter: blur(80px);
}

.ambient-film-grain {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0);
  background-size: 24px 24px;
  opacity: 0.4;
}

/* 2. Header */
.landing-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 12, 24, 0.75);
}

.header-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-logo-frame {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.brand-group:hover .brand-logo-frame {
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.3);
}

.brand-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.brand-text-block {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-name {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #d4af37;
}

.brand-name .brand-accent {
  font-weight: 600;
  color: #f8fafc;
}

.brand-sub {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #94a3b8;
  margin-top: 2px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.18s ease;
  letter-spacing: -0.01em;
}

.nav-link:hover {
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ambient-toggle-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border-radius: 9999px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.ambient-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #64748b;
}

.pulse-dot.pulse-active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
  animation: pulse-mini 2s infinite;
}

.btn-launch-terminal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(79, 70, 229, 0.9) 100%);
  color: #ffffff;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  border: 1px solid rgba(129, 140, 248, 0.5);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-launch-terminal:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
  color: #ffffff;
}

/* 3. Hero Section */
.landing-main {
  position: relative;
  z-index: 10;
}

.hero-section {
  padding: 96px 24px 72px;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d4af37;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  box-shadow: 0 0 6px rgba(212, 175, 55, 0.8);
}

.hero-headline {
  font-size: clamp(38px, 6vw, 68px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: #ffffff;
  margin-bottom: 20px;
}

.calligraphic-accent {
  font-weight: 300;
  font-style: italic;
  font-family: 'Times New Roman', serif;
  color: #94a3b8;
  letter-spacing: -0.01em;
}

.hero-subtext {
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.6;
  color: #94a3b8;
  max-width: 720px;
  margin: 0 auto 36px;
  font-weight: 400;
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 54px;
}

.btn-primary-glow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #050811;
  font-weight: 700;
  font-size: 14px;
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  color: #050811;
}

.btn-secondary-glass {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: translateY(-1px);
}

.play-icon {
  font-size: 10px;
  color: #d4af37;
}

.btn-ghost-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  padding: 14px 18px;
  text-decoration: none;
  transition: color 0.18s ease;
}

.btn-ghost-link:hover {
  color: #d4af37;
}

/* Telemetry Strip */
.telemetry-strip {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background: rgba(13, 19, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 12px 24px;
  gap: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.telemetry-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.t-label {
  font-size: 9px;
  color: #64748b;
  letter-spacing: 0.08em;
}

.t-value {
  font-size: 12px;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.t-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
}

.telemetry-sep {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
}

/* 4. Interactive Live Platform Preview Stage */
.preview-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 80px;
}

.section-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 40px;
}

.section-tag {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #6366f1;
  font-weight: 800;
  display: block;
  margin-bottom: 8px;
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin-bottom: 12px;
}

.section-desc {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.6;
}

.preview-browser-frame {
  background: rgba(9, 14, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 
    0 24px 64px -12px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(28px);
}

.browser-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: rgba(6, 10, 22, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 7px;
}

.control-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.dot-close { background: #ff5f56; }
.dot-min { background: #ffbd2e; }
.dot-max { background: #27c93f; }

.browser-address {
  font-size: 11px;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.browser-badge {
  font-size: 9.5px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
}

.browser-tabs-bar {
  display: flex;
  overflow-x: auto;
  background: rgba(8, 12, 24, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 12px 0;
  gap: 4px;
}

.browser-tab-btn {
  background: transparent;
  border: 1px solid transparent;
  border-bottom: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.tab-index {
  font-size: 10px;
  color: #64748b;
}

.browser-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.03);
}

.browser-tab-btn.tab-active {
  background: rgba(13, 19, 36, 0.95);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.browser-tab-btn.tab-active .tab-index {
  color: #d4af37;
}

.browser-body {
  padding: 28px;
  min-height: 280px;
}

/* Module Views */
.hub-hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: rgba(13, 19, 36, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.badge-tag {
  font-size: 9px;
  letter-spacing: 0.08em;
  color: #10b981;
  display: block;
  margin-bottom: 6px;
}

.hub-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
}

.hub-sub {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.kpi-mini {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.kpi-mini-lbl {
  font-size: 9px;
  color: #64748b;
}

.kpi-mini-val {
  font-size: 17px;
  font-weight: 800;
}

.mini-kpi-card {
  background: rgba(13, 19, 36, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.mk-lbl {
  font-size: 10px;
  color: #64748b;
  margin-bottom: 4px;
}

.mk-val {
  font-size: 20px;
  margin-bottom: 4px;
}

.mk-trend {
  font-size: 10px;
}

/* Command Center Tab */
.command-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.command-card {
  background: rgba(13, 19, 36, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cmd-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.cmd-icon {
  font-size: 18px;
}

.cmd-badge {
  font-size: 8.5px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.cmd-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.cmd-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}

.cmd-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.cmd-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

/* Diligence Tab */
.diligence-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.underwriting-card, .simulator-card {
  background: rgba(13, 19, 36, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
}

.uc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 10px;
}

.uc-grade {
  font-size: 10px;
  color: #10b981;
  font-weight: 800;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.uc-stat {
  display: flex;
  flex-direction: column;
}

.uc-lbl {
  font-size: 9px;
  color: #64748b;
}

.uc-val {
  font-size: 24px;
  font-weight: 800;
}

.uc-bench {
  font-size: 9px;
  color: #94a3b8;
}

/* Ledger Tab */
.ledger-table-wrap {
  overflow-x: auto;
}

.ledger-table {
  width: 100%;
  border-collapse: collapse;
}

.ledger-table th {
  padding: 10px 14px;
  color: #64748b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  font-weight: 700;
}

.ledger-table td {
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.pill-asset {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 9px;
}

.pill-liability {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 9px;
}

.pill-revenue {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 9px;
}

.ledger-total-row td {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 14px;
}

/* 5. Pillars Section */
.pillars-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.pillar-card {
  background: rgba(11, 17, 33, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.pillar-card:hover {
  background: rgba(16, 24, 46, 0.85);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.pillar-num {
  font-size: 13px;
  font-weight: 800;
  color: #d4af37;
  margin-bottom: 16px;
}

.pillar-heading {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.pillar-text {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 24px;
}

.pillar-badge {
  font-size: 9px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.08em;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* 6. Video Walkthrough Showcase Theatre */
.theatre-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 24px 90px;
}

.theatre-container {
  background: rgba(8, 12, 24, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8);
}

.theatre-video-box {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #000000;
}

.walkthrough-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.theatre-chapters {
  display: flex;
  overflow-x: auto;
  padding: 16px 20px;
  background: rgba(5, 8, 17, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  gap: 24px;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-size: 11px;
}

.ch-time {
  color: #d4af37;
  font-weight: 800;
}

.ch-name {
  color: #94a3b8;
}

/* 7. Call To Action Monolith */
.cta-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 100px;
}

.cta-card {
  text-align: center;
  padding: 64px 32px;
  background: 
    radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.18), transparent 70%),
    rgba(11, 16, 32, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.6);
}

.cta-micro-badge {
  font-size: 9.5px;
  letter-spacing: 0.14em;
  color: #d4af37;
  display: block;
  margin-bottom: 16px;
}

.cta-headline {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 14px;
}

.cta-sub {
  font-size: 16px;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 36px;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.btn-primary-large {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #050811;
  font-family: ui-monospace, monospace;
  font-size: 13px;
  font-weight: 800;
  padding: 16px 36px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.25);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.45);
  color: #050811;
}

.btn-glass-large {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  font-weight: 700;
  padding: 16px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-glass-large:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

/* 8. Footer */
.landing-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(5, 8, 17, 0.95);
  padding: 32px 24px;
}

.footer-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-brand {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #d4af37;
}

.footer-tagline {
  font-size: 11px;
  color: #64748b;
}

.system-health-pill {
  font-size: 10px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 4px 10px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.green-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.footer-right {
  color: #64748b;
}

@keyframes pulse-mini {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
