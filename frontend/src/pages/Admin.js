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
import { GripVertical, MapPin, Clock, MessageSquare, Download } from 'lucide-react';
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

const SortableSubcategoryItem = ({ subcat }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${subcat.category}|${subcat.name}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200 hover:border-blue-300 transition-colors"
      data-testid={`sortable-subcat-${subcat.name}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      <span className="text-sm font-medium text-slate-700 flex-1">{subcat.name}</span>
      <span className="text-xs text-slate-400">#{subcat.sort_order + 1}</span>
    </div>
  );
};

export const Admin = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [business, setBusiness] = useState(null);
  const [adminCategories, setAdminCategories] = useState([]);
  const [adminSubcategories, setAdminSubcategories] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({ name: '', owner_email: '', pin_codes: '' });
  const user = getUser();

  const categorySensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadStats();
    loadOrders();
    loadBusiness();
    loadAdminCategories();
    loadAdminSubcategories();
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

  const loadBusiness = async () => {
    try {
      const response = await api.get('/admin/businesses');
      if (response.data.length > 0) {
        setBusiness(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load business');
    }
  };

  const startEditBusiness = () => {
    if (!business) return;
    setBusinessForm({
      name: business.name,
      owner_email: business.owner_email,
      pin_codes: business.pin_codes.join('\n'),
    });
    setEditingBusiness(true);
  };

  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    try {
      const pinCodes = businessForm.pin_codes
        .split(/[\n,]+/)
        .map(p => p.trim().toUpperCase())
        .filter(p => p.length > 0);
      
      await api.put(`/admin/businesses/${business.id}`, {
        name: businessForm.name,
        owner_email: businessForm.owner_email,
        pin_codes: pinCodes,
      });
      toast.success('Business updated successfully');
      setEditingBusiness(false);
      loadBusiness();
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update business');
    }
  };

  const handleDownloadBackup = async () => {
    try {
      toast.info('Generating backup...');
      const response = await api.get('/admin/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laundry-express-backup-${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Backup downloaded successfully');
    } catch (error) {
      toast.error('Failed to download backup');
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

  const loadAdminSubcategories = async () => {
    try {
      const response = await api.get('/admin/subcategories');
      setAdminSubcategories(response.data);
    } catch (error) {
      toast.error('Failed to load subcategories');
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

  const handleSubcategoryDragEnd = async (categoryName, event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const catSubcats = adminSubcategories.filter(sc => sc.category === categoryName);
    const oldIndex = catSubcats.findIndex(sc => `${sc.category}|${sc.name}` === active.id);
    const newIndex = catSubcats.findIndex(sc => `${sc.category}|${sc.name}` === over.id);
    const reordered = arrayMove(catSubcats, oldIndex, newIndex);
    const updated = reordered.map((sc, i) => ({ ...sc, sort_order: i }));

    // Update local state
    setAdminSubcategories(prev => [
      ...prev.filter(sc => sc.category !== categoryName),
      ...updated
    ].sort((a, b) => a.category.localeCompare(b.category) || a.sort_order - b.sort_order));

    try {
      await api.post('/admin/subcategories/reorder', {
        updates: updated.map((sc, i) => ({ name: sc.name, category: sc.category, sort_order: i }))
      });
      toast.success('Subcategory order updated');
    } catch (error) {
      toast.error('Failed to update subcategory order');
      loadAdminSubcategories();
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
            <TabsTrigger value="orders" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-categories">Categories</TabsTrigger>
            <TabsTrigger value="businesses" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-businesses">Business Settings</TabsTrigger>
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

                {order.customer_note && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4" data-testid={`order-note-${order.id}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Customer Note</span>
                    </div>
                    <p className="text-sm text-amber-700 ml-6 italic">{order.customer_note}</p>
                  </div>
                )}
                
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
            {business ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600">Business Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your business details and service area postcodes</p>
                  </div>
                  {!editingBusiness && (
                    <Button
                      onClick={startEditBusiness}
                      className="rounded-full bg-blue-600 hover:bg-blue-700"
                      data-testid="edit-business-button"
                    >
                      Edit Details
                    </Button>
                  )}
                </div>

                {editingBusiness ? (
                  <form onSubmit={handleSaveBusiness} className="space-y-5">
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
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="pin_codes">Service Area Postcodes</Label>
                        <span className="text-sm text-slate-500" data-testid="pincode-count">
                          {businessForm.pin_codes.split(/[\n,]+/).filter(p => p.trim()).length} postcodes
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">One postcode per line, or comma-separated. You can paste bulk lists.</p>
                      <textarea
                        id="pin_codes"
                        value={businessForm.pin_codes}
                        onChange={(e) => setBusinessForm({ ...businessForm, pin_codes: e.target.value })}
                        placeholder={"CO1\nCO2\nCO3\nSW1A 1AA"}
                        required
                        rows={12}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="pin-codes-textarea"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingBusiness(false)}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700" data-testid="save-business-button">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-sm text-slate-500 mb-1">Business Name</p>
                        <p className="text-lg font-medium text-slate-800" data-testid="business-name-display">{business.name}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-sm text-slate-500 mb-1">Owner Email</p>
                        <p className="text-lg font-medium text-slate-800" data-testid="business-email-display">{business.owner_email}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm text-slate-500">Service Area Postcodes</p>
                        <span className="text-sm font-medium text-blue-600" data-testid="pincode-count-display">{business.pin_codes.length} postcodes</span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                        {business.pin_codes.map((code, i) => (
                          <span key={i} className="bg-white border border-slate-200 text-slate-700 text-sm px-3 py-1 rounded-full">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500">No business configured</p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">Database Backup</h2>
                  <p className="text-sm text-slate-500 mt-1">Download a full backup of all your data (orders, products, customers, settings)</p>
                </div>
                <Button
                  onClick={handleDownloadBackup}
                  className="rounded-full bg-slate-800 hover:bg-slate-900"
                  data-testid="download-backup-button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup
                </Button>
              </div>
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

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Subcategory Display Order</h2>
              <p className="text-sm text-slate-500 mb-6">Drag and drop to reorder subcategories within each category</p>
              
              {adminCategories.length > 0 ? (
                <div className="space-y-6">
                  {adminCategories.map(cat => {
                    const catSubcats = adminSubcategories.filter(sc => sc.category === cat.name);
                    if (catSubcats.length === 0) return null;
                    return (
                      <div key={cat.name} data-testid={`subcat-group-${cat.name}`}>
                        <h3 className="text-base font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">{cat.name}</h3>
                        <DndContext
                          sensors={categorySensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleSubcategoryDragEnd(cat.name, event)}
                        >
                          <SortableContext
                            items={catSubcats.map(sc => `${sc.category}|${sc.name}`)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2 ml-2">
                              {catSubcats.map(sc => (
                                <SortableSubcategoryItem key={`${sc.category}|${sc.name}`} subcat={sc} />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">No subcategories found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};