import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { subscribeToOrders, updateOrderStatus } from '../services/api';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    if (!orderId) return;
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">後台管理 / Admin Dashboard</h1>
        <p className="text-stone-500 mt-2">即時管理所有訂單狀態</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="py-4 px-6 font-semibold text-stone-600 bg-stone-50/50">時間 / Time</th>
                <th className="py-4 px-6 font-semibold text-stone-600 bg-stone-50/50">顧客 / Customer</th>
                <th className="py-4 px-6 font-semibold text-stone-600 bg-stone-50/50">明細 / Items</th>
                <th className="py-4 px-6 font-semibold text-stone-600 bg-stone-50/50">總額 / Total</th>
                <th className="py-4 px-6 font-semibold text-stone-600 bg-stone-50/50">狀態 / Status</th>
                <th className="py-4 px-6 font-semibold text-stone-600 bg-stone-50/50 text-right">操作 / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    目前沒有任何訂單 (No orders yet)
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-4 px-6 text-stone-500 whitespace-nowrap">
                      <div className="text-sm font-medium text-stone-900">{format(new Date(order.createdAt), 'HH:mm')}</div>
                      <div className="text-xs">{format(new Date(order.createdAt), 'MM/dd')}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-stone-900">{order.customerName}</div>
                      <div className="text-xs text-stone-400 font-mono">#{order.id?.slice(0, 8)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <ul className="space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-sm shadow-sm bg-white border border-stone-100 px-2 py-1 rounded inline-block m-1">
                            <span className="font-medium text-orange-900">{item.name}</span>
                            <span className="text-stone-500 ml-1">({item.size === 'L' ? 'L杯' : '瓶裝'})</span>
                            <span className="mx-1 text-stone-300">x</span>
                            <span className="font-bold text-stone-700">{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900">
                      ${order.totalAmount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5",
                        order.status === 'pending' && "bg-orange-100 text-orange-700 border border-orange-200",
                        order.status === 'completed' && "bg-green-100 text-green-700 border border-green-200",
                        order.status === 'cancelled' && "bg-stone-100 text-stone-600 border border-stone-200"
                      )}>
                        {order.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {order.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                        {order.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                        {order.status === 'pending' ? '處理中' : order.status === 'completed' ? '已完成' : '已取消'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id!, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
                          >
                            完成
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id!, 'cancelled')}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                          >
                            取消
                          </button>
                        </>
                      )}
                      {order.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(order.id!, 'pending')}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          還原
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
