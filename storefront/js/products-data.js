/**
 * LADHA — Curated Product Catalog Data
 * Each piece is singular (1-of-1) with authentic vintage measurements.
 * Supports dual-unit inspection (Inches & Centimeters) inspired by Atelier Paris.
 */

const LADHA_PRODUCTS = [
  {
    id: "product-1",
    name: "Vintage Nike Colorblock Windbreaker",
    category: "STREETWEAR",
    price: 3500,
    image: "assets/products/product-1.jpg",
    condition: "Grade A Vintage (9.5/10)",
    conditionNote: "Original 90s white-tag era. Pristine nylon shell, fully functional YKK zip, crisp elastic cuffs.",
    size: "L (Boxy 90s Cut)",
    measurements: {
      pitToPit: "24.5 in (62 cm)",
      length: "27.5 in (70 cm)",
      shoulder: "22.0 in (56 cm)",
      sleeve: "25.0 in (63.5 cm)"
    },
    measurementsIn: {
      "PIT TO PIT": "24.5 in",
      "TOTAL LENGTH": "27.5 in",
      "SHOULDER WIDTH": "22.0 in",
      "SLEEVE LENGTH": "25.0 in"
    },
    measurementsCm: {
      "PIT TO PIT": "62.0 cm",
      "TOTAL LENGTH": "70.0 cm",
      "SHOULDER WIDTH": "56.0 cm",
      "SLEEVE LENGTH": "63.5 cm"
    },
    fabric: "100% Ripstop Nylon / Breathable Poly Mesh Lining",
    provenance: "Sourced in Gikomba. Era: c. 1993–1996.",
    description: "Iconic geometric paneling featuring deep royal navy, vibrant cyan, and crisp white angular chevrons. The definition of golden-era Nike track aesthetic.",
    inStock: true
  },
  {
    id: "product-2",
    name: "Oversized Acid Washed Denim Jacket",
    category: "WOMEN'S",
    price: 2800,
    image: "assets/products/product-2.jpg",
    condition: "Distressed Vintage (9.0/10)",
    conditionNote: "Natural edge fraying on collar and hem. Heavy-weight authentic 14oz raw denim.",
    size: "M/L (Drop Shoulder Relaxed)",
    measurements: {
      pitToPit: "23.0 in (58.5 cm)",
      length: "26.0 in (66 cm)",
      shoulder: "20.5 in (52 cm)",
      sleeve: "23.5 in (60 cm)"
    },
    measurementsIn: {
      "PIT TO PIT": "23.0 in",
      "TOTAL LENGTH": "26.0 in",
      "SHOULDER WIDTH": "20.5 in",
      "SLEEVE LENGTH": "23.5 in"
    },
    measurementsCm: {
      "PIT TO PIT": "58.5 cm",
      "TOTAL LENGTH": "66.0 cm",
      "SHOULDER WIDTH": "52.0 cm",
      "SLEEVE LENGTH": "60.0 cm"
    },
    fabric: "100% Heavyweight Cotton Denim (Non-stretch)",
    provenance: "Sourced in Toi Market. Vintage washed patina.",
    description: "Heavily marble-washed with authentic 90s wear. Features reinforced brass shank buttons and dual flap utility chest pockets.",
    inStock: true
  },
  {
    id: "product-3",
    name: "Ralph Lauren Classic Oxford Shirt",
    category: "MEN'S",
    price: 1500,
    image: "assets/products/product-3.jpg",
    condition: "Near Mint (9.8/10)",
    conditionNote: "Crisp collar roll, immaculate mother-of-pearl buttons, zero collar fray.",
    size: "M (Standard Tailored Fit)",
    measurements: {
      pitToPit: "21.5 in (54.5 cm)",
      length: "30.0 in (76 cm)",
      shoulder: "18.5 in (47 cm)",
      sleeve: "25.5 in (65 cm)"
    },
    measurementsIn: {
      "PIT TO PIT": "21.5 in",
      "TOTAL LENGTH": "30.0 in",
      "SHOULDER WIDTH": "18.5 in",
      "SLEEVE LENGTH": "25.5 in"
    },
    measurementsCm: {
      "PIT TO PIT": "54.5 cm",
      "TOTAL LENGTH": "76.0 cm",
      "SHOULDER WIDTH": "47.0 cm",
      "SLEEVE LENGTH": "65.0 cm"
    },
    fabric: "100% Yarn-Dyed Oxford Cotton Weave",
    provenance: "Sourced in Nairobi. Single-needle tailored construction.",
    description: "Fine light-blue and white Bengal stripe with navy embroidered pony emblem at chest. Perfect relaxed drape worn open or buttoned.",
    inStock: true
  },
  {
    id: "product-4",
    name: "90s Levi's 501 Raw Selvedge",
    category: "VINTAGE",
    price: 4200,
    image: "assets/products/product-4.jpg",
    condition: "Grade A Vintage (9.2/10)",
    conditionNote: "Authentic honeycombs behind knees, light whiskers at lap. Button fly intact.",
    size: "W32 / L32",
    measurements: {
      waist: "32.0 in (81 cm)",
      inseam: "32.0 in (81 cm)",
      rise: "11.5 in (29 cm)",
      legOpening: "8.0 in (20 cm)"
    },
    measurementsIn: {
      "WAIST WIDTH": "32.0 in",
      "INSEAM LENGTH": "32.0 in",
      "FRONT RISE": "11.5 in",
      "LEG OPENING": "8.0 in"
    },
    measurementsCm: {
      "WAIST WIDTH": "81.0 cm",
      "INSEAM LENGTH": "81.0 cm",
      "FRONT RISE": "29.0 cm",
      "LEG OPENING": "20.0 cm"
    },
    fabric: "100% Rigid Indigo Denim",
    provenance: "Manufactured in San Francisco, USA. c. 1994.",
    description: "The benchmark of denim history. Straight-leg cut with classic copper rivets and signature red tab. Unrepeatable natural indigo fading.",
    inStock: true
  },
  {
    id: "product-5",
    name: "Carhartt Duck Double-Knee Work Pants",
    category: "STREETWEAR",
    price: 3000,
    image: "assets/products/product-5.jpg",
    condition: "Workwear Vintage (8.8/10)",
    conditionNote: "Wabi-sabi fading on knees, soft broken-in duck canvas with zero structural rips.",
    size: "W34 / L30",
    measurements: {
      waist: "34.0 in (86 cm)",
      inseam: "30.0 in (76 cm)",
      rise: "12.0 in (30.5 cm)",
      legOpening: "9.0 in (23 cm)"
    },
    measurementsIn: {
      "WAIST WIDTH": "34.0 in",
      "INSEAM LENGTH": "30.0 in",
      "FRONT RISE": "12.0 in",
      "LEG OPENING": "9.0 in"
    },
    measurementsCm: {
      "WAIST WIDTH": "86.0 cm",
      "INSEAM LENGTH": "76.0 cm",
      "FRONT RISE": "30.5 cm",
      "LEG OPENING": "23.0 cm"
    },
    fabric: "12oz 100% Ring-Spun Cotton Duck Canvas",
    provenance: "Sourced in Ngara. Heavy brass zip fly.",
    description: "Rugged double-front chap panels with rivet reinforcements. Utility hammer loop and dual tool pockets for pure streetwear utility.",
    inStock: true
  },
  {
    id: "product-6",
    name: "Minimalist Bias-Cut Silk Midi Skirt",
    category: "WOMEN'S",
    price: 1800,
    image: "assets/products/product-6.jpg",
    condition: "Grade A+ (9.7/10)",
    conditionNote: "Lustrous heavy crepe-back silk satin. Elastic hidden waistband, zero snags.",
    size: "S/M (Fluid Draping)",
    measurements: {
      waist: "26–29 in (Elasticized 66–74 cm)",
      length: "33.0 in (84 cm)",
      hip: "38.0 in (96 cm)"
    },
    measurementsIn: {
      "WAIST (ELASTIC)": "26.0–29.0 in",
      "TOTAL LENGTH": "33.0 in",
      "HIP SWEEP": "38.0 in"
    },
    measurementsCm: {
      "WAIST (ELASTIC)": "66.0–74.0 cm",
      "TOTAL LENGTH": "84.0 cm",
      "HIP SWEEP": "96.0 cm"
    },
    fabric: "100% Mulberry Silk Charmeuse",
    provenance: "Sourced in Westlands curated private collection.",
    description: "Cut on the bias to hug the silhouette with fluid liquid movement. Pairs effortlessly with chunky boots, oversized knitwear, or minimalist sandals.",
    inStock: true
  },
  {
    id: "product-7",
    name: "Timberland Heavyweight Plaid Flannel",
    category: "MEN'S",
    price: 2200,
    image: "assets/products/product-7.jpg",
    condition: "Grade A (9.4/10)",
    conditionNote: "Brushed heavyweight weave, ultra-soft hand feel. Engraved faux-horn buttons.",
    size: "XL (Oversized Grunge Fit)",
    measurements: {
      pitToPit: "25.5 in (65 cm)",
      length: "31.0 in (79 cm)",
      shoulder: "21.5 in (55 cm)",
      sleeve: "26.0 in (66 cm)"
    },
    measurementsIn: {
      "PIT TO PIT": "25.5 in",
      "TOTAL LENGTH": "31.0 in",
      "SHOULDER WIDTH": "21.5 in",
      "SLEEVE LENGTH": "26.0 in"
    },
    measurementsCm: {
      "PIT TO PIT": "65.0 cm",
      "TOTAL LENGTH": "79.0 cm",
      "SHOULDER WIDTH": "55.0 cm",
      "SLEEVE LENGTH": "66.0 cm"
    },
    fabric: "100% Brushed Cotton Twill Flannel",
    provenance: "Sourced in Gikomba outer bales.",
    description: "Classic forest green, rust amber, and deep navy buffalo plaid. Heavy enough to function as an overshirt jacket across cool Nairobi evenings.",
    inStock: true
  },
  {
    id: "product-8",
    name: "Champion Reverse Weave Hoodie",
    category: "VINTAGE",
    price: 3800,
    image: "assets/products/product-8.jpg",
    condition: "Grade A Vintage (9.3/10)",
    conditionNote: "Substantial 12oz cross-grain fleece. Ribbed stretch side gussets. C logo patch on wrist.",
    size: "L (Authentic Boxy Athletic Fit)",
    measurements: {
      pitToPit: "24.0 in (61 cm)",
      length: "28.0 in (71 cm)",
      shoulder: "20.5 in (52 cm)",
      sleeve: "25.0 in (63.5 cm)"
    },
    measurementsIn: {
      "PIT TO PIT": "24.0 in",
      "TOTAL LENGTH": "28.0 in",
      "SHOULDER WIDTH": "20.5 in",
      "SLEEVE LENGTH": "25.0 in"
    },
    measurementsCm: {
      "PIT TO PIT": "61.0 cm",
      "TOTAL LENGTH": "71.0 cm",
      "SHOULDER WIDTH": "52.0 cm",
      "SLEEVE LENGTH": "63.5 cm"
    },
    fabric: "82% Cotton, 18% Polyester Heavyweight Fleece",
    provenance: "c. late 90s athletic issue.",
    description: "Cut across the grain to resist vertical shrinkage. Features double-ply hood, oversized pouch pocket, and robust 4-inch wrist cuffs.",
    inStock: true
  },
  {
    id: "product-9",
    name: "Stüssy Tribe Archive Graphic Tee",
    category: "STREETWEAR",
    price: 1200,
    image: "assets/products/product-9.jpg",
    condition: "Grade A (9.1/10)",
    conditionNote: "Single-stitched sleeves and hem. Light vintage fade on screenprint, no pit stains.",
    size: "M (True Vintage Boxy)",
    measurements: {
      pitToPit: "21.0 in (53 cm)",
      length: "28.5 in (72 cm)",
      shoulder: "19.5 in (49.5 cm)"
    },
    measurementsIn: {
      "PIT TO PIT": "21.0 in",
      "TOTAL LENGTH": "28.5 in",
      "SHOULDER WIDTH": "19.5 in"
    },
    measurementsCm: {
      "PIT TO PIT": "53.0 cm",
      "TOTAL LENGTH": "72.0 cm",
      "SHOULDER WIDTH": "49.5 cm"
    },
    fabric: "100% Combed Heavy Cotton",
    provenance: "Sourced in Toi Market.",
    description: "Classic International Stüssy Tribe screenprint on washed charcoal black jersey. The definitive core of worldwide skate and street culture.",
    inStock: true
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = LADHA_PRODUCTS;
}
