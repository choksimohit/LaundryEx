import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Clock, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';
import { toast } from 'sonner';

export const Landing = () => {
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAvailability = async () => {
    if (!pinCode || pinCode.length < 5) {
      toast.error('Please enter a valid pin code');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/pincode/check', { pin_code: pinCode });
      if (response.data.available) {
        toast.success('Service available in your area!');
        sessionStorage.setItem('pinCode', pinCode);
        sessionStorage.setItem('businesses', JSON.stringify(response.data.businesses));
        navigate('/services');
      } else {
        toast.error('Service not available in your area yet');
      }
    } catch (error) {
      toast.error('Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50" data-testid="landing-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 w-fit mb-6">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">Premium Laundry Service</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-800" data-testid="hero-title">
              Fresh, Clean
              <span className="text-indigo-600"> Laundry</span>
              <br />Delivered to You
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-slate-600 mb-8">
              Experience premium laundry services with free pickup and delivery.
              Professional care for your clothes, so you can focus on what matters.
            </p>

            <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-200/50 rounded-3xl p-8 mb-8" data-testid="pincode-checker">
              <h3 className="text-2xl font-semibold mb-4">Check Service Availability</h3>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter your pin code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAvailability()}
                  className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  data-testid="pincode-input"
                />
                <Button
                  onClick={checkAvailability}
                  disabled={loading}
                  className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all"
                  data-testid="check-availability-button"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Check
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-emerald-50 rounded-2xl p-4 mb-2 inline-block">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">24hr Service</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-50 rounded-2xl p-4 mb-2 inline-block">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">Quality Assured</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-50 rounded-2xl p-4 mb-2 inline-block">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">Eco-Friendly</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1677666939395-fbeb465f80d0?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Modern laundry room interior"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};