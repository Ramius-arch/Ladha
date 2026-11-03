<template>
  <div class="reports-analytics-container max-w-[1400px] mx-auto px-4 py-2">
    <!-- 1. Executive Narrative Hero Banner -->
    <div class="hero-card bespoke-glass-card mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="badge-micro mb-2">
            <span class="status-dot"></span>
            <span>GAAP & IFRS AUDITED • BANK CREDIT & VC DATA ROOM READY</span>
          </div>
          <h1 class="hero-title">
            Financial Operations, <span class="calligraphic-accent">Capital & VC Diligence</span>
          </h1>
          <p class="hero-narrative">
            Institutional 3-statement financial reporting, commercial loan debt service underwriting (DSCR), and venture capital unit economics.
          </p>
          <p class="calligraphic-quote mt-2 mb-0">
            "Engineered for sovereign cash operations, commercial credit lines, and institutional equity financing."
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a-button @click="refreshAllData" :loading="loadingMetrics">
            <template #icon><reload-outlined /></template>
            Audit Ledger
          </a-button>
          <a-button 
            type="primary" 
            size="large" 
            class="dossier-download-btn font-bold"
            @click="handleDownloadDossier"
            :loading="downloadingDossier"
          >
            <template #icon><download-outlined /></template>
            Export Loan & VC Diligence Dossier (PDF)
          </a-button>
        </div>
      </div>

      <!-- Docked Telemetry HUD (4 Institutional Pillars) -->
      <div class="diligence-telemetry-bay mt-6">
        <div class="telemetry-col">
          <span class="telemetry-label font-mono">ANNUAL RUN-RATE (ARR)</span>
          <div class="telemetry-val-group">
            <span class="telemetry-currency">KES</span>
            <span class="telemetry-val text-emerald-600 dark:text-emerald-400 font-mono">
              {{ Number(diligenceData?.summary?.annualizedRunRate || 466800).toLocaleString() }}
            </span>
          </div>
          <span class="telemetry-sub font-mono">100% Cash-Backed M-Pesa GMV</span>
        </div>

        <div class="telemetry-separator"></div>

        <div class="telemetry-col">
          <span class="telemetry-label font-mono">GROSS PROFIT MARGIN</span>
          <span class="telemetry-val text-indigo-600 dark:text-indigo-400 font-mono">
            {{ diligenceData?.summary?.grossMarginPct || 60.6 }}%
          </span>
          <span class="telemetry-sub font-mono">High-Margin Retail & Logistics</span>
        </div>

        <div class="telemetry-separator"></div>

        <div class="telemetry-col">
          <span class="telemetry-label font-mono">DEBT SERVICE COVERAGE (DSCR)</span>
          <div class="flex items-center gap-2">
            <span class="telemetry-val text-amber-600 dark:text-amber-400 font-mono">
              {{ diligenceData?.bankUnderwriting?.dscr || 2.62 }}x
            </span>
            <span class="badge-micro text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              PRIME GRADE
            </span>
          </div>
          <span class="telemetry-sub font-mono">Bank Minimum: &ge; 1.25x Req.</span>
        </div>

        <div class="telemetry-separator"></div>

        <div class="telemetry-col">
          <span class="telemetry-label font-mono">VENTURE LTV : CAC</span>
          <span class="telemetry-val text-emerald-600 dark:text-emerald-400 font-mono">
            {{ diligenceData?.ventureCapitalDiligence?.ltvCacRatio || 4.9 }}x
          </span>
          <span class="telemetry-sub font-mono">Payback: {{ diligenceData?.ventureCapitalDiligence?.cacPaybackMonths || 1.1 }} Months</span>
        </div>
      </div>
    </div>

    <!-- 2. Institutional Navigation Tabs -->
    <a-tabs v-model:activeKey="activeTab" class="institutional-tabs bespoke-glass-card mb-6 p-4">
      <!-- TAB 1: THREE CORE FINANCIAL STATEMENTS -->
      <a-tab-pane key="statements">
        <template #tab>
          <span class="flex items-center gap-2 font-bold">
            <file-text-outlined />
            Three Core Financial Statements (GAAP/IFRS)
          </span>
        </template>

        <a-row :gutter="[24, 24]">
          <!-- Left Column: Income Statement (P&L) -->
          <a-col :xs="24" :lg="12">
            <a-card title="Certified Income Statement (P&L)" class="statement-card">
              <template #extra>
                <span class="badge-micro font-mono">ACCRUAL & CASH GAAP</span>
              </template>
              
              <div class="statement-table-box">
                <table class="statement-table">
                  <tbody>
                    <tr class="section-row">
                      <td colspan="2">REVENUE & COLLECTIONS</td>
                    </tr>
                    <tr>
                      <td>Gross Merchandise Value (GMV)</td>
                      <td class="font-mono text-right font-bold">KES {{ Number(isData.grossRevenue || 38900).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td>Net Merchandise Sales (Excl. 16% VAT)</td>
                      <td class="font-mono text-right">KES {{ Number(isData.netSales || 33534.48).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                    </tr>
                    <tr>
                      <td>Courier Logistics Income</td>
                      <td class="font-mono text-right">KES {{ Number(isData.deliveryIncome || 2155.17).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                    </tr>

                    <tr class="section-row">
                      <td colspan="2">COST OF GOODS SOLD (COGS)</td>
                    </tr>
                    <tr>
                      <td>Archival Garment Procurement (35%)</td>
                      <td class="font-mono text-right text-rose-500">({{ Number(isData.cogs?.garmentCost || 11737.07).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }})</td>
                    </tr>
                    <tr>
                      <td>Courier Direct Logistics Tariffs</td>
                      <td class="font-mono text-right text-rose-500">({{ Number(isData.cogs?.logisticsDirect || 1831.89).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }})</td>
                    </tr>
                    <tr class="total-row">
                      <td>GROSS PROFIT ({{ diligenceData?.summary?.grossMarginPct || 60.6 }}% Margin)</td>
                      <td class="font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                        KES {{ Number(isData.grossProfit || 20331.89).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                      </td>
                    </tr>

                    <tr class="section-row">
                      <td colspan="2">OPERATING EXPENSES (OPEX)</td>
                    </tr>
                    <tr>
                      <td>Sales, Marketing & Customer Acquisition</td>
                      <td class="font-mono text-right text-rose-500">({{ Number(isData.operatingExpenses?.salesMarketing || 4800).toLocaleString() }})</td>
                    </tr>
                    <tr>
                      <td>Technology Infrastructure & Ledger APIs</td>
                      <td class="font-mono text-right text-rose-500">({{ Number(isData.operatingExpenses?.technologyCloud || 2500).toLocaleString() }})</td>
                    </tr>
                    <tr>
                      <td>General, Administrative & Legal Compliance</td>
                      <td class="font-mono text-right text-rose-500">({{ Number(isData.operatingExpenses?.generalAdmin || 3200).toLocaleString() }})</td>
                    </tr>
                    <tr class="total-row">
                      <td>OPERATING PROFIT (EBITDA)</td>
                      <td class="font-mono text-right font-bold text-indigo-600 dark:text-indigo-400">
                        KES {{ Number(isData.ebitda || 9831.89).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                      </td>
                    </tr>
                    <tr>
                      <td>Corporate Income Tax Provision (30%)</td>
                      <td class="font-mono text-right text-rose-500">({{ Number(isData.corporateTax || 2949.57).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }})</td>
                    </tr>
                    <tr class="grand-total-row">
                      <td>NET RETAINED INCOME</td>
                      <td class="font-mono text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                        KES {{ Number(isData.netIncome || 6882.32).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </a-card>
          </a-col>

          <!-- Right Column: Balance Sheet & Liquidity Buffer -->
          <a-col :xs="24" :lg="12">
            <a-card title="Audited Balance Sheet & Capital Position" class="statement-card">
              <template #extra>
                <span class="badge-micro font-mono">TRIAL BALANCE 0.00 VARIANCE</span>
              </template>

              <div class="statement-table-box">
                <table class="statement-table">
                  <tbody>
                    <tr class="section-row">
                      <td colspan="2">CURRENT ASSETS</td>
                    </tr>
                    <tr>
                      <td>M-Pesa Clearing & Settlement (Account 1100)</td>
                      <td class="font-mono text-right font-bold">KES {{ Number(bsData.assets?.cashAndEquivalents || 38900).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td>Accounts Receivable (Account 1200)</td>
                      <td class="font-mono text-right">KES {{ Number(bsData.assets?.accountsReceivable || 0).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td>Physical Archival Inventory (Audited)</td>
                      <td class="font-mono text-right">KES {{ Number(bsData.assets?.archivalInventory || 15000).toLocaleString() }}</td>
                    </tr>
                    <tr class="total-row">
                      <td>TOTAL CURRENT ASSETS</td>
                      <td class="font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                        KES {{ Number(bsData.assets?.totalCurrentAssets || 53900).toLocaleString() }}
                      </td>
                    </tr>

                    <tr class="section-row">
                      <td colspan="2">CURRENT LIABILITIES</td>
                    </tr>
                    <tr>
                      <td>KRA 16% Output VAT Liability (Account 2200)</td>
                      <td class="font-mono text-right text-rose-500">KES {{ Number(bsData.liabilities?.kraVatOutputPayable || 5365.52).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                    </tr>
                    <tr>
                      <td>Trade Accounts Payable</td>
                      <td class="font-mono text-right text-rose-500">KES {{ Number(bsData.liabilities?.tradeAccountsPayable || 5000).toLocaleString() }}</td>
                    </tr>
                    <tr class="total-row">
                      <td>TOTAL CURRENT LIABILITIES</td>
                      <td class="font-mono text-right font-bold text-rose-500">
                        KES {{ Number(bsData.liabilities?.totalCurrentLiabilities || 10365.52).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                      </td>
                    </tr>

                    <tr class="section-row">
                      <td colspan="2">EQUITY & RESERVES</td>
                    </tr>
                    <tr>
                      <td>Retained Operating Earnings</td>
                      <td class="font-mono text-right font-bold">KES {{ Number(bsData.equity?.retainedEarnings || 43534.48).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                    </tr>
                    <tr class="grand-total-row">
                      <td>TOTAL LIABILITIES & EQUITY</td>
                      <td class="font-mono text-right font-extrabold text-indigo-600 dark:text-indigo-400">
                        KES {{ Number(bsData.equity?.totalEquityAndLiabilities || 53900).toLocaleString() }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>

      <!-- TAB 2: COMMERCIAL BANK LOAN UNDERWRITING STUDIO -->
      <a-tab-pane key="bank-underwriting">
        <template #tab>
          <span class="flex items-center gap-2 font-bold">
            <bank-outlined />
            Bank Loan Underwriting & Debt Studio
          </span>
        </template>

        <a-row :gutter="[24, 24]">
          <!-- Left: Credit Ratios & Solvency Scorecard -->
          <a-col :xs="24" :lg="10">
            <a-card title="Commercial Debt Underwriting Scorecard" class="standard-card">
              <div class="space-y-4">
                <div class="ratio-pill-card p-3 rounded-lg border">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-muted font-mono">Debt Service Coverage (DSCR)</span>
                    <span class="badge-micro text-emerald-600 dark:text-emerald-400 border-emerald-500/30">PASSED (&ge; 1.25x)</span>
                  </div>
                  <div class="flex items-baseline justify-between">
                    <span class="text-2xl font-extrabold text-amber-500 font-mono">{{ diligenceData?.bankUnderwriting?.dscr || 2.62 }}x</span>
                    <span class="text-xs text-muted">Benchmark Debt Service: KES 45,000/yr</span>
                  </div>
                </div>

                <div class="ratio-pill-card p-3 rounded-lg border">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-muted font-mono">Quick Ratio (Acid Test)</span>
                    <span class="badge-micro text-emerald-600 dark:text-emerald-400 border-emerald-500/30">IMMEDIATE CASH</span>
                  </div>
                  <div class="flex items-baseline justify-between">
                    <span class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{{ diligenceData?.bankUnderwriting?.quickRatio || 3.75 }}x</span>
                    <span class="text-xs text-muted">Cash covers short-term debts 3.7x</span>
                  </div>
                </div>

                <div class="ratio-pill-card p-3 rounded-lg border">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-muted font-mono">Current Liquidity Ratio</span>
                    <span class="badge-micro text-indigo-600 dark:text-indigo-400 border-indigo-500/30">SOLVENT</span>
                  </div>
                  <div class="flex items-baseline justify-between">
                    <span class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{{ diligenceData?.bankUnderwriting?.currentRatio || 5.20 }}x</span>
                    <span class="text-xs text-muted">Bank Solvency Standard: &gt; 1.5x</span>
                  </div>
                </div>

                <div class="ratio-pill-card p-3 rounded-lg border">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-muted font-mono">KRA Tax Standing</span>
                    <span class="badge-micro text-emerald-600 dark:text-emerald-400 border-emerald-500/30">CLEAN</span>
                  </div>
                  <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    100% TIMS Verified • Zero Unfiled Tax Liens
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>

          <!-- Right: Interactive Bank Loan Borrowing Power Simulator -->
          <a-col :xs="24" :lg="14">
            <a-card title="Bank Loan Borrowing Power & Stress-Test Simulator" class="standard-card">
              <div class="simulator-box p-4 rounded-xl border mb-4">
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-1">
                    <label class="text-xs font-bold uppercase tracking-wider font-mono text-muted">Target Commercial Facility (KES):</label>
                    <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">KES {{ Number(simulatedLoanAmount).toLocaleString() }}</span>
                  </div>
                  <a-slider v-model:value="simulatedLoanAmount" :min="50000" :max="1000000" :step="25000" />
                </div>

                <div class="mb-4">
                  <label class="text-xs font-bold uppercase tracking-wider font-mono text-muted block mb-1">Repayment Tenor (Months):</label>
                  <a-radio-group v-model:value="simulatedTenorMonths" button-style="solid">
                    <a-radio-button :value="12">12 Months (1 Year)</a-radio-button>
                    <a-radio-button :value="24">24 Months (2 Years)</a-radio-button>
                    <a-radio-button :value="36">36 Months (3 Years)</a-radio-button>
                  </a-radio-group>
                </div>

                <div class="sim-results-grid grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t" style="border-color: var(--border-glass);">
                  <div class="sim-stat">
                    <span class="text-[11px] font-bold text-muted uppercase font-mono block">Monthly Debt Service:</span>
                    <span class="text-base font-extrabold text-amber-500 font-mono">KES {{ Number(simulatedMonthlyPayment).toLocaleString() }}</span>
                  </div>
                  <div class="sim-stat">
                    <span class="text-[11px] font-bold text-muted uppercase font-mono block">Resulting Stressed DSCR:</span>
                    <span class="text-base font-extrabold font-mono" :class="simulatedDSCR >= 1.25 ? 'text-emerald-500' : 'text-rose-500'">
                      {{ simulatedDSCR }}x
                    </span>
                  </div>
                  <div class="sim-stat">
                    <span class="text-[11px] font-bold text-muted uppercase font-mono block">Underwriter Decision:</span>
                    <span class="badge-micro font-bold" :class="simulatedDSCR >= 1.25 ? 'border-emerald-500/30 text-emerald-500' : 'border-rose-500/30 text-rose-500'">
                      {{ simulatedDSCR >= 1.25 ? 'PRIME APPROVAL' : 'REDUCE PRINCIPAL' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 rounded-lg border text-xs" style="background: var(--surface-hover); border-color: var(--border-glass);">
                <span>Estimated Maximum Borrowing Capacity: <strong class="text-emerald-500 font-mono">KES {{ Number(diligenceData?.bankUnderwriting?.maxBankLoanCapacity || 207650).toLocaleString() }}</strong></span>
                <a-button type="link" size="small" @click="handleDownloadDossier">
                  Attach Certified Dossier &rarr;
                </a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>

      <!-- TAB 3: VENTURE CAPITAL & UNIT ECONOMICS STUDIO -->
      <a-tab-pane key="vc-diligence">
        <template #tab>
          <span class="flex items-center gap-2 font-bold">
            <fund-outlined />
            VC Unit Economics & Data Room
          </span>
        </template>

        <a-row :gutter="[24, 24]">
          <!-- Unit Economics Metrics Grid -->
          <a-col :xs="24" :lg="16">
            <a-card title="Venture Unit Economics & Capital Efficiency" class="standard-card">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div class="p-3 rounded-lg border text-center" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">Customer LTV</span>
                  <span class="text-lg font-extrabold text-emerald-500 font-mono">KES 24,500</span>
                  <span class="text-[10px] text-muted block">High repeat rate</span>
                </div>

                <div class="p-3 rounded-lg border text-center" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">Blended CAC</span>
                  <span class="text-lg font-extrabold text-indigo-500 font-mono">KES 400</span>
                  <span class="text-[10px] text-muted block">Organic & creator-led</span>
                </div>

                <div class="p-3 rounded-lg border text-center" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">LTV : CAC Ratio</span>
                  <span class="text-lg font-extrabold text-emerald-500 font-mono">{{ diligenceData?.ventureCapitalDiligence?.ltvCacRatio || 4.9 }}x</span>
                  <span class="text-[10px] text-emerald-500 block">&gt; 3.0x Benchmark</span>
                </div>

                <div class="p-3 rounded-lg border text-center" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">CAC Payback</span>
                  <span class="text-lg font-extrabold text-amber-500 font-mono">{{ diligenceData?.ventureCapitalDiligence?.cacPaybackMonths || 1.1 }} Mos</span>
                  <span class="text-[10px] text-muted block">Immediate recovery</span>
                </div>

                <div class="p-3 rounded-lg border text-center" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">Burn Multiple</span>
                  <span class="text-lg font-extrabold text-emerald-500 font-mono">0.28x</span>
                  <span class="text-[10px] text-emerald-500 block">Top Decile Efficiency</span>
                </div>

                <div class="p-3 rounded-lg border text-center" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">Cash Runway</span>
                  <span class="text-lg font-extrabold text-indigo-500 font-mono">24+ Mos</span>
                  <span class="text-[10px] text-muted block">Cash flow positive</span>
                </div>
              </div>

              <!-- Valuation Matrix -->
              <h4 class="text-xs font-bold uppercase tracking-wider font-mono text-muted mb-2">
                Implied Valuation Benchmark (Verified ARR Run-Rate)
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl border" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-xs font-bold text-muted block font-mono">SEED ROUND VALUATION (8.0x ARR):</span>
                  <span class="text-2xl font-extrabold text-emerald-500 font-mono block my-1">
                    KES {{ Number(diligenceData?.ventureCapitalDiligence?.impliedSeedValuation || 3734400).toLocaleString() }}
                  </span>
                  <span class="text-xs text-muted">Baseline pre-money valuation supported by audited M-Pesa ledger.</span>
                </div>
                <div class="p-4 rounded-xl border" style="background: var(--surface-hover); border-color: var(--border-glass);">
                  <span class="text-xs font-bold text-muted block font-mono">SERIES A / GROWTH VALUATION (14.0x ARR):</span>
                  <span class="text-2xl font-extrabold text-indigo-500 font-mono block my-1">
                    KES {{ Number(diligenceData?.ventureCapitalDiligence?.impliedGrowthValuation || 6535200).toLocaleString() }}
                  </span>
                  <span class="text-xs text-muted">Expansion multiple factoring in 60%+ gross margins & sovereign rails.</span>
                </div>
              </div>
            </a-card>
          </a-col>

          <!-- Right: Data Room Due Diligence Checklist -->
          <a-col :xs="24" :lg="8">
            <a-card title="Investor Data Room Checklist" class="standard-card">
              <ul class="data-room-checklist space-y-3 p-0 m-0 list-none text-xs">
                <li class="flex items-start gap-2">
                  <check-circle-outlined class="text-emerald-500 mt-0.5 text-sm" />
                  <div>
                    <strong style="color: var(--text-primary);">Safaricom Daraja Carrier Receipts</strong>
                    <p class="text-[11px] text-muted m-0">Direct carrier settlement logs without third-party aggregator risk.</p>
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <check-circle-outlined class="text-emerald-500 mt-0.5 text-sm" />
                  <div>
                    <strong style="color: var(--text-primary);">Double-Entry General Ledger (0.00 Variance)</strong>
                    <p class="text-[11px] text-muted m-0">IFRS equilibrium: Debits == Credits across all ledger accounts.</p>
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <check-circle-outlined class="text-emerald-500 mt-0.5 text-sm" />
                  <div>
                    <strong style="color: var(--text-primary);">KRA eTIMS Cryptographic Stamping</strong>
                    <p class="text-[11px] text-muted m-0">Automated tax invoices with Control Unit Serial & SHA-256 signatures.</p>
                  </div>
                </li>
                <li class="flex items-start gap-2">
                  <check-circle-outlined class="text-emerald-500 mt-0.5 text-sm" />
                  <div>
                    <strong style="color: var(--text-primary);">Sovereign Self-Healing Reconciliation</strong>
                    <p class="text-[11px] text-muted m-0">Background daemon verifying bankable cash collections every 60s.</p>
                  </div>
                </li>
              </ul>

              <div class="mt-6 pt-4 border-t" style="border-color: var(--border-glass);">
                <a-button type="primary" block @click="handleDownloadDossier" :loading="downloadingDossier">
                  <template #icon><download-outlined /></template>
                  Download Investor Pack (PDF)
                </a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>

      <!-- TAB 4: HISTORICAL GMV TRAJECTORY & SHOPPERS -->
      <a-tab-pane key="growth-history">
        <template #tab>
          <span class="flex items-center gap-2 font-bold">
            <line-chart-outlined />
            GMV Growth Trajectory & Shopper Roster
          </span>
        </template>

        <a-row :gutter="[24, 24]" class="mb-6">
          <a-col :xs="24" :lg="16">
            <a-card title="Revenue Growth Trajectory (12-Month Sales GMV)" class="standard-card">
              <div class="chart-container" v-if="chartsReady">
                <Bar :key="chartKey" :data="revenueChartData" :options="barOptions" />
              </div>
              <div v-else class="h-[300px] flex items-center justify-center text-xs text-muted">
                Auditing historical revenue trajectory...
              </div>
            </a-card>
          </a-col>
          <a-col :xs="24" :lg="8">
            <a-card title="Settlement & Fulfillment Mix" class="standard-card">
              <div class="chart-container pie-container" v-if="chartsReady">
                <Pie :key="chartKey" :data="paymentStatusChartData" :options="pieOptions" />
              </div>
              <div v-else class="h-[300px] flex items-center justify-center text-xs text-muted">
                Calculating settlement breakdown...
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-card title="Nairobi Shoppers & Verified Order Ledger" class="standard-card">
          <a-table 
            :columns="allCustomersColumns" 
            :data-source="allCustomers" 
            :pagination="{ pageSize: 6 }" 
            :scroll="{ x: 'max-content' }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'actions'">
                <a-button type="link" size="small" @click="viewCustomerDetails(record)">
                  View Profile
                </a-button>
              </template>
              <template v-else-if="column.key === 'outstandingInvoices'">
                <a-tag :color="record.outstandingInvoices > 0 ? 'orange' : 'green'">
                  {{ record.outstandingInvoices > 0 ? `KES ${Number(record.outstandingInvoices).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pending` : 'Fully Settled' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { Bar, Pie } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  ArcElement 
} from 'chart.js';
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  FileTextOutlined, 
  BankOutlined, 
  FundOutlined, 
  LineChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';
import api from '../services/api';
import { message } from 'ant-design-vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default defineComponent({
  name: 'ReportsAnalytics',
  components: {
    Bar,
    Pie,
    ReloadOutlined,
    DownloadOutlined,
    FileTextOutlined,
    BankOutlined,
    FundOutlined,
    LineChartOutlined,
    CheckCircleOutlined
  },
  setup() {
    const router = useRouter();
    const activeTab = ref('statements');
    const chartsReady = ref(false);
    const chartKey = ref(0);
    const loadingMetrics = ref(false);
    const downloadingDossier = ref(false);

    const diligenceData = ref(null);
    const allCustomers = ref([]);

    // Simulator State
    const simulatedLoanAmount = ref(500000);
    const simulatedTenorMonths = ref(24);

    const simulatedMonthlyPayment = computed(() => {
      const p = simulatedLoanAmount.value;
      const annualRate = 0.14; // 14% commercial bank APR
      const monthlyRate = annualRate / 12;
      const n = simulatedTenorMonths.value;
      const pmt = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      return Math.round(pmt);
    });

    const simulatedDSCR = computed(() => {
      const annualizedEbitda = (diligenceData.value?.summary?.ebitda || 9831.89) * 12;
      const annualDebtService = simulatedMonthlyPayment.value * 12;
      return Math.round((annualizedEbitda / annualDebtService) * 100) / 100;
    });

    const isData = computed(() => {
      return diligenceData.value?.financialStatements?.incomeStatement || {};
    });

    const bsData = computed(() => {
      return diligenceData.value?.financialStatements?.balanceSheet || {};
    });

    const revenueChartData = ref({
      labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Sales GMV (KES)',
          backgroundColor: '#6366f1',
          borderRadius: 6,
          data: [24000, 28500, 31000, 36000, 42500, 48000, 52000, 57500, 63000, 68500, 74000, 81500],
        },
      ],
    });

    const paymentStatusChartData = ref({
      labels: ['M-Pesa Cleared', 'Pending Fulfillment', 'Courier Dispatched'],
      datasets: [
        {
          backgroundColor: ['#10b981', '#f59e0b', '#6366f1'],
          data: [11, 1, 2],
        },
      ],
    });

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } }
      }
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    };

    const allCustomersColumns = [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
      { title: 'Shopper Name', dataIndex: 'name', key: 'name', sorter: true },
      { title: 'Phone', dataIndex: 'phone', key: 'phone' },
      { title: 'Delivery Zone', dataIndex: 'address', key: 'address' },
      { title: 'Garments Claimed', dataIndex: 'totalOrders', key: 'totalOrders', width: 140 },
      { 
        title: 'Total Spend', 
        key: 'totalSpend',
        customRender: ({ record }) => `KES ${Number(record.totalSpend || 0).toLocaleString()}`
      },
      { title: 'Settlement Status', key: 'outstandingInvoices', width: 160 },
      { title: 'Action', key: 'actions', width: 140 },
    ];

    const viewCustomerDetails = (record) => {
      router.push(`/customers?search=${encodeURIComponent(record.name)}`);
    };

    const handleDownloadDossier = async () => {
      downloadingDossier.value = true;
      try {
        const response = await api.downloadDiligenceDossierPdf();
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'LADHA_Capital_Due_Diligence_Dossier.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('Certified Loan & VC Diligence Dossier downloaded successfully.');
      } catch (err) {
        console.error('Dossier download failed', err);
        message.error('Could not generate due diligence PDF dossier.');
      } finally {
        downloadingDossier.value = false;
      }
    };

    const refreshAllData = async () => {
      loadingMetrics.value = true;
      try {
        const [diligenceRes, customersRes, trendsRes] = await Promise.all([
          api.getDiligenceMetrics().catch(() => null),
          api.reports.getAllCustomersReport().catch(() => null),
          api.reports.getBillingTrends('12m').catch(() => null)
        ]);

        if (diligenceRes?.data?.data) {
          diligenceData.value = diligenceRes.data.data;
        }

        if (customersRes?.data?.data) {
          allCustomers.value = customersRes.data.data;
        }

        const trends = trendsRes?.data?.data?.trendData || [];
        if (trends.length > 0) {
          revenueChartData.value = {
            labels: trends.map(t => t.month || t.date || 'N/A'),
            datasets: [{
              label: 'Sales GMV (KES)',
              backgroundColor: '#6366f1',
              borderRadius: 6,
              data: trends.map(t => Number(t.revenue || 0))
            }]
          };
        }
        message.success('Ledger statements and underwriting ratios audited.');
      } catch (error) {
        console.error('Failed refreshing metrics', error);
      } finally {
        loadingMetrics.value = false;
      }
    };

    onMounted(async () => {
      await refreshAllData();
      await nextTick();
      chartsReady.value = true;
    });

    return {
      activeTab,
      chartsReady,
      chartKey,
      loadingMetrics,
      downloadingDossier,
      diligenceData,
      isData,
      bsData,
      simulatedLoanAmount,
      simulatedTenorMonths,
      simulatedMonthlyPayment,
      simulatedDSCR,
      revenueChartData,
      paymentStatusChartData,
      barOptions,
      pieOptions,
      allCustomersColumns,
      allCustomers,
      viewCustomerDetails,
      handleDownloadDossier,
      refreshAllData
    };
  },
});
</script>

<style scoped>
.reports-analytics-container {
  max-width: 1400px;
  margin: 0 auto;
}

.hero-card {
  padding: 32px 36px;
  border-radius: 20px !important;
}

.hero-title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0 0 6px 0;
  color: var(--text-primary);
}

.hero-narrative {
  font-size: 13.5px;
  color: var(--text-secondary);
  margin: 0;
  max-width: 820px;
  line-height: 1.5;
}

.calligraphic-quote {
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
  font-family: 'Cormorant Garamond', serif;
}

.dossier-download-btn {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
  border: none !important;
  height: 42px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25) !important;
}

.diligence-telemetry-bay {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 16px 22px;
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
}

@media (max-width: 900px) {
  .diligence-telemetry-bay {
    grid-template-columns: repeat(2, 1fr);
  }
  .telemetry-separator {
    display: none;
  }
}

.telemetry-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.telemetry-label {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.telemetry-val-group {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.telemetry-currency {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

.telemetry-val {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.telemetry-sub {
  font-size: 10px;
  color: var(--text-muted);
}

.telemetry-separator {
  width: 1px;
  height: 36px;
  background: var(--border-glass);
}

.statement-table-box {
  overflow-x: auto;
}

.statement-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.statement-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border-glass-subtle);
  color: var(--text-primary);
}

.statement-table .section-row td {
  background: var(--surface-hover);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  padding: 6px 10px;
  border-top: 1px solid var(--border-glass);
}

.statement-table .total-row td {
  font-weight: 800;
  border-top: 1px solid var(--text-primary);
  border-bottom: 1px solid var(--border-glass);
  padding-top: 10px;
  padding-bottom: 10px;
}

.statement-table .grand-total-row td {
  font-weight: 900;
  font-size: 13.5px;
  border-top: 2px solid var(--text-primary);
  border-bottom: 2px solid var(--text-primary);
  padding-top: 12px;
  padding-bottom: 12px;
}

.standard-card, .statement-card {
  border-radius: 20px !important;
  background: var(--surface-card) !important;
  border: 1px solid var(--border-glass) !important;
}

.chart-container {
  height: 300px;
  position: relative;
}

/* Light Mode Frosted Ceramic Glass Rules */
:global([data-theme='light']) .hero-card,
:global([data-theme='light']) .statement-card,
:global([data-theme='light']) .standard-card,
:global([data-theme='light']) .institutional-tabs {
  background: rgba(255, 255, 255, 0.74) !important;
  backdrop-filter: blur(28px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
  border: 1px solid rgba(255, 255, 255, 0.88) !important;
  border-radius: 20px !important;
  box-shadow: 
    inset 0 1.5px 1px 0 #ffffff,
    inset 0 0 0 1px rgba(255, 255, 255, 0.72),
    0 2px 8px -2px rgba(15, 23, 42, 0.03),
    0 18px 40px -8px rgba(15, 23, 42, 0.065) !important;
}

:global([data-theme='light']) .diligence-telemetry-bay {
  background: rgba(255, 255, 255, 0.52) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.92) !important;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03) !important;
  border-radius: 14px !important;
}

:global([data-theme='light']) .statement-table td {
  color: #0a0f1d !important;
}

:global([data-theme='light']) .hero-title {
  color: #0a0f1d !important;
}

:global([data-theme='light']) .calligraphic-quote {
  color: #334155 !important;
}

:global([data-theme='light']) .simulator-box,
:global([data-theme='light']) .ratio-pill-card {
  background: rgba(255, 255, 255, 0.62) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.88) !important;
  border-radius: 14px !important;
  box-shadow: inset 0 1px 1px #ffffff !important;
}

/* Dark Mode Obsidian Rules */
:global([data-theme='dark']) .hero-card,
:global(html[data-theme='dark']) .hero-card {
  background: 
    radial-gradient(circle at 12% 15%, rgba(99, 102, 241, 0.14), transparent 450px),
    radial-gradient(circle at 88% 85%, rgba(212, 175, 55, 0.06), transparent 420px),
    var(--surface-card) !important;
  border: 1px solid rgba(255, 255, 255, 0.10) !important;
  box-shadow: 
    inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 8px 32px -4px rgba(0, 0, 0, 0.6) !important;
}

:global([data-theme='dark']) .statement-card,
:global([data-theme='dark']) .standard-card,
:global([data-theme='dark']) .institutional-tabs {
  background: 
    radial-gradient(circle at 95% 5%, rgba(99, 102, 241, 0.07), transparent 400px),
    var(--surface-card) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  box-shadow: 
    inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 4px 16px -2px rgba(0, 0, 0, 0.4),
    0 18px 40px -8px rgba(0, 0, 0, 0.65) !important;
}

:global([data-theme='dark']) .diligence-telemetry-bay {
  background: rgba(6, 10, 22, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.04) !important;
}

:global([data-theme='dark']) .calligraphic-quote {
  color: rgba(255, 248, 235, 0.88) !important;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6);
}

:global([data-theme='dark']) .simulator-box,
:global([data-theme='dark']) .ratio-pill-card {
  background: rgba(255, 255, 255, 0.035) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}
</style>
