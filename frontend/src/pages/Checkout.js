import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    pickup_date: '',
    pickup_time: '',
    pickup_instruction: '',
    delivery_date: '',
    delivery_time: '',
    delivery_instruction: '',
    address: '',
    pin_code: '',
    payment_method: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedPinCode = sessionStorage.getItem('pinCode');
    
    // Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const deliveryStr = deliveryDate.toISOString().split('T')[0];
    
    setFormData(prev => ({ 
      ...prev, 
      pin_code: savedPinCode || '',
      pickup_date: todayStr,
      pickup_time: '10:00-12:00',
      pickup_instruction: 'in-person',
      delivery_date: deliveryStr,
      delivery_time: '14:00-16:00',
      delivery_instruction: 'ring-wait'
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart,
        ...formData,
        total_amount: totalAmount,
      };

      const response = await api.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      localStorage.removeItem('cart');
      navigate(`/order-confirmation/${response.data.order_id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/services');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="checkout-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Collection Date & Time</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pickup_date">Collection Date *</Label>
                    <Input
                      id="pickup_date"
                      name="pickup_date"
                      type="date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="pickup-date-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup_time">Collection Slot *</Label>
                    <Select
                      value={formData.pickup_time}
                      onValueChange={(value) => setFormData({ ...formData, pickup_time: value })}
                      required
                    >
                      <SelectTrigger className="h-12 rounded-xl mt-2" data-testid="pickup-slot-select">
                        <SelectValue placeholder="- Select Slot -" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00-10:00">8:00 AM - 10:00 AM</SelectItem>
                        <SelectItem value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                        <SelectItem value="12:00-14:00">12:00 PM - 2:00 PM</SelectItem>
                        <SelectItem value="14:00-16:00">2:00 PM - 4:00 PM</SelectItem>
                        <SelectItem value="16:00-18:00">4:00 PM - 6:00 PM</SelectItem>
                        <SelectItem value="18:00-20:00">6:00 PM - 8:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pickup_instruction">Collection Instruction *</Label>
                    <Select
                      value={formData.pickup_instruction || ''}
                      onValueChange={(value) => setFormData({ ...formData, pickup_instruction: value })}
                      required
                    >
                      <SelectTrigger className="h-12 rounded-xl mt-2" data-testid="pickup-instruction-select">
                        <SelectValue placeholder="— How should driver collect? —" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">Driver collects from you (in person)</SelectItem>
                        <SelectItem value="doorstep">Leave outside (doorstep/mailbox)</SelectItem>
                        <SelectItem value="reception">Leave at reception/porter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Delivery Date & Time</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delivery_date">Delivery Date *</Label>
                    <Input
                      id="delivery_date"
                      name="delivery_date"
                      type="date"
                      value={formData.delivery_date}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="delivery-date-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery_time">Delivery Slot *</Label>
                    <Select
                      value={formData.delivery_time}
                      onValueChange={(value) => setFormData({ ...formData, delivery_time: value })}
                      required
                    >
                      <SelectTrigger className="h-12 rounded-xl mt-2" data-testid="delivery-slot-select">
                        <SelectValue placeholder="- Select Slot -" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00-10:00">8:00 AM - 10:00 AM</SelectItem>
                        <SelectItem value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                        <SelectItem value="12:00-14:00">12:00 PM - 2:00 PM</SelectItem>
                        <SelectItem value="14:00-16:00">2:00 PM - 4:00 PM</SelectItem>
                        <SelectItem value="16:00-18:00">4:00 PM - 6:00 PM</SelectItem>
                        <SelectItem value="18:00-20:00">6:00 PM - 8:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="delivery_instruction">Delivery Instruction *</Label>
                    <Select
                      value={formData.delivery_instruction || ''}
                      onValueChange={(value) => setFormData({ ...formData, delivery_instruction: value })}
                      required
                    >
                      <SelectTrigger className="h-12 rounded-xl mt-2" data-testid="delivery-instruction-select">
                        <SelectValue placeholder="— How should driver deliver? —" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ring-wait">Ring bell and wait</SelectItem>
                        <SelectItem value="ring-leave">Ring bell and leave</SelectItem>
                        <SelectItem value="reception">Leave at reception/porter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="address-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pin_code">Pin Code</Label>
                    <Input
                      id="pin_code"
                      name="pin_code"
                      type="text"
                      value={formData.pin_code}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="pincode-input"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <RadioGroup
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  data-testid="payment-method-group"
                >
                  <div className="flex items-center space-x-2 p-4 border-2 border-blue-500 rounded-xl bg-blue-50">
                    <RadioGroupItem value="cod" id="cod" data-testid="payment-method-cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-slate-800">Cash on Delivery</div>
                      <div className="text-sm text-slate-600 mt-1">Pay when your order is delivered</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-slate-200 rounded-xl bg-slate-50 opacity-60">
                    <RadioGroupItem value="stripe" id="stripe" disabled data-testid="payment-method-stripe" />
                    <Label htmlFor="stripe" className="flex-1">
                      <div className="font-semibold text-slate-500">Credit/Debit Card (Stripe)</div>
                      <div className="text-sm text-slate-400 mt-1">Coming soon - Currently unavailable</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-all disabled:opacity-50"
                data-testid="place-order-button"
              >
                {loading ? 'Placing Order...' : `Place Order - £${totalAmount.toFixed(2)}`}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.product_id} className="flex justify-between text-sm" data-testid={`summary-item-${item.product_id}`}>
                    <span className="text-slate-600">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600" data-testid="checkout-total">£{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};