import { ShoppingBag, LayoutDashboard, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../store/useStore";

export function Header() {
  const cart = useStore((state) => state.cart);
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-5xl flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white p-2 rounded-lg">
            <Store size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">TEA FLOW POS</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {!isAdmin ? (
            <>
              <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">後台管理</span>
              </Link>
              <div className="relative cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition-colors">
                <ShoppingBag size={24} className="text-slate-700" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-emerald-600 rounded-full border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </div>
            </>
          ) : (
            <Link to="/" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <Store size={18} />
              <span>返回前台</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
