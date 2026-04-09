import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../utils/api';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center px-4" data-testid="forgot-password-page">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-200/50 rounded-3xl p-8">
          {sent ? (
            <div className="text-center" data-testid="reset-email-sent">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-slate-800">Check Your Email</h2>
              <p className="text-slate-600 mb-6">
                We've sent a password reset link to <span className="font-medium text-slate-800">{email}</span>. 
                Please check your inbox and click the link to reset your password.
              </p>
              <p className="text-sm text-slate-500 mb-6">The link will expire in 1 hour.</p>
              <Link to="/login" className="text-blue-600 font-medium hover:underline" data-testid="back-to-login-link">
                <ArrowLeft className="inline h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-2 text-slate-800">Forgot Password</h2>
                <p className="text-slate-600">Enter your email and we'll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl mt-2"
                    data-testid="forgot-email-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                  data-testid="send-reset-link-button"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-blue-600 font-medium hover:underline" data-testid="back-to-login-link">
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
