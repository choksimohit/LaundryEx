import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId, delta) => {
    const updatedCart = cart
      .map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const minOrder = 30;
  const canCheckout = totalAmount >= minOrder;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="cart-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-cart">
            <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-6">Your cart is empty</p>
            <Button
              onClick={() => navigate('/services')}
              className="rounded-full bg-blue-600 hover:bg-blue-700"
              data-testid="browse-services-button"
            >
              Browse Services
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div
                  key={item.product_id}
                  className="bg-white rounded-2xl p-6 border border-slate-200"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-1" data-testid={`cart-item-name-${item.product_id}`}>{item.product_name}</h3>
                      <p className="text-slate-600 text-sm mb-1">{item.category}</p>
                      <p className="text-slate-500 text-xs mb-2">By {item.business_name}</p>
                      <p className="text-blue-600 font-semibold" data-testid={`cart-item-price-${item.product_id}`}>£{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full h-8 w-8"
                          onClick={() => updateQuantity(item.product_id, -1)}
                          data-testid={`decrease-cart-quantity-${item.product_id}`}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium" data-testid={`cart-item-quantity-${item.product_id}`}>{item.quantity}</span>
                        <Button
                          size="icon"
                          className="rounded-full h-8 w-8 bg-blue-600 hover:bg-blue-700"
                          onClick={() => updateQuantity(item.product_id, 1)}
                          data-testid={`increase-cart-quantity-${item.product_id}`}
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full text-red-500 hover:bg-red-50"
                        onClick={() => removeItem(item.product_id)}
                        data-testid={`remove-cart-item-${item.product_id}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-indigo-600" data-testid="cart-total">£{totalAmount.toFixed(2)}</span>
              </div>

              {!canCheckout && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl" data-testid="minimum-order-warning">
                  <p className="text-sm text-amber-800">
                    Minimum order value is £{minOrder.toFixed(2)}. Add £{(minOrder - totalAmount).toFixed(2)} more to checkout.
                  </p>
                </div>
              )}

              <Button
                onClick={() => navigate('/checkout')}
                disabled={!canCheckout}
                className="w-full h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="proceed-to-checkout-button"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};