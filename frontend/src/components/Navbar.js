import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { getAuth, clearAuth } from '../utils/auth';
import { Button } from './ui/button';

export const Navbar = ({ cartItemsCount = 0 }) => {
  const navigate = useNavigate();
  const { user } = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <>
      <div className="bg-blue-600 text-white py-2" data-testid="top-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+447777367078" className="flex items-center gap-2 hover:text-blue-200">
                <Phone className="h-4 w-4" />
                +44 7777 367078
              </a>
              <a href="mailto:support@laundry-express.co.uk" className="flex items-center gap-2 hover:text-blue-200">
                <Mail className="h-4 w-4" />
                support@laundry-express.co.uk
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Follow Us:</span>
              <a href="#" className="hover:text-blue-200">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-blue-200">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-white shadow-sm" data-testid="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center" data-testid="logo-link">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-blue-600">Laundry Express</h1>
                <p className="text-xs text-slate-500">Fresh Clothes, Excellent Care</p>
              </div>
            </Link>

            <div className="flex items-center gap-8">
              <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium">
                HOME
              </Link>
              <Link to="/services" className="text-slate-700 hover:text-blue-600 font-medium" data-testid="services-nav-link">
                SERVICE
              </Link>
              <Link to="/order" className="text-slate-700 hover:text-blue-600 font-medium" data-testid="order-nav-link">
                ORDER NOW
              </Link>
              {user && user.role === 'customer' && (
                <Link to="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium">
                  MY ORDERS
                </Link>
              )}
              {user?.role?.includes('admin') && (
                <Link to="/admin" className="text-slate-700 hover:text-blue-600 font-medium" data-testid="admin-nav-link">
                  ADMIN PANEL
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'customer' && (
                    <Link to="/cart" className="relative" data-testid="cart-link">
                      <Button className="rounded-md bg-blue-600 hover:bg-blue-700">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart
                        {cartItemsCount > 0 && (
                          <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold" data-testid="cart-count">
                            {cartItemsCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="icon"
                    data-testid="logout-button"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" data-testid="login-link">
                    <Button variant="ghost">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" data-testid="register-link">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
                      GET A QUOTE
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};