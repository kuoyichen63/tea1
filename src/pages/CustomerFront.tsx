import { useState } from "react";
import { Plus, Minus, X, Info, ShoppingBag } from "lucide-react";
import { useStore, Product } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const ICE_LEVELS = ["正常冰", "少冰", "微冰", "去冰", "熱"];
const SUGAR_LEVELS = ["正常糖", "少糖", "半糖", "微糖", "無糖"];

export function CustomerFront() {
  const { products, cart, addToCart, removeFromCart, placeOrder } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Customization state
  const [quantity, setQuantity] = useState(1);
  const [ice, setIce] = useState("正常冰");
  const [sugar, setSugar] = useState("正常糖");
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIce("正常冰");
    setSugar("正常糖");
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        product: selectedProduct,
        quantity,
        ice,
        sugar
      });
      setSelectedProduct(null);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-12 px-4 shadow-sm">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">用心泡好茶，現點現做</h1>
          <p className="text-slate-400 text-lg">嚴選台灣頂級茶葉，為您呈現純粹的茶香回甘。</p>
        </div>
      </div>

      {/* Menu Section */}
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          精選茗茶
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleOpenProduct(product)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                {product.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                )}
                <div className="mt-2 font-medium text-slate-900">${product.price}</div>
              </div>
              
              <Button size="icon" variant="secondary" className="rounded-full flex-shrink-0 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 cursor-pointer">
                <Plus size={20} />
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Button (Mobile) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-40">
          <Button 
            className="w-full h-14 rounded-full text-lg shadow-lg flex justify-between items-center px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 cursor-pointer"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2.5 py-1 rounded-full text-sm font-bold">{cart.length}</span>
              <span>查看購物車</span>
            </div>
            <span className="font-bold">${cartTotal}</span>
          </Button>
        </div>
      )}

      {/* Product Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h2>
                  <p className="text-emerald-600 font-semibold mt-1">${selectedProduct.price}</p>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full bg-slate-100 text-slate-500" onClick={() => setSelectedProduct(null)}>
                  <X size={20} />
                </Button>
              </div>

              {/* Options */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">冰塊</h3>
                  <div className="flex flex-wrap gap-2">
                    {ICE_LEVELS.map(level => (
                      <button
                        key={level}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-colors border cursor-pointer",
                          ice === level 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                        onClick={() => setIce(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">甜度</h3>
                  <div className="flex flex-wrap gap-2">
                    {SUGAR_LEVELS.map(level => (
                      <button
                        key={level}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-colors border cursor-pointer",
                          sugar === level 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                        onClick={() => setSugar(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <h3 className="text-sm font-semibold text-slate-700">數量</h3>
                  <div className="flex items-center gap-4 bg-slate-100 rounded-full p-1">
                    <button 
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center">{quantity}</span>
                    <button 
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 pb-8 sm:pb-4">
              <Button className="flex-1 h-14 rounded-full text-lg bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddToCart}>
                加入購物車 - ${selectedProduct.price * quantity}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 object-top">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag size={20} className="text-emerald-600" />
                購物車
              </h2>
              <Button size="icon" variant="ghost" className="rounded-full text-slate-500 hover:bg-slate-100" onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>您的購物車是空的</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 object-top relative group">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                        <div className="font-medium text-slate-900">${item.product.price * item.quantity}</div>
                      </div>
                      <div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-1.5">
                        <span className="bg-white px-2 py-0.5 rounded text-xs border border-slate-200">{item.ice}</span>
                        <span className="bg-white px-2 py-0.5 rounded text-xs border border-slate-200">{item.sugar}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 mt-2">x {item.quantity}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-8 sm:pb-6">
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium text-slate-500">總計金額</h3>
                  <h3 className="text-2xl font-bold text-emerald-600">${cartTotal}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">取餐人姓名 / 稱呼</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      placeholder="例如：王先生"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full h-14 rounded-full text-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!customerName.trim()}
                    onClick={() => {
                      placeOrder(customerName);
                      setIsCartOpen(false);
                      setCustomerName("");
                      alert("訂單已送出！請稍候叫號");
                    }}
                  >
                    確認送出訂單
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
