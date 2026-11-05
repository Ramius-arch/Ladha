/**
 * SaaS Industry White-Label Presets & Benchmark Configuration
 * 
 * Provides out-of-the-box business domain profiles for fast adaptation without rebuilding UI:
 * - d2c_archival: Archival Streetwear & High-Velocity D2C (LADHA Benchmark Default)
 * - b2b_saas: B2B Cloud & Subscription Enterprise OS
 * - logistics_freight: Supply Chain, Haulage & Cross-Border Freight
 * - healthcare_clinic: Medical Practice & Diagnostic Billing
 * - creative_agency: Turnkey Consultancy, Design & Engineering Retainers
 */

export const SAAS_PRESETS = {
  d2c_archival: {
    key: 'd2c_archival',
    industryName: 'Archival D2C & Luxury Commerce',
    brand: {
      name: 'LADHA',
      accent: 'Ledger',
      tagline: '"You handle the craft. We\'ll handle the count."',
      edition: 'FINANCIAL OS v2.4',
      logo: '/assets/logo.png',
      avatarLabel: 'LD Controller',
      systemState: '99.98% NOMINAL',
      complianceBadge: 'KRA eTIMS',
      complianceSub: 'REAL-TIME SYNC',
      syncLatency: '18MS',
      engineVersion: 'LEDGER ENGINE v2.4'
    },
    currency: {
      code: 'KES',
      symbol: 'KES',
      prefix: 'KES ',
      suffix: '',
      locale: 'en-KE'
    },
    terminology: {
      heroTitle: 'Financial Intelligence Hub',
      heroNarrative: 'Autonomous settlement reconciliation, 1-of-1 archival streetwear locks, and real-time double-entry trial balance.',
      customerLabel: 'VIP Shoppers',
      customerSingular: 'Shopper',
      volumeLabel: 'Drops Dispatched',
      volumeUnit: 'Drops',
      primaryMetric: 'Sales GMV',
      secondaryMetric: 'Average Basket Value',
      settlementChannel: 'M-Pesa STK Push',
      syncTitle: 'M-PESA LEDGER SYNC'
    },
    kpiCards: [
      {
        id: 'gmv',
        title: 'Sales GMV',
        prefix: 'KES ',
        suffix: '',
        value: 113000,
        trend: 18.5,
        color: '#d4af37',
        icon: 'dollar-circle-outlined'
      },
      {
        id: 'customers',
        title: 'Nairobi VIP Shoppers',
        prefix: '',
        suffix: '',
        value: 12,
        trend: 12.2,
        color: '#06b6d4',
        icon: 'usergroup-add-outlined'
      },
      {
        id: 'aov',
        title: 'Average Basket Value',
        prefix: 'KES ',
        suffix: '',
        value: 4036,
        trend: 14.8,
        color: '#10b981',
        icon: 'credit-card-outlined'
      },
      {
        id: 'volume',
        title: '30-Day Drops Dispatched',
        prefix: '',
        suffix: ' Drops',
        value: 28,
        trend: 25.0,
        color: '#f59e0b',
        icon: 'file-done-outlined'
      }
    ],
    serviceMix: {
      labels: [
        'Archival Retail & Fashion',
        'Courier & Logistics Tariffs',
        'M-Pesa Merchant Settlement',
        'SaaS API & Utilities'
      ],
      data: [45, 25, 20, 10],
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']
    },
    actions: {
      audit: {
        title: 'Audit Settlements',
        desc: 'Reconcile M-Pesa STK',
        badge: 'LIVE'
      },
      sweep: {
        title: 'Sweep Holds',
        desc: 'Release expired locks',
        badge: '1-of-1'
      },
      balance: {
        title: 'Trial Balance',
        desc: 'Verify double-entry',
        badge: '0.00 VAR'
      },
      dossier: {
        title: 'Diligence Pack',
        desc: 'Bank Loans & VC Dossier',
        badge: 'PDF'
      }
    }
  },

  b2b_saas: {
    key: 'b2b_saas',
    industryName: 'B2B Cloud & Subscription OS',
    brand: {
      name: 'VERTEX',
      accent: 'Cloud',
      tagline: '"Frictionless recurring billing. Instant revenue recognition."',
      edition: 'SUBSCRIPTION OS v4.1',
      logo: '/assets/logo.png',
      avatarLabel: 'RevOps Lead',
      systemState: '99.99% NOMINAL',
      complianceBadge: 'SOC 2 TYPE II',
      complianceSub: 'REV-REC READY',
      syncLatency: '12MS',
      engineVersion: 'ASC 606 ENGINE v4.1'
    },
    currency: {
      code: 'USD',
      symbol: '$',
      prefix: '$',
      suffix: '',
      locale: 'en-US'
    },
    terminology: {
      heroTitle: 'Revenue Operations Hub',
      heroNarrative: 'Automated subscription metering, multi-seat proration, churn risk heuristics, and double-entry GAAP revenue recognition.',
      customerLabel: 'Active Subscribers',
      customerSingular: 'Account',
      volumeLabel: 'Provisioned Seats',
      volumeUnit: 'Seats',
      primaryMetric: 'Monthly Recurring (MRR)',
      secondaryMetric: 'Average Revenue / Account',
      settlementChannel: 'Stripe & Wire ACH',
      syncTitle: 'STRIPE STRATIFIED LEDGER'
    },
    kpiCards: [
      {
        id: 'gmv',
        title: 'Monthly Recurring (MRR)',
        prefix: '$',
        suffix: '',
        value: 84500,
        trend: 22.4,
        color: '#6366f1',
        icon: 'dollar-circle-outlined'
      },
      {
        id: 'customers',
        title: 'Enterprise Accounts',
        prefix: '',
        suffix: '',
        value: 148,
        trend: 16.8,
        color: '#06b6d4',
        icon: 'usergroup-add-outlined'
      },
      {
        id: 'aov',
        title: 'Average Revenue / Account',
        prefix: '$',
        suffix: '',
        value: 571,
        trend: 8.5,
        color: '#10b981',
        icon: 'credit-card-outlined'
      },
      {
        id: 'volume',
        title: 'Active Workstation Seats',
        prefix: '',
        suffix: ' Seats',
        value: 1420,
        trend: 29.3,
        color: '#f59e0b',
        icon: 'file-done-outlined'
      }
    ],
    serviceMix: {
      labels: [
        'Enterprise Core Licenses',
        'Developer API Overages',
        'Dedicated Cloud Addons',
        'Professional Implementation'
      ],
      data: [55, 20, 15, 10],
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']
    },
    actions: {
      audit: {
        title: 'Audit Invoices',
        desc: 'Reconcile Stripe & ACH',
        badge: 'LIVE'
      },
      sweep: {
        title: 'Proration Sweep',
        desc: 'Reconcile seat delta',
        badge: 'SYNC'
      },
      balance: {
        title: 'Rev-Rec Balance',
        desc: 'Verify ASC 606 parity',
        badge: '0.00 VAR'
      },
      dossier: {
        title: 'SaaS Metrics Pack',
        desc: 'LTV, CAC & Rule of 40',
        badge: 'PDF'
      }
    }
  },

  logistics_freight: {
    key: 'logistics_freight',
    industryName: 'Logistics, Haulage & Supply Chain',
    brand: {
      name: 'CARGOGRID',
      accent: 'Ledger',
      tagline: '"From dispatch to customs clearance. Audited at every axle."',
      edition: 'SUPPLY CHAIN OS v3.2',
      logo: '/assets/logo.png',
      avatarLabel: 'Fleet Director',
      systemState: '99.95% NOMINAL',
      complianceBadge: 'CUSTOMS 24H',
      complianceSub: 'E-WAYBILL SYNC',
      syncLatency: '24MS',
      engineVersion: 'ESCROW ENGINE v3.2'
    },
    currency: {
      code: 'USD',
      symbol: '$',
      prefix: '$',
      suffix: '',
      locale: 'en-US'
    },
    terminology: {
      heroTitle: 'Freight Billing & Escrow Hub',
      heroNarrative: 'Cross-border freight billing, dynamic fuel tariff indexation, carrier escrow release, and automated demurrage reconciliation.',
      customerLabel: 'Shippers & Consignees',
      customerSingular: 'Shipper',
      volumeLabel: 'Waybills Dispatched',
      volumeUnit: 'Waybills',
      primaryMetric: 'Gross Freight Volume',
      secondaryMetric: 'Average Haul Rate',
      settlementChannel: 'Carrier Escrow & Wire',
      syncTitle: 'ESCROW CLEARING SYNC'
    },
    kpiCards: [
      {
        id: 'gmv',
        title: 'Gross Freight Volume',
        prefix: '$',
        suffix: '',
        value: 238000,
        trend: 19.1,
        color: '#0284c7',
        icon: 'dollar-circle-outlined'
      },
      {
        id: 'customers',
        title: 'Commercial Shippers',
        prefix: '',
        suffix: '',
        value: 64,
        trend: 11.5,
        color: '#06b6d4',
        icon: 'usergroup-add-outlined'
      },
      {
        id: 'aov',
        title: 'Average Haul Rate',
        prefix: '$',
        suffix: '',
        value: 3718,
        trend: 6.8,
        color: '#10b981',
        icon: 'credit-card-outlined'
      },
      {
        id: 'volume',
        title: 'Waybills Cleared',
        prefix: '',
        suffix: ' Waybills',
        value: 64,
        trend: 14.2,
        color: '#f59e0b',
        icon: 'file-done-outlined'
      }
    ],
    serviceMix: {
      labels: [
        'Interstate Long-Haul Freight',
        'Port Demurrage & Storage',
        'Fuel Surcharge Index (FSC)',
        'Customs Brokerage Tariffs'
      ],
      data: [50, 22, 18, 10],
      colors: ['#0284c7', '#06b6d4', '#10b981', '#f59e0b']
    },
    actions: {
      audit: {
        title: 'Audit Waybills',
        desc: 'Reconcile bill of lading',
        badge: 'LIVE'
      },
      sweep: {
        title: 'Release Escrow',
        desc: 'Disburse driver payouts',
        badge: 'CLEARED'
      },
      balance: {
        title: 'Trial Balance',
        desc: 'Verify shipper receivables',
        badge: '0.00 VAR'
      },
      dossier: {
        title: 'Fleet Audit Pack',
        desc: 'Asset & Operating Metrics',
        badge: 'PDF'
      }
    }
  },

  healthcare_clinic: {
    key: 'healthcare_clinic',
    industryName: 'Healthcare & Clinical Practice',
    brand: {
      name: 'PULSE',
      accent: 'Ledger',
      tagline: '"Patient care first. Flawless claim adjudication."',
      edition: 'CLINICAL OS v1.8',
      logo: '/assets/logo.png',
      avatarLabel: 'Clinic Admin',
      systemState: '99.99% NOMINAL',
      complianceBadge: 'HIPAA & MOH',
      complianceSub: 'E-CLAIMS VERIFIED',
      syncLatency: '15MS',
      engineVersion: 'CLAIMS ENGINE v1.8'
    },
    currency: {
      code: 'USD',
      symbol: '$',
      prefix: '$',
      suffix: '',
      locale: 'en-US'
    },
    terminology: {
      heroTitle: 'Clinical Billing & Claims Hub',
      heroNarrative: 'Direct insurer claim adjudication, patient co-pay settlement, medical coding audits, and real-time ledger balancing.',
      customerLabel: 'Active Patients',
      customerSingular: 'Patient',
      volumeLabel: 'Clinical Encounters',
      volumeUnit: 'Encounters',
      primaryMetric: 'Clinical Collections',
      secondaryMetric: 'Average Encounter Fee',
      settlementChannel: 'Insurer EDI & Card',
      syncTitle: 'HEALTH INSURER EDI SYNC'
    },
    kpiCards: [
      {
        id: 'gmv',
        title: 'Clinical Collections',
        prefix: '$',
        suffix: '',
        value: 164200,
        trend: 14.3,
        color: '#0d9488',
        icon: 'dollar-circle-outlined'
      },
      {
        id: 'customers',
        title: 'Registered Patients',
        prefix: '',
        suffix: '',
        value: 412,
        trend: 9.7,
        color: '#06b6d4',
        icon: 'usergroup-add-outlined'
      },
      {
        id: 'aov',
        title: 'Average Encounter Fee',
        prefix: '$',
        suffix: '',
        value: 398,
        trend: 4.2,
        color: '#10b981',
        icon: 'credit-card-outlined'
      },
      {
        id: 'volume',
        title: 'Diagnostic Encounters',
        prefix: '',
        suffix: ' Encounters',
        value: 412,
        trend: 18.0,
        color: '#f59e0b',
        icon: 'file-done-outlined'
      }
    ],
    serviceMix: {
      labels: [
        'Specialist Consultations',
        'Diagnostic Imaging & Lab',
        'Pharmacy & Infusion Dispense',
        'Preventive Health Retainers'
      ],
      data: [40, 30, 20, 10],
      colors: ['#0d9488', '#06b6d4', '#10b981', '#f59e0b']
    },
    actions: {
      audit: {
        title: 'Audit EDI Claims',
        desc: 'Reconcile insurer remittances',
        badge: 'LIVE'
      },
      sweep: {
        title: 'Sweep Co-Pays',
        desc: 'Reconcile front-desk cash',
        badge: 'SETTLED'
      },
      balance: {
        title: 'Trial Balance',
        desc: 'Verify provider accounts',
        badge: '0.00 VAR'
      },
      dossier: {
        title: 'MOH Audit Pack',
        desc: 'Statutory Healthcare Report',
        badge: 'PDF'
      }
    }
  },

  creative_agency: {
    key: 'creative_agency',
    industryName: 'Creative Agency & Studio Retainers',
    brand: {
      name: 'STUDIO',
      accent: 'Metric',
      tagline: '"Visionary creative work. Institutional cashflow clarity."',
      edition: 'AGENCY OS v2.1',
      logo: '/assets/logo.png',
      avatarLabel: 'Managing Partner',
      systemState: '99.98% NOMINAL',
      complianceBadge: 'GAAP REV-REC',
      complianceSub: 'MILESTONES AUDITED',
      syncLatency: '14MS',
      engineVersion: 'MILESTONE ENGINE v2.1'
    },
    currency: {
      code: 'USD',
      symbol: '$',
      prefix: '$',
      suffix: '',
      locale: 'en-US'
    },
    terminology: {
      heroTitle: 'Agency Retainer & Capital Hub',
      heroNarrative: '60-30-10 milestone billing, contractor margin auditing, reimbursable disbursement sweeps, and double-entry escrow tracking.',
      customerLabel: 'Retained Clients',
      customerSingular: 'Client',
      volumeLabel: 'Milestones Completed',
      volumeUnit: 'Milestones',
      primaryMetric: 'Retainer GMV',
      secondaryMetric: 'Average Project Retainer',
      settlementChannel: '60-30-10 & Wire Transfer',
      syncTitle: 'ESCROW MILESTONE SYNC'
    },
    kpiCards: [
      {
        id: 'gmv',
        title: 'Retainer GMV',
        prefix: '$',
        suffix: '',
        value: 195000,
        trend: 28.4,
        color: '#8b5cf6',
        icon: 'dollar-circle-outlined'
      },
      {
        id: 'customers',
        title: 'Retained Enterprise Brands',
        prefix: '',
        suffix: '',
        value: 18,
        trend: 12.5,
        color: '#06b6d4',
        icon: 'usergroup-add-outlined'
      },
      {
        id: 'aov',
        title: 'Average Project Retainer',
        prefix: '$',
        suffix: '',
        value: 10833,
        trend: 15.6,
        color: '#10b981',
        icon: 'credit-card-outlined'
      },
      {
        id: 'volume',
        title: 'Milestones Invoiced',
        prefix: '',
        suffix: ' Milestones',
        value: 24,
        trend: 20.0,
        color: '#f59e0b',
        icon: 'file-done-outlined'
      }
    ],
    serviceMix: {
      labels: [
        'Brand Identity & Systems',
        'Custom Web & App Engineering',
        'Turnkey Strategic Retainers',
        'Reimbursable Outlays'
      ],
      data: [42, 33, 15, 10],
      colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    },
    actions: {
      audit: {
        title: 'Audit Milestones',
        desc: 'Reconcile 60-30-10 tranches',
        badge: 'LIVE'
      },
      sweep: {
        title: 'Disburse Margins',
        desc: 'Release contractor escrow',
        badge: 'ESCROW'
      },
      balance: {
        title: 'Trial Balance',
        desc: 'Verify deferred retainer rev',
        badge: '0.00 VAR'
      },
      dossier: {
        title: 'Agency Credit Pack',
        desc: 'Commercial Bank Facility',
        badge: 'PDF'
      }
    }
  }
};
