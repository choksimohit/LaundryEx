import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';
import { toast } from 'sonner';

export const Landing = () => {
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAvailability = async () => {
    if (!pinCode || pinCode.length < 3) {
      toast.error('Please enter a valid postcode');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/pincode/check', { pin_code: pinCode.toUpperCase() });
      if (response.data.available) {
        toast.success('Service is available!');
        sessionStorage.setItem('pinCode', pinCode.toUpperCase());
        sessionStorage.setItem('businesses', JSON.stringify(response.data.businesses));
        navigate('/order');
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
    <div className="relative min-h-screen" data-testid="landing-page">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=2070)',
          filter: 'brightness(0.4)'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-white" data-testid="hero-title">
            Premium Laundry &
            <br />
            Dry Cleaning in
            <br />
            Colchester
          </h1>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-2xl mt-8 max-w-md" data-testid="pincode-checker">
            <h3 className="text-lg font-semibold mb-2 text-white">Add your Postcode</h3>
            <p className="text-xs text-white/80 mb-3">Please add postcode (eg: CO27FQ)</p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter postcode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAvailability()}
                className="h-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
                data-testid="pincode-input"
              />
              <Button
                onClick={checkAvailability}
                disabled={loading}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium whitespace-nowrap"
                data-testid="check-availability-button"
              >
                Check
              </Button>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/447777367078"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl z-50 flex items-center gap-2"
        data-testid="whatsapp-button"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="font-medium">Need Help?</span>
      </a>
    </div>
  );
};