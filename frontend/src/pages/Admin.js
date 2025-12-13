import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ProductManagement } from './ProductManagement';
import api from '../utils/api';
import { toast } from 'sonner';
import { getUser } from '../utils/auth';

export const Admin = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const user = getUser();

  const [businessForm, setBusinessForm] = useState({
    name: '',
    owner_email: '',
    pin_codes: '',
  });

  const [serviceForm, setServiceForm] = useState({
    business_id: '',
    name: '',
    category: '',
    base_price: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    loadStats();
    loadOrders();
    loadBusinesses();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const loadBusinesses = async () => {
    try {
      const response = await api.get('/admin/businesses');
      setBusinesses(response.data);
    } catch (error) {
      toast.error('Failed to load businesses');
    }
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/businesses', {
        ...businessForm,
        pin_codes: businessForm.pin_codes.split(',').map(p => p.trim()),
      });
      toast.success('Business created successfully');
      setBusinessForm({ name: '', owner_email: '', pin_codes: '' });
      loadBusinesses();
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create business');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/services', {
        ...serviceForm,
        base_price: parseFloat(serviceForm.base_price),
      });
      toast.success('Service created successfully');
      setServiceForm({
        business_id: '',
        name: '',
        category: '',
        base_price: '',
        description: '',
        image_url: '',
      });
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create service');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">Admin Panel</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="admin-stats">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-orders">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-600" data-testid="stat-total-revenue">£{stats.total_revenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Businesses</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-businesses">{stats.total_businesses}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Services</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-services">{stats.total_services}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white rounded-full p-2">
            <TabsTrigger value="orders" className="rounded-full" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="businesses" className="rounded-full" data-testid="tab-businesses">Businesses</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6" data-testid="orders-tab-content">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-slate-200" data-testid={`admin-order-${order.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-slate-600">Customer: {order.user_name}</p>
                    <p className="text-sm text-slate-600">Email: {order.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 mb-2">£{order.total_amount.toFixed(2)}</p>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]" data-testid={`status-select-${order.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6" data-testid="businesses-tab-content">
            {(user?.role === 'platform_admin' || user?.role === 'super_admin') && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-xl font-semibold mb-6">Create New Business</h2>
                <form onSubmit={handleCreateBusiness} className="space-y-4">
                  <div>
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="business-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner_email">Owner Email</Label>
                    <Input
                      id="owner_email"
                      type="email"
                      value={businessForm.owner_email}
                      onChange={(e) => setBusinessForm({ ...businessForm, owner_email: e.target.value })}
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="owner-email-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pin_codes">Pin Codes (comma-separated)</Label>
                    <Input
                      id="pin_codes"
                      value={businessForm.pin_codes}
                      onChange={(e) => setBusinessForm({ ...businessForm, pin_codes: e.target.value })}
                      placeholder="SW1A 1AA, SW1A 2AA"
                      required
                      className="h-12 rounded-xl mt-2"
                      data-testid="pin-codes-input"
                    />
                  </div>
                  <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700" data-testid="create-business-button">
                    Create Business
                  </Button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="businesses-list">
              {businesses.map(business => (
                <div key={business.id} className="bg-white rounded-2xl p-6 border border-slate-200" data-testid={`business-${business.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">Owner: {business.owner_email}</p>
                  <p className="text-sm text-slate-600">Pin Codes: {business.pin_codes.join(', ')}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6" data-testid="services-tab-content">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold mb-6">Create New Service</h2>
              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <Label htmlFor="service_business">Business</Label>
                  <Select
                    value={serviceForm.business_id}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, business_id: value })}
                    required
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2" data-testid="service-business-select">
                      <SelectValue placeholder="Select a business" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map(business => (
                        <SelectItem key={business.id} value={business.id}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service_name">Service Name</Label>
                  <Input
                    id="service_name"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    required
                    className="h-12 rounded-xl mt-2"
                    data-testid="service-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="service_category">Category</Label>
                  <Input
                    id="service_category"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    placeholder="e.g., Wash & Fold, Dry Cleaning"
                    required
                    className="h-12 rounded-xl mt-2"
                    data-testid="service-category-input"
                  />
                </div>
                <div>
                  <Label htmlFor="service_price">Base Price (£)</Label>
                  <Input
                    id="service_price"
                    type="number"
                    step="0.01"
                    value={serviceForm.base_price}
                    onChange={(e) => setServiceForm({ ...serviceForm, base_price: e.target.value })}
                    required
                    className="h-12 rounded-xl mt-2"
                    data-testid="service-price-input"
                  />
                </div>
                <div>
                  <Label htmlFor="service_description">Description</Label>
                  <Input
                    id="service_description"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                    className="h-12 rounded-xl mt-2"
                    data-testid="service-description-input"
                  />
                </div>
                <div>
                  <Label htmlFor="service_image">Image URL (optional)</Label>
                  <Input
                    id="service_image"
                    value={serviceForm.image_url}
                    onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                    className="h-12 rounded-xl mt-2"
                    data-testid="service-image-input"
                  />
                </div>
                <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700" data-testid="create-service-button">
                  Create Service
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};