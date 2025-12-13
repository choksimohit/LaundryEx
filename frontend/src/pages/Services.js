import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import api from '../utils/api';
import { toast } from 'sonner';
import { isAuthenticated } from '../utils/auth';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const loadServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const categories = ['all', ...new Set(services.map(s => s.category))];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const addToCart = (service) => {
    const existingItem = cart.find(item => item.service_id === service.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.service_id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          service_id: service.id,
          service_name: service.name,
          business_id: service.business_id,
          business_name: service.business_name,
          price: service.base_price,
          quantity: 1,
        },
      ];
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Added to cart');
  };

  const updateQuantity = (serviceId, delta) => {
    const updatedCart = cart
      .map(item =>
        item.service_id === serviceId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
      .filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getItemQuantity = (serviceId) => {
    const item = cart.find(item => item.service_id === serviceId);
    return item ? item.quantity : 0;
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

  return (
    <div className="min-h-screen bg-slate-50" data-testid="services-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Our Services</h1>
          <p className="text-base md:text-lg leading-relaxed text-slate-600">
            Choose from our range of premium laundry services
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap justify-center gap-2 bg-white rounded-full p-2">
            {categories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full capitalize"
                data-testid={`category-${category}`}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24" data-testid="services-grid">
          {filteredServices.map(service => {
            const quantity = getItemQuantity(service.id);
            return (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                data-testid={`service-card-${service.id}`}
              >
                {service.image_url && (
                  <div className="mb-6 rounded-2xl overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="mb-2">
                  <span className="text-sm font-medium tracking-wide uppercase text-slate-400">
                    {service.category}
                  </span>
                </div>
                <h3 className="text-2xl font-medium mb-2" data-testid={`service-name-${service.id}`}>{service.name}</h3>
                <p className="text-base leading-relaxed text-slate-600 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600" data-testid={`service-price-${service.id}`}>
                    £{service.base_price.toFixed(2)}
                  </span>
                  {quantity === 0 ? (
                    <Button
                      onClick={() => addToCart(service)}
                      className="rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                      data-testid={`add-to-cart-${service.id}`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3" data-testid={`quantity-controls-${service.id}`}>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => updateQuantity(service.id, -1)}
                        data-testid={`decrease-quantity-${service.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium w-8 text-center" data-testid={`quantity-${service.id}`}>{quantity}</span>
                      <Button
                        size="icon"
                        className="rounded-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => updateQuantity(service.id, 1)}
                        data-testid={`increase-quantity-${service.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-slate-500">
                  By {service.business_name}
                </div>
              </div>
            );
          })}
        </div>

        {totalItems > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={goToCart}
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-indigo-500/30 hover:scale-105 transition-all"
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