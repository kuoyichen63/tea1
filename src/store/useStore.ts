import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  tags?: string[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  ice: string;
  sugar: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  status: OrderStatus;
  createdAt: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];

  // Cart actions
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Order actions
  placeOrder: (customerName: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // App reset
  resetOrders: () => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: '極上307', description: '獨家307輕焙烏龍 (清香/厚)', price: 37, tags: ['Featured'] },
  { id: '2', name: '舞伎406紅茶', price: 46, tags: ['Featured', 'NEW'] },
  { id: '3', name: '大地覺醒紅茶', price: 35 },
  { id: '4', name: '茶花油切甘露', description: '三印綠茶配方', price: 40 },
  { id: '5', name: '晨香綠茶', price: 35 },
  { id: '6', name: '明日清爽茶', price: 35, tags: ['Recommended'] },
  { id: '7', name: '焙煎黑烏龍', price: 35 },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      cart: [],
      orders: [],

      addToCart: (item) => set((state) => ({
        cart: [...state.cart, { ...item, cartItemId: Date.now().toString() }]
      })),

      removeFromCart: (cartItemId) => set((state) => ({
        cart: state.cart.filter((item) => item.cartItemId !== cartItemId)
      })),

      clearCart: () => set({ cart: [] }),

      placeOrder: (customerName) => {
        const { cart, clearCart } = get();
        if (cart.length === 0) return;

        const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        
        const newOrder: Order = {
          id: Math.random().toString(36).substring(2, 9).toUpperCase(),
          items: cart,
          totalAmount,
          customerName,
          status: 'pending',
          createdAt: Date.now(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
        
        clearCart();
      },

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) => 
          order.id === orderId ? { ...order, status } : order
        )
      })),

      resetOrders: () => set({ orders: [] })
    }),
    {
      name: 'bubble-tea-storage',
    }
  )
);
