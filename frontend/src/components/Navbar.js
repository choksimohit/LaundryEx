import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Phone, Mail, Facebook, Instagram, Menu, X } from 'lucide-react';
import { getAuth, clearAuth } from '../utils/auth';
import { Button } from './ui/button';

export const Navbar = ({ cartItemsCount = 0 }) => {
  const navigate = useNavigate();
  const { user } = getAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/cart');
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-blue-600 text-white py-2" data-testid="top-bar">
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

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm" data-testid="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center" data-testid="logo-link">
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold text-blue-600">Laundry Express</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Fresh Clothes, Excellent Care</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                HOME
              </Link>
              <Link to="/services" className="text-slate-700 hover:text-blue-600 font-medium text-sm lg:text-base" data-testid="services-nav-link">
                SERVICE
              </Link>
              <Link to="/order" className="text-slate-700 hover:text-blue-600 font-medium text-sm lg:text-base" data-testid="order-nav-link">
                ORDER NOW
              </Link>
              {user && user.role === 'customer' && (
                <Link to="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium text-sm lg:text-base">
                  MY ORDERS
                </Link>
              )}
              {user?.role?.includes('admin') && (
                <Link to="/admin" className="text-slate-700 hover:text-blue-600 font-medium text-sm lg:text-base" data-testid="admin-nav-link">
                  ADMIN
                </Link>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <button onClick={handleCartClick} className="relative" data-testid="cart-link">
                    <Button className="rounded-md bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                      {cartItemsCount > 0 && (
                        <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold" data-testid="cart-count">
                          {cartItemsCount}
                        </span>
                      )}
                    </Button>
                  </button>
                  <Button onClick={handleLogout} variant="ghost" size="icon" data-testid="logout-button">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" data-testid="login-link">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <button onClick={handleCartClick} className="relative" data-testid="cart-button">
                    <Button className="rounded-md bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-blue-600 rounded-full px-1.5 py-0.5 text-xs font-bold" data-testid="cart-count">
                          {cartItemsCount}
                        </span>
                      )}
                    </Button>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button & Cart */}
            <div className="flex md:hidden items-center gap-3">
              <button onClick={handleCartClick} className="relative" data-testid="mobile-cart-button">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold" data-testid="mobile-cart-count">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700"
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200" data-testid="mobile-menu">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-slate-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link
                  to="/services"
                  className="text-slate-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SERVICE
                </Link>
                <Link
                  to="/order"
                  className="text-slate-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ORDER NOW
                </Link>
                {user && user.role === 'customer' && (
                  <Link
                    to="/dashboard"
                    className="text-slate-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    MY ORDERS
                  </Link>
                )}
                {user?.role?.includes('admin') && (
                  <Link
                    to="/admin"
                    className="text-slate-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ADMIN PANEL
                  </Link>
                )}
                <div className="border-t border-slate-200 pt-3 mt-2">
                  {user ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};