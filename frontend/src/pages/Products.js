import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ShoppingCart, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';
import { toast } from 'sonner';
import { isAuthenticated } from '../utils/auth';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [cart, setCart] = useState([]);
  const [pinCode, setPinCode] = useState('');
  const [hasValidPinCode, setHasValidPinCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if pincode already searched
    const savedPinCode = sessionStorage.getItem('pinCode');
    if (savedPinCode) {
      setPinCode(savedPinCode);
      setHasValidPinCode(true);
      loadServiceTypes();
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (selectedServiceType && hasValidPinCode) {
      loadProducts();
    }
  }, [selectedServiceType, hasValidPinCode]);

  const checkPinCode = async () => {
    if (!pinCode || pinCode.length < 3) {
      toast.error('Please enter a valid postcode');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/pincode/check', { pin_code: pinCode.toUpperCase() });
      if (response.data.available) {
        toast.success('Service is available in your area!');
        sessionStorage.setItem('pinCode', pinCode.toUpperCase());
        sessionStorage.setItem('businesses', JSON.stringify(response.data.businesses));
        setHasValidPinCode(true);
        loadServiceTypes();
      } else {
        toast.error('Service not available in your area yet');
        setHasValidPinCode(false);
      }
    } catch (error) {
      toast.error('Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const loadServiceTypes = async () => {
    try {
      const response = await api.get('/service-types');
      setServiceTypes(response.data);
      if (response.data.length > 0) {
        setSelectedServiceType(response.data[0].name);
      }
    } catch (error) {
      toast.error('Failed to load service types');
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get(`/products?service_type=${selectedServiceType}`);
      setProducts(response.data);
      if (response.data.length > 0) {
        const firstCategory = response.data[0].category;
        setExpandedCategories({ [firstCategory]: true });
      }
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const groupByCategory = () => {
    const grouped = {};
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          business_id: product.business_id,
          business_name: product.business_name,
          price: product.price,
          quantity: 1,
        },
      ];
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Added to cart');
  };

  const goToCart = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const groupedProducts = groupByCategory();

  return (
    <div className="min-h-screen bg-slate-50" data-testid="products-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Postcode Checker Section */}
        {!hasValidPinCode ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 max-w-2xl mx-auto" data-testid="pincode-checker-section">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Check Service Availability</h2>
              <p className="text-slate-600">Enter your postcode to see available services in your area</p>
            </div>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Enter your postcode (e.g., CO27FQ)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkPinCode()}
                className="h-12"
                data-testid="pincode-input"
              />
              <Button
                onClick={checkPinCode}
                disabled={loading}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                data-testid="check-pincode-button"
              >
                <Search className="h-5 w-5 mr-2" />
                Check
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with postcode info */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Order Products</h1>
                <p className="text-slate-600 mt-1">
                  Service area: <span className="font-semibold text-blue-600">{pinCode}</span>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('pinCode');
                      setHasValidPinCode(false);
                      setPinCode('');
                      setProducts([]);
                    }}
                    className="ml-3 text-sm text-blue-600 hover:underline"
                    data-testid="change-postcode"
                  >
                    Change postcode
                  </button>
                </p>
              </div>
            </div>

            {/* Service Type Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {serviceTypes.map(type => (
                <Button
                  key={type.name}
                  onClick={() => setSelectedServiceType(type.name)}
                  variant={selectedServiceType === type.name ? "default" : "outline"}
                  className={selectedServiceType === type.name ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                  data-testid={`service-type-${type.name}`}
                >
                  {type.name}
                </Button>
              ))}
            </div>

            {/* Products List */}
            <div className="space-y-4" data-testid="products-list">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <div key={category} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                    data-testid={`category-toggle-${category}`}
                  >
                    <h2 className="text-xl font-semibold text-slate-800">{category}</h2>
                    {expandedCategories[category] ? (
                      <ChevronUp className="h-6 w-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-600" />
                    )}
                  </button>

                  {expandedCategories[category] && (
                    <div className="border-t border-slate-200">
                      {categoryProducts.map(product => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-slate-50"
                          data-testid={`product-${product.id}`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900" data-testid={`product-name-${product.id}`}>
                                {product.name}
                              </h3>
                              {product.subcategory && (
                                <p className="text-sm text-slate-500">{product.subcategory}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="bg-green-500 text-white font-bold rounded-lg px-6 py-3" data-testid={`product-price-${product.id}`}>
                              £{product.price.toFixed(2)}
                            </div>
                            <Button
                              onClick={() => addToCart(product)}
                              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                              data-testid={`add-to-cart-${product.id}`}
                            >
                              <ShoppingCart className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {totalItems > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={goToCart}
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl"
              data-testid="view-cart-button"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              View Cart ({totalItems})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};