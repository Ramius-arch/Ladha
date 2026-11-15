export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  videoPreview?: string;
  condition: string;
  conditionNote: string;
  size: string;
  measurements?: Record<string, string | undefined>;
  measurementsIn?: Record<string, string | undefined>;
  measurementsCm?: Record<string, string | undefined>;
  fabric: string;
  provenance: string;
  description: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface LookbookEntry {
  id: string;
  title: string;
  subtitle: string;
  caption: string;
  image: string;
  video?: string;
  tags: string[];
  year: string;
  location: string;
  isTall?: boolean;
}

export interface StoreOrder {
  id: string;
  customerName: string;
  phone: string;
  estate: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'MPESA' | 'COD';
  mpesaReceipt: string;
  status: 'VERIFIED' | 'PENDING' | 'DISPATCHED' | string;
  createdAt: string;
}

export interface DispatchLead {
  id: string;
  name: string;
  email: string;
  interest: string;
  createdAt: string;
}
