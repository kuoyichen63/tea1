export interface Product {
  id?: string;
  name: string;
  category: string;
  priceL: number;
  priceBottle: number | null;
  isRecommended: boolean;
  isLimited: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  size: 'L' | 'Bottle';
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}
