import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../utils/api';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center px-4" data-testid="reset-password-page">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-200/50 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Invalid Reset Link</h2>
            <p className="text-slate-600 mb-6">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="text-blue-600 font-medium hover:underline">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center px-4" data-testid="reset-password-page">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-200/50 rounded-3xl p-8">
          {success ? (
            <div className="text-center" data-testid="reset-success">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-slate-800">Password Reset!</h2>
              <p className="text-slate-600 mb-6">Your password has been successfully changed. You can now log in with your new password.</p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700"
                data-testid="go-to-login-button"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-2 text-slate-800">Reset Password</h2>
                <p className="text-slate-600">Enter your new password below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl mt-2"
                    data-testid="new-password-input"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl mt-2"
                    data-testid="confirm-password-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                  data-testid="reset-password-button"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                  <ArrowLeft className="inline h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
