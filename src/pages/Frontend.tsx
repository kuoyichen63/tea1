import React, { useEffect, useState } from 'react';
import { Product, CartItem, Order } from '../types';
import { subscribeToProducts, createOrder } from '../services/api';
import { format } from 'date-fns';
import { ShoppingCart, Plus, Minus, ThumbsUp, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Frontend() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToProducts(setProducts);
    return () => unsubscribe();
  }, []);

  const addToCart = (product: Product, size: 'L' | 'Bottle') => {
    const price = size === 'L' ? product.priceL : product.priceBottle;
    if (price === null) return;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id && item.size === size);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1, subtotal: item.price * (item.quantity + 1) }
            : item
        );
      } else {
        return [...prev, { productId: product.id as string, name: product.name, size, price, quantity: 1, subtotal: price }];
      }
    });
  };

  const updateQuantity = (index: number, change: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        newCart.splice(index, 1);
      } else {
        newCart[index] = { ...item, quantity: newQuantity, subtotal: item.price * newQuantity };
      }
      return newCart;
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim()) return;

    setIsSubmitting(true);
    const newOrder: Order = {
      customerName,
      items: cart,
      totalAmount,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await createOrder(newOrder);
    setCart([]);
    setCustomerName('');
    setIsSubmitting(false);
    setSuccessMessage('訂單已成功送出！ (Order placed successfully!)');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Menu Section */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-widest text-orange-950">找好茶 Original Tea</h2>
            <div className="flex gap-4 text-orange-800 font-bold">
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm"><span className="w-6 h-6 bg-orange-400 text-white rounded flex items-center justify-center text-sm">L</span> 杯裝</div>
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm"><span className="w-6 h-6 bg-orange-700 text-white rounded flex items-center justify-center text-sm">瓶</span> 瓶裝</div>
            </div>
          </div>
          
          <div className="divide-y divide-stone-100">
            {products.map((product) => (
              <div key={product.id} className="p-6 hover:bg-stone-50 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {product.isRecommended && <ThumbsUp className="w-5 h-5 text-orange-600 fill-orange-600" />}
                  <h3 className="text-xl font-medium tracking-wide text-stone-800 flex items-center gap-2">
                    {product.name}
                    {product.isLimited && (
                      <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        限量販售
                      </span>
                    )}
                  </h3>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* L Size Button */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-stone-600">${product.priceL}</span>
                    <button
                      onClick={() => addToCart(product, 'L')}
                      className="text-xs bg-orange-100 text-orange-800 px-3 py-1.5 rounded-md hover:bg-orange-200 transition font-medium"
                    >
                      + L 杯
                    </button>
                  </div>

                  {/* Bottle Size Button */}
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    {product.priceBottle ? (
                      <>
                        <span className="text-lg font-bold text-stone-600">${product.priceBottle}</span>
                        <button
                          onClick={() => addToCart(product, 'Bottle')}
                          className="text-xs bg-orange-800 text-white px-3 py-1.5 rounded-md hover:bg-orange-900 transition font-medium"
                        >
                          + 瓶裝
                        </button>
                      </>
                    ) : (
                      <span className="text-stone-300 font-bold">-</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-stone-800">
            <ShoppingCart className="w-6 h-6 text-orange-600" />
            您的購物車 / Your Cart
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>尚未加入任何飲品</p>
              <p className="text-sm">Please add some drinks</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div>
                      <div className="font-medium text-stone-800">{item.name}</div>
                      <div className="text-sm text-stone-500">
                        {item.size === 'L' ? 'L 杯裝' : '瓶裝'} · ${item.price}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-bold text-stone-800">${item.subtotal}</div>
                      <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="p-1 hover:bg-stone-100 rounded text-stone-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="p-1 hover:bg-stone-100 rounded text-stone-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="flex justify-between text-xl font-bold text-stone-900 mb-6">
                  <span>總計 Total:</span>
                  <span>${totalAmount}</span>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      顧客姓名 / Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="請輸入姓名..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? '送出中...' : '確認點單 / Checkout'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-xl flex items-center gap-2 border border-green-200 font-medium animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-5 h-5" />
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
