import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../utils/api';
import { toast } from 'sonner';

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  if (!order) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="order-confirmation-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-emerald-50 rounded-full mb-4">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Order Confirmed!</h1>
          <p className="text-base md:text-lg leading-relaxed text-slate-600">
            Your order has been placed successfully
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 mb-6">
          <h2 className="text-xl font-semibold mb-6">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Order ID</span>
              <span className="font-medium text-xl text-blue-600" data-testid="order-id">#{order.order_number || order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Amount</span>
              <span className="font-medium text-blue-600" data-testid="order-total">£{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Method</span>
              <span className="font-medium capitalize" data-testid="order-payment-method">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status</span>
              <span className="font-medium capitalize" data-testid="order-status">{order.status}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-semibold mb-4">Pickup & Delivery</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 block mb-1">Pickup</span>
                <span className="font-medium">{order.pickup_date} at {order.pickup_time}</span>
              </div>
              <div>
                <span className="text-slate-600 block mb-1">Delivery</span>
                <span className="font-medium">{order.delivery_date} at {order.delivery_time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="view-orders-button"
          >
            View All Orders
          </Button>
          <Button
            onClick={() => navigate('/services')}
            variant="outline"
            className="flex-1 h-12 rounded-full"
            data-testid="continue-shopping-button"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};