import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <h1 className="text-2xl font-bold text-indigo-600">FreshFold</h1>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'customer' && (
                  <>
                    <Link to="/services" data-testid="services-link">
                      <Button variant="ghost" className="rounded-full">
                        Services
                      </Button>
                    </Link>
                    <Link to="/cart" className="relative" data-testid="cart-link">
                      <Button variant="ghost" className="rounded-full" size="icon">
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemsCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                            {cartItemsCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                    <Link to="/dashboard" data-testid="dashboard-link">
                      <Button variant="ghost" className="rounded-full" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </>
                )}
                {user.role.includes('admin') && (
                  <Link to="/admin" data-testid="admin-link">
                    <Button variant="ghost" className="rounded-full">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="rounded-full"
                  size="icon"
                  data-testid="logout-button"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="login-link">
                  <Button variant="ghost" className="rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-testid="register-link">
                  <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};