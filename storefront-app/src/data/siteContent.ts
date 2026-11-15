import defaultProductsRaw from './defaultProducts.json';
import { LookbookEntry, Product } from '../types/store';

export function resolveAssetUrl(path?: string): string {
  if (!path) return '/assets/products/product-1.jpg';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('/')) {
    return path;
  }
  return `/${path.replace(/^\.?\//, '')}`;
}

export const VIDEO_PREVIEWS_BY_INDEX = [
  '/assets/videos/streetwear-editorial.mp4',
  '/assets/videos/streetwear-leather.mp4',
  '/assets/videos/streetwear-motion.mp4',
];

export const DEFAULT_PRODUCTS: Product[] = (defaultProductsRaw as unknown as Product[]).map((p) => ({
  ...p,
  image: resolveAssetUrl(p.image),
}));

export const LOOKBOOK_REELS: LookbookEntry[] = [
  {
    id: 'look-1',
    title: 'Concrete Brutalist Duo',
    subtitle: 'Heavyweight Box-Cut Jersey & Raw Indigo — Archival Street Study',
    caption: 'LOOK 01 // CONCRETE STREET STUDY — ARCHIVE NBO',
    image: '/assets/lookbook/look-3.jpg',
    tags: ['Gikomba Archive', 'Box-Cut Jersey'],
    year: 'DROP 01',
    location: 'NAIROBI, KE',
    isTall: true,
  },
  {
    id: 'look-2',
    title: 'Raw Selvedge & Hide',
    subtitle: 'Heavyweight Leather Patina & Night-Runway Motion Study',
    caption: 'LOOK 02 // LEATHER & PATINA STUDY — ARCHIVE NBO',
    image: '/assets/lookbook/look-leather-poster.jpg',
    video: '/assets/videos/streetwear-leather.mp4',
    tags: ['Grade A+', 'Natural Patina'],
    year: 'DROP 02',
    location: 'TOI MARKET',
    isTall: false,
  },
  {
    id: 'look-3',
    title: 'Vintage Graphic & Denim',
    subtitle: '90s Screenprint Single-Stitch Tee & Distressed Light-Wash Selvedge',
    caption: 'LOOK 03 // SINGLE-STITCH ARCHIVE — NGARA NBO',
    image: '/assets/products/product-9.jpg',
    tags: ['Single-Stitch', 'Ozone Treated'],
    year: 'DROP 03',
    location: 'NGARA // NBO',
    isTall: false,
  },
  {
    id: 'look-4',
    title: 'CDG Play & Wool Tailoring',
    subtitle: 'Japanese Archive Knit, Charcoal Pleated Trousers & Leather Low-Tops',
    caption: 'LOOK 04 // TOKYO-NAIROBI CAPSULE — WESTLANDS',
    image: '/assets/feed/feed-5.jpg',
    tags: ['Japanese Archive', '1-of-1 Capsule'],
    year: 'DROP 04',
    location: 'WESTLANDS',
    isTall: true,
  },
];

export const EDITORIAL_GALLERY = [
  { id: 'look-5', title: 'Bale Selection // 05', image: '/assets/lookbook/look-5.jpg', code: 'LKB-05' },
  { id: 'look-6', title: 'Bale Selection // 06', image: '/assets/lookbook/look-1.jpg', code: 'LKB-06' },
  { id: 'look-7', title: 'Bale Selection // 07', image: '/assets/lookbook/look-7.jpg', code: 'LKB-07' },
  { id: 'look-8', title: 'Bale Selection // 08', image: '/assets/lookbook/look-8.jpg', code: 'LKB-08' },
];

export const FAQ_ITEMS = [
  {
    num: '01',
    question: 'Why does LADHA only stock 1-of-1 pieces with no restocks?',
    answer:
      'Every garment in our archive is individually salvaged from vintage bales in Gikomba, Toi Market, and private Nairobi estates. True vintage construction—single-stitch hems, 90s colorblock paneling, broken-in 12oz canvas—cannot be mass replicated. Once claimed at checkout, a piece leaves the public vault permanently.',
  },
  {
    num: '02',
    question: 'How does the 6% Curation Protocol work?',
    answer:
      'For every 500 garments examined across Nairobi sourcing drops, roughly 470 are rejected for synthetic blends, structural flaws, stretched ribbing, or derivative cuts. Only the top 6% pass textile authentication, 130°C ozone sanitization, and flat-lay measurement indexing before hitting a live drop.',
  },
  {
    num: '03',
    question: 'How do I verify vintage sizing before buying?',
    answer:
      'Vintage tag labels shift wildly across decades and countries of manufacture. Every LADHA piece includes an interactive INCH / CM flat-measurement table (pit-to-pit, shoulder width, collar-to-hem length, waist, inseam). Measure your best-fitting garment laid flat and match numbers rather than letter tags.',
  },
  {
    num: '04',
    question: 'How fast is M-Pesa STK checkout and Nairobi courier dispatch?',
    answer:
      'Enter your Safaricom number at checkout to trigger an instant Lipa na M-Pesa STK Push (Buy Goods Till 987654) or select Cash/M-Pesa on Delivery inside Nairobi. Verified orders placed before 14:00 EAT dispatch the same day via private rider (CBD KES 200, Westlands/Kilimani KES 250, Karen KES 350). Countrywide courier takes 24–48 hours.',
  },
  {
    num: '05',
    question: 'Do I receive an official tax receipt and can I return a piece?',
    answer:
      'Yes—every completed checkout generates a downloadable KRA eTIMS Tax Invoice (PDF) with cryptographic verification details alongside your Safaricom M-Pesa receipt. Because all archival drops are singular, sales are final upon acceptance; undisclosed structural defects reported within 24 hours receive full store credit.',
  },
];

export const CURATION_STEPS = [
  {
    num: '01',
    title: 'Primary Bale Sorting — Gikomba & Toi',
    spec: '500 PIECES SCANNED / DROP',
    description:
      'Our buyers open sealed heritage bales at dawn before commercial wholesalers arrive, isolating natural fibers, selvedge looms, heavy fleece, and era-authentic graphic prints.',
    image: '/assets/products/product-10.jpg',
  },
  {
    num: '02',
    title: 'Grade Authentication & Rejection Filter',
    spec: '94% REJECTED ON SITE',
    description:
      'We inspect stitch density, zipper hardware (YKK, Talon, Scovill), dye fastness, and fabric weight. Any compromised seam, warp, or fast-fashion label is immediately filtered out.',
    image: '/assets/products/product-11.jpg',
  },
  {
    num: '03',
    title: '130°C Ozone Sanitization & Restoration',
    spec: 'CLINICAL ARCHIVE PREP',
    description:
      'Accepted garments undergo antibacterial steam treatment at 130°C, pH-neutral delicate soaking to lock original pigments, and hand-steamed blocking in our Kilimani studio.',
    image: '/assets/products/product-12.jpg',
  },
  {
    num: '04',
    title: 'Flat-Lay Telemetry & Live Vault Release',
    spec: 'IN / CM VERIFIED SPECS',
    description:
      'Each piece is photographed, laser-measured to 0.5cm tolerance in both inches and centimeters, tagged with provenance notes, and released strictly 1-of-1 to the digital floor.',
    image: '/assets/products/product-13.jpg',
  },
];

export const GRADING_MATRIX = [
  {
    grade: 'GRADE A+ (MINT / NOS)',
    score: '9.5 – 10 / 10',
    characteristics: 'Deadstock or near-immaculate condition, crisp collar ribbing, full pigment saturation, zero flaws.',
  },
  {
    grade: 'GRADE A (ARCHIVE PRIME)',
    score: '8.8 – 9.4 / 10',
    characteristics: 'Gentle uniform vintage fade, broken-in hand feel, intact seams, authentic honeycombs or cuffs.',
  },
  {
    grade: 'ARCHIVE DISTRESSED',
    score: '8.0 – 8.7 / 10',
    characteristics: 'Intentional sun fade, micro-frayed hems, or workwear paint splatters verified as structural aesthetic.',
  },
];
