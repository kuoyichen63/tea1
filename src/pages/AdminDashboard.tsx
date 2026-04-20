import React from "react";
import { Clock, CheckCircle2, Package, RefreshCcw } from "lucide-react";
import { useStore, Order, OrderStatus } from "../store/useStore";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-600",
  preparing: "bg-emerald-50 text-emerald-600",
  ready: "bg-blue-50 text-blue-600",
  completed: "bg-slate-50 text-slate-400",
  cancelled: "bg-slate-50 text-slate-400 line-through",
};

const STATUS_LABELS = {
  pending: "待接單",
  preparing: "製作中",
  ready: "待取餐",
  completed: "已完成",
  cancelled: "已取消",
};

export function AdminDashboard() {
  const { orders, updateOrderStatus, resetOrders } = useStore();

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="text-emerald-600" /> 
              Order Queue
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Manage incoming storefront requests in real-time.</p>
          </div>

          <Button variant="outline" size="sm" onClick={() => {
            if(window.confirm('確定要清空所有訂單記錄嗎？')) {
              resetOrders();
            }
          }} className="flex items-center gap-2 text-slate-500 hover:text-red-600">
            <RefreshCcw size={16} /> 重新設定測試資料
          </Button>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              處理中訂單 ({activeOrders.length})
            </h2>
            
            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-100">
                目前沒有待處理的訂單
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                 {activeOrders.map(order => (
                   <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                 ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-slate-400" />
              歷史紀錄 ({pastOrders.length})
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-75">
               {pastOrders.map(order => (
                 <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
               ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

const OrderCard: React.FC<{ order: Order, onUpdateStatus: (id: string, status: OrderStatus) => void }> = ({ order, onUpdateStatus }) => {
  const timeStr = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-full object-top">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex gap-2 items-center mb-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[order.status]} uppercase`}>
              #{order.id} • {STATUS_LABELS[order.status]}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
               <Clock size={12} /> {timeStr}
            </span>
          </div>
          <h3 className="font-bold text-lg text-slate-800">
            {order.customerName}
          </h3>
        </div>
      </div>

      <div className="space-y-3 flex-1 mb-6">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 text-sm">
            <div className="font-bold text-slate-900 w-6 text-center bg-slate-100 rounded h-6 flex items-center justify-center">
              {item.quantity}
            </div>
            <div>
              <div className="font-medium text-slate-800">{item.product.name}</div>
              <div className="text-slate-500 text-xs">
                {item.ice} • {item.sugar}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="font-bold text-slate-800">
          總計: <span className="text-emerald-600">${order.totalAmount}</span>
        </div>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <>
               <Button size="sm" variant="outline" className="text-slate-500 font-bold border-slate-200" onClick={() => onUpdateStatus(order.id, 'cancelled')}>拒絕</Button>
               <Button size="sm" className="bg-emerald-600 text-white font-bold hover:bg-emerald-700" onClick={() => onUpdateStatus(order.id, 'preparing')}>接單</Button>
            </>
          )}
          {order.status === 'preparing' && (
            <Button size="sm" className="bg-blue-600 text-white font-bold hover:bg-blue-700" onClick={() => onUpdateStatus(order.id, 'ready')}>完成製作</Button>
          )}
          {order.status === 'ready' && (
             <Button size="sm" className="bg-slate-800 text-white font-bold hover:bg-slate-900" onClick={() => onUpdateStatus(order.id, 'completed')}>顧客已取餐</Button>
          )}
          {(order.status === 'completed' || order.status === 'cancelled') && (
            <Button size="sm" variant="outline" className="text-slate-400 font-bold border-slate-200" disabled>已結案</Button>
          )}
        </div>
      </div>
    </div>
  )
}
