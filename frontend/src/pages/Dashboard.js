import React, { useEffect, useState } from 'react';
import { Package, Clock } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
      processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="dashboard-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16" data-testid="no-orders">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6" data-testid="orders-list">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border border-slate-200"
                data-testid={`order-${order.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2" data-testid={`order-id-${order.id}`}>Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-slate-600">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}
                      data-testid={`order-status-${order.id}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Pickup: {order.pickup_date} at {order.pickup_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Delivery: {order.delivery_date} at {order.delivery_time}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">{order.items.length} item(s)</span>
                    <span className="text-xl font-bold text-indigo-600" data-testid={`order-amount-${order.id}`}>
                      £{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};