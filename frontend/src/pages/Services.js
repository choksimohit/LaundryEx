import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'dry-cleaning',
      title: 'Dry Cleaning',
      description: 'Expert dry cleaning for delicate fabrics and formal wear. We handle everything from suits to evening dresses with care.',
      image: 'https://images.unsplash.com/photo-1617691120034-5bf8a1a31fbb?crop=entropy&cs=srgb&fm=jpg&q=85',
      categories: ['Accessories', 'Bottoms', 'Tops', 'Outerwear', 'Dresses'],
      priceRange: '£4.95 - £49.95'
    },
    {
      id: 'household-bulk',
      title: 'Household & Bulk Laundry',
      description: 'Professional cleaning for household items including duvets, curtains, towels, and bedding of all sizes.',
      image: 'https://images.unsplash.com/photo-1631679706099-a826cb8a3464?crop=entropy&cs=srgb&fm=jpg&q=85',
      categories: ['Bedding', 'Curtains', 'Towels'],
      priceRange: '£2.95 - £24.95'
    },
    {
      id: 'ironing',
      title: 'Ironing Service',
      description: 'Professional ironing service for crisp, wrinkle-free clothes. Perfect for shirts, blouses, trousers, and more.',
      image: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?crop=entropy&cs=srgb&fm=jpg&q=85',
      categories: ['Shirts', 'Trousers', 'Dresses & Others'],
      priceRange: '£2.50 - £4.95'
    },
    {
      id: 'laundry',
      title: 'Laundry (Wash & Fold)',
      description: 'Standard and delicate wash services. We wash, dry, and fold your clothes with care. Minimum 3kg order.',
      image: 'https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&q=85',
      categories: ['Standard Wash', 'Delicate Wash'],
      priceRange: '£3.95 - £4.95 per kg'
    },
    {
      id: 'wash-iron',
      title: 'Wash & Iron',
      description: 'Complete service including washing, drying, and professional ironing. Your clothes come back fresh and ready to wear.',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=srgb&fm=jpg&q=85',
      categories: ['Standard Wash & Iron'],
      priceRange: '£5.95 per kg'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="services-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Our Services</h1>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl">
            Premium laundry and dry cleaning services in Colchester. Choose from our range of professional services tailored to your needs.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              data-testid={`service-card-${service.id}`}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {service.priceRange}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-slate-800">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => navigate('/order')}  
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg h-12 font-semibold"
                  data-testid={`order-${service.id}`}
                >
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-20 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Laundry Express?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-slate-600">Same-day and express services available for urgent needs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-slate-600">Professional care with eco-friendly products</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Pickup & Delivery</h3>
              <p className="text-slate-600">Convenient service right to your doorstep</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};