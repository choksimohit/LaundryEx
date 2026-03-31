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
import { GripVertical, MapPin, Clock, MessageSquare } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableCategoryItem = ({ category }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors"
      data-testid={`sortable-category-${category.name}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-5 w-5 text-slate-400" />
      </div>
      <span className="font-medium text-slate-800 flex-1">{category.name}</span>
      <span className="text-sm text-slate-400">#{category.sort_order + 1}</span>
    </div>
  );
};

export const Admin = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const user = getUser();

  const [businessForm, setBusinessForm] = useState({
    name: '',
    owner_email: '',
    pin_codes: '',
  });

  const categorySensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadStats();
    loadOrders();
    loadBusinesses();
    loadAdminCategories();
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

  const loadAdminCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setAdminCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleCategoryDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = adminCategories.findIndex(c => c.name === active.id);
    const newIndex = adminCategories.findIndex(c => c.name === over.id);
    const reordered = arrayMove(adminCategories, oldIndex, newIndex);
    
    const updated = reordered.map((cat, i) => ({ ...cat, sort_order: i }));
    setAdminCategories(updated);

    try {
      await api.post('/admin/categories/reorder', {
        updates: updated.map((cat, i) => ({ name: cat.name, sort_order: i }))
      });
      toast.success('Category order updated');
    } catch (error) {
      toast.error('Failed to update category order');
      loadAdminCategories();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight mb-6 md:mb-8 text-blue-600">Admin Panel</h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8" data-testid="admin-stats">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-orders">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-revenue">£{stats.total_revenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Businesses</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-businesses">{stats.total_businesses}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Products</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-products">{stats.total_products}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white rounded-full p-2 border border-slate-200">
            <TabsTrigger value="orders" className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-categories">Categories</TabsTrigger>
            <TabsTrigger value="businesses" className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-businesses">Businesses</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6" data-testid="orders-tab-content">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-slate-200" data-testid={`admin-order-${order.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Order #{order.order_number || order.id.slice(0, 8)}</h3>
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

                {/* Customer Address */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4" data-testid={`order-address-${order.id}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Customer Address</span>
                  </div>
                  <p className="text-sm text-slate-800 ml-6">{order.address || 'N/A'}</p>
                  <p className="text-sm text-slate-500 ml-6">Postcode: {order.pin_code || 'N/A'}</p>
                </div>
                
                <div className="border-t border-slate-200 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Order Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-slate-600">
                        • {item.product_name} × {item.quantity} - £{(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-blue-700 font-medium">Pickup</span>
                    </div>
                    <span className="block text-slate-800 font-medium">{order.pickup_date} at {order.pickup_time}</span>
                    {order.pickup_instruction && (
                      <div className="flex items-start gap-1.5 mt-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-slate-500 italic">{order.pickup_instruction}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-700 font-medium">Delivery</span>
                    </div>
                    <span className="block text-slate-800 font-medium">{order.delivery_date} at {order.delivery_time}</span>
                    {order.delivery_instruction && (
                      <div className="flex items-start gap-1.5 mt-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-slate-500 italic">{order.delivery_instruction}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="businesses" className="space-y-6" data-testid="businesses-tab-content">
            {(user?.role === 'platform_admin' || user?.role === 'super_admin') && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-xl font-semibold mb-6 text-blue-600">Create New Business</h2>
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

          <TabsContent value="products" className="space-y-6" data-testid="products-tab-content">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6" data-testid="categories-tab-content">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Category Display Order</h2>
              <p className="text-sm text-slate-500 mb-6">Drag and drop to reorder how categories appear on the storefront</p>
              
              {adminCategories.length > 0 ? (
                <DndContext
                  sensors={categorySensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleCategoryDragEnd}
                >
                  <SortableContext
                    items={adminCategories.map(c => c.name)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {adminCategories.map(cat => (
                        <SortableCategoryItem key={cat.name} category={cat} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <p className="text-center text-slate-500 py-8">No categories found. Add products to create categories.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};