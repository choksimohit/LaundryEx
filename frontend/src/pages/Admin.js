import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { ProductManagement } from './ProductManagement';
import api from '../utils/api';
import { toast } from 'sonner';
import { getUser } from '../utils/auth';
import { GripVertical, MapPin, Clock, MessageSquare, Download, PenLine, Trash2, Eye, EyeOff, Users, TrendingUp, Search, Star } from 'lucide-react';
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
import { RichTextEditor } from '../components/RichTextEditor';

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
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userSort, setUserSort] = useState({ key: 'created_at', dir: 'desc' });
  const [reviewModal, setReviewModal] = useState({ open: false, loading: false, sending: false, eligible: [], selected: new Set() });
  const [orderSort, setOrderSort] = useState({ key: 'created_at', dir: 'desc' });
  const [orderFilter, setOrderFilter] = useState({ status: '', search: '' });
  const [business, setBusiness] = useState(null);
  const [adminCategories, setAdminCategories] = useState([]);
  const [adminSubcategories, setAdminSubcategories] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({ name: '', owner_email: '', pin_codes: '' });

  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', cover_image_url: '', meta_description: '', status: 'draft' });
  const [editingPost, setEditingPost] = useState(null); // null = new, id = editing
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [blogLoading, setBlogLoading] = useState(false);

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
    loadBlogPosts();
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

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
      setUsersLoaded(true);
    } catch (error) {
      toast.error('Failed to load users');
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

  const loadBlogPosts = async () => {
    try {
      const res = await api.get('/admin/blog');
      setBlogPosts(res.data);
    } catch { toast.error('Failed to load blog posts'); }
  };

  const openNewPost = () => {
    setEditingPost(null);
    setBlogForm({ title: '', content: '', excerpt: '', cover_image_url: '', meta_description: '', status: 'draft' });
    setShowBlogEditor(true);
  };

  const openEditPost = (post) => {
    setEditingPost(post.id);
    setBlogForm({ title: post.title, content: post.content, excerpt: post.excerpt || '', cover_image_url: post.cover_image_url || '', meta_description: post.meta_description || '', status: post.status });
    setShowBlogEditor(true);
  };

  const handleSaveBlogPost = async (e) => {
    e.preventDefault();
    setBlogLoading(true);
    try {
      if (editingPost) {
        await api.put(`/admin/blog/${editingPost}`, blogForm);
        toast.success('Post updated');
      } else {
        await api.post('/admin/blog', blogForm);
        toast.success('Post created');
      }
      setShowBlogEditor(false);
      loadBlogPosts();
    } catch { toast.error('Failed to save post'); }
    finally { setBlogLoading(false); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/admin/blog/${postId}`);
      toast.success('Post deleted');
      loadBlogPosts();
    } catch { toast.error('Failed to delete post'); }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight mb-6 md:mb-8 text-blue-600">Admin Panel</h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8" data-testid="admin-stats">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-orders">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-revenue">£{stats.total_revenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Registered Users</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="stat-total-users">{stats.total_users ?? 0}</p>
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
          <TabsList className="bg-white rounded-full p-2 border border-slate-200 flex-wrap gap-1">
            <TabsTrigger value="orders" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="users" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-users" onClick={() => { if (!usersLoaded) loadUsers(); }}>Users</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-categories">Categories</TabsTrigger>
            <TabsTrigger value="businesses" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-businesses">Business Settings</TabsTrigger>
            <TabsTrigger value="blog" className="rounded-full text-slate-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6" data-testid="orders-tab-content">
            {/* Sort & Filter bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, email or order #..."
                  value={orderFilter.search}
                  onChange={e => setOrderFilter(f => ({ ...f, search: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={orderFilter.status}
                onChange={e => setOrderFilter(f => ({ ...f, status: e.target.value }))}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={`${orderSort.key}:${orderSort.dir}`}
                onChange={e => { const [key, dir] = e.target.value.split(':'); setOrderSort({ key, dir }); }}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
              >
                <option value="created_at:desc">Date (newest)</option>
                <option value="created_at:asc">Date (oldest)</option>
                <option value="order_number:desc">Order # (high)</option>
                <option value="order_number:asc">Order # (low)</option>
                <option value="total_amount:desc">Amount (highest)</option>
                <option value="total_amount:asc">Amount (lowest)</option>
                <option value="user_name:asc">Customer (A–Z)</option>
                <option value="user_name:desc">Customer (Z–A)</option>
                <option value="pickup_date:asc">Pickup (soonest)</option>
                <option value="pickup_date:desc">Pickup (latest)</option>
              </select>
              {(orderFilter.status || orderFilter.search) && (
                <button
                  onClick={() => setOrderFilter({ status: '', search: '' })}
                  className="text-sm text-slate-400 hover:text-slate-600 shrink-0 underline"
                >
                  Clear
                </button>
              )}
            </div>

            {(() => {
              const q = orderFilter.search.toLowerCase();
              const filtered = orders.filter(o => {
                const matchStatus = !orderFilter.status || o.status === orderFilter.status;
                const matchSearch = !q || (o.user_name || '').toLowerCase().includes(q) || (o.user_email || '').toLowerCase().includes(q) || String(o.order_number).includes(q);
                return matchStatus && matchSearch;
              });
              const sorted = [...filtered].sort((a, b) => {
                const { key, dir } = orderSort;
                let av = a[key], bv = b[key];
                if (av == null) av = '';
                if (bv == null) bv = '';
                if (typeof av === 'string' && typeof bv === 'string') return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
                return dir === 'asc' ? av - bv : bv - av;
              });
              if (sorted.length === 0) return (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-400">No orders match your filters.</p>
                </div>
              );
              return sorted.map(order => (
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
            ));
            })()}
          </TabsContent>

          <TabsContent value="users" className="space-y-6" data-testid="users-tab-content">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">Registered Users</h2>
                  <p className="text-sm text-slate-500 mt-1">{users.length} total customers</p>
                </div>
                <Button
                  onClick={async () => {
                    setReviewModal(m => ({ ...m, open: true, loading: true, eligible: [], selected: new Set() }));
                    try {
                      const res = await api.get('/admin/review-request-preview');
                      const eligible = res.data.eligible;
                      setReviewModal(m => ({ ...m, loading: false, eligible, selected: new Set(eligible.map(u => u.email)) }));
                    } catch {
                      toast.error('Failed to load preview');
                      setReviewModal(m => ({ ...m, open: false, loading: false }));
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2 shrink-0"
                >
                  <Star className="h-4 w-4" />
                  Request Google Reviews
                </Button>

                <Dialog open={reviewModal.open} onOpenChange={open => setReviewModal(m => ({ ...m, open }))}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        Send Google Review Request
                      </DialogTitle>
                    </DialogHeader>

                    {reviewModal.loading ? (
                      <div className="py-8 text-center text-slate-400">Loading recipients...</div>
                    ) : reviewModal.eligible.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-slate-500 font-medium">No eligible customers</p>
                        <p className="text-sm text-slate-400 mt-1">All customers with orders were emailed within the last 30 days.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-700">{reviewModal.selected.size}</span> of <span className="font-semibold text-slate-700">{reviewModal.eligible.length}</span> selected
                          </p>
                          <button
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => setReviewModal(m => ({
                              ...m,
                              selected: m.selected.size === m.eligible.length
                                ? new Set()
                                : new Set(m.eligible.map(u => u.email))
                            }))}
                          >
                            {reviewModal.selected.size === reviewModal.eligible.length ? 'Deselect all' : 'Select all'}
                          </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                          {reviewModal.eligible.map((u, i) => {
                            const checked = reviewModal.selected.has(u.email);
                            return (
                              <label key={i} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => setReviewModal(m => {
                                    const next = new Set(m.selected);
                                    checked ? next.delete(u.email) : next.add(u.email);
                                    return { ...m, selected: next };
                                  })}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                                />
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                                  {(u.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-800 truncate">{u.name || '—'}</p>
                                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <DialogFooter className="gap-2 mt-2">
                      <Button variant="outline" onClick={() => setReviewModal(m => ({ ...m, open: false }))}>
                        Cancel
                      </Button>
                      {!reviewModal.loading && reviewModal.eligible.length > 0 && (
                        <Button
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                          disabled={reviewModal.sending || reviewModal.selected.size === 0}
                          onClick={async () => {
                            setReviewModal(m => ({ ...m, sending: true }));
                            try {
                              const res = await api.post('/admin/send-review-request', {
                                selected_emails: [...reviewModal.selected]
                              });
                              toast.success(res.data.message);
                              setReviewModal(m => ({ ...m, open: false, sending: false }));
                            } catch {
                              toast.error('Failed to send review emails');
                              setReviewModal(m => ({ ...m, sending: false }));
                            }
                          }}
                        >
                          {reviewModal.sending ? 'Sending...' : `Send to ${reviewModal.selected.size} customer${reviewModal.selected.size !== 1 ? 's' : ''}`}
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {users.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 shrink-0">Sort by</span>
                    <select
                      value={`${userSort.key}:${userSort.dir}`}
                      onChange={e => {
                        const [key, dir] = e.target.value.split(':');
                        setUserSort({ key, dir });
                      }}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="created_at:desc">Date Joined (newest)</option>
                      <option value="created_at:asc">Date Joined (oldest)</option>
                      <option value="name:asc">Name (A–Z)</option>
                      <option value="name:desc">Name (Z–A)</option>
                      <option value="total_orders:desc">Total Orders (most)</option>
                      <option value="total_orders:asc">Total Orders (least)</option>
                      <option value="last_order:desc">Last Order (recent)</option>
                      <option value="last_order:asc">Last Order (oldest)</option>
                      <option value="orders_per_month:desc">Orders/Month (highest)</option>
                      <option value="orders_per_month:asc">Orders/Month (lowest)</option>
                    </select>
                  </div>
                )}
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400">No registered users yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...users].sort((a, b) => {
                    const { key, dir } = userSort;
                    let av = a[key], bv = b[key];
                    if (av == null) av = dir === 'asc' ? Infinity : -Infinity;
                    if (bv == null) bv = dir === 'asc' ? Infinity : -Infinity;
                    if (typeof av === 'string' && typeof bv === 'string') {
                      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
                    }
                    return dir === 'asc' ? av - bv : bv - av;
                  }).map(u => (
                    <div key={u.id} className="border border-slate-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-semibold text-slate-800">{u.name || '—'}</p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                          <p className="text-sm text-slate-500">{u.phone || '—'}</p>
                          {u.last_address && (
                            <div className="flex items-start gap-1.5 pt-1">
                              <MapPin className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
                              <p className="text-sm text-slate-500">{u.last_address}{u.last_pin_code ? `, ${u.last_pin_code}` : ''}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4 shrink-0 text-center">
                          <div className="bg-blue-50 rounded-xl px-4 py-3 min-w-[80px]">
                            <p className="text-2xl font-bold text-blue-600">{u.total_orders}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Orders</p>
                          </div>
                          {u.orders_per_month != null && (
                            <div className="bg-green-50 rounded-xl px-4 py-3 min-w-[80px]">
                              <div className="flex items-center justify-center gap-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <p className="text-2xl font-bold text-green-600">{u.orders_per_month}</p>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">/ month</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400">
                        <span>Joined {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {u.last_order && (
                          <span>· Last order {new Date(u.last_order).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        )}
                        {u.review_request_sent_at && (
                          <span className="ml-auto flex items-center gap-1 text-amber-500">
                            <Star className="h-3 w-3" />
                            Review email sent {new Date(u.review_request_sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            {showBlogEditor ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-600">{editingPost ? 'Edit Post' : 'New Blog Post'}</h2>
                  <Button variant="outline" className="rounded-full" onClick={() => setShowBlogEditor(false)}>Cancel</Button>
                </div>
                <form onSubmit={handleSaveBlogPost} className="space-y-5">
                  <div>
                    <Label>Title *</Label>
                    <Input value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} required placeholder="e.g. How to remove tough stains from clothes" className="mt-2 h-12 rounded-xl" />
                  </div>
                  <div>
                    <Label>Cover Image URL (optional)</Label>
                    <Input value={blogForm.cover_image_url} onChange={e => setBlogForm({...blogForm, cover_image_url: e.target.value})} placeholder="https://..." className="mt-2 h-12 rounded-xl" />
                  </div>
                  <div>
                    <Label>Excerpt <span className="text-slate-400 font-normal">(short summary shown on blog list)</span></Label>
                    <textarea
                      value={blogForm.excerpt}
                      onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                      placeholder="A short 1-2 sentence summary of the post..."
                      rows={2}
                      className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label>Meta Description <span className="text-slate-400 font-normal">(for Google — 150-160 chars)</span></Label>
                    <textarea
                      value={blogForm.meta_description}
                      onChange={e => setBlogForm({...blogForm, meta_description: e.target.value})}
                      placeholder="Describe this article for search engines..."
                      rows={2}
                      maxLength={160}
                      className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">{blogForm.meta_description.length}/160 characters</p>
                  </div>
                  <div>
                    <Label>Content *</Label>
                    <div className="mt-2">
                      <RichTextEditor
                        value={blogForm.content}
                        onChange={val => setBlogForm({...blogForm, content: val})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <Button type="submit" disabled={blogLoading} className="rounded-full bg-blue-600 hover:bg-blue-700 px-8">
                      {blogLoading ? 'Saving...' : editingPost ? 'Update Post' : 'Save Post'}
                    </Button>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-700">Status:</label>
                      <select
                        value={blogForm.status}
                        onChange={e => setBlogForm({...blogForm, status: e.target.value})}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600">Blog Posts</h2>
                    <p className="text-sm text-slate-500 mt-1">Write articles to drive traffic to your website</p>
                  </div>
                  <Button onClick={openNewPost} className="rounded-full bg-blue-600 hover:bg-blue-700">
                    <PenLine className="h-4 w-4 mr-2" /> New Post
                  </Button>
                </div>

                {blogPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <PenLine className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400">No posts yet. Write your first article!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blogPosts.map(post => (
                      <div key={post.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800 truncate">{post.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {post.status === 'published' && (
                            <Link to={`/blog/${post.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="View post">
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                          <button onClick={() => openEditPost(post)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                            <PenLine className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeletePost(post.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};