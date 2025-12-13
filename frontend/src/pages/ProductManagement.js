import React, { useEffect, useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServiceType, setFilterServiceType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    business_id: '',
    service_type: '',
    category: '',
    subcategory: '',
    name: '',
    price: '',
    icon_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, businessesRes, serviceTypesRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/businesses'),
        api.get('/service-types'),
      ]);
      
      setProducts(productsRes.data);
      setBusinesses(businessesRes.data);
      setServiceTypes(serviceTypesRes.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsRes.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, {
          ...formData,
          price: parseFloat(formData.price),
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', {
          ...formData,
          price: parseFloat(formData.price),
        });
        toast.success('Product created successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      business_id: product.business_id,
      service_type: product.service_type,
      category: product.category,
      subcategory: product.subcategory || '',
      name: product.name,
      price: product.price.toString(),
      icon_url: product.icon_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      business_id: '',
      service_type: '',
      category: '',
      subcategory: '',
      name: '',
      price: '',
      icon_url: '',
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServiceType = filterServiceType === 'all' || product.service_type === filterServiceType;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesServiceType && matchesCategory;
  });

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const key = `${product.service_type} > ${product.category}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-6" data-testid="product-management-page">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" data-testid="add-product-button">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="business">Business *</Label>
                <Select
                  value={formData.business_id}
                  onValueChange={(value) => setFormData({ ...formData, business_id: value })}
                  required
                >
                  <SelectTrigger className="mt-2" data-testid="business-select">
                    <SelectValue placeholder="Select business" />
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
                <Label htmlFor="service_type">Service Type *</Label>
                <Input
                  id="service_type"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  placeholder="e.g., Dry Cleaning, Laundry"
                  required
                  className="mt-2"
                  data-testid="service-type-input"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Accessories, Bottoms, Tops"
                  required
                  className="mt-2"
                  data-testid="category-input"
                />
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g., Delicate, Pleat"
                  className="mt-2"
                  data-testid="subcategory-input"
                />
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Scarf, Shirt, Trousers"
                  required
                  className="mt-2"
                  data-testid="product-name-input"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (£) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                  className="mt-2"
                  data-testid="price-input"
                />
              </div>

              <div>
                <Label htmlFor="icon_url">Product Image URL (Optional)</Label>
                <Input
                  id="icon_url"
                  value={formData.icon_url}
                  onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2"
                  data-testid="image-url-input"
                />
                {formData.icon_url && (
                  <div className="mt-2">
                    <img src={formData.icon_url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  data-testid="submit-product-button"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Search Products</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
          </div>
          
          <div>
            <Label>Filter by Service Type</Label>
            <Select value={filterServiceType} onValueChange={setFilterServiceType}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Types</SelectItem>
                {serviceTypes.map(type => (
                  <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Filter by Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        {Object.entries(groupedProducts).map(([groupKey, groupProducts]) => (
          <div key={groupKey} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-lg">{groupKey}</h3>
              <p className="text-sm text-slate-600">{groupProducts.length} product(s)</p>
            </div>
            
            <div className="divide-y divide-slate-200">
              {groupProducts.map(product => (
                <div
                  key={product.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                  data-testid={`product-row-${product.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {product.icon_url ? (
                        <img
                          src={product.icon_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{product.name}</h4>
                        {product.subcategory && (
                          <p className="text-sm text-slate-500">{product.subcategory}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{product.business_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          £{product.price.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          data-testid={`edit-product-${product.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-product-${product.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};