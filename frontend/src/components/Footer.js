import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Contact Us
            </h3>
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 rounded-full p-2">
                    <Phone className="h-4 w-4 text-blue-900" />
                  </div>
                  <span className="font-semibold text-sm md:text-base">Call Us</span>
                </div>
                <a href="tel:+447777367078" className="text-white hover:text-yellow-400 transition-colors ml-10 text-sm md:text-base">
                  +44 7777 367078
                </a>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 rounded-full p-2">
                    <Mail className="h-4 w-4 text-blue-900" />
                  </div>
                  <span className="font-semibold text-sm md:text-base">Email Us</span>
                </div>
                <a href="mailto:support@laundry-express.co.uk" className="text-white hover:text-yellow-400 transition-colors ml-10 break-all text-sm md:text-base">
                  support@laundry-express.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Useful Links
            </h3>
            <ul className="space-y-3 mt-6">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <span className="text-yellow-400">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <span className="text-yellow-400">→</span> Services
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <span className="text-yellow-400">→</span> Order Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours & Service Area */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Working Hours
            </h3>
            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-2">
                <div className="bg-yellow-400 rounded-full p-1 mt-1">
                  <Clock className="h-3 w-3 text-blue-900" />
                </div>
                <div className="text-xs md:text-sm">
                  <p className="font-semibold">Mon-Sat: 8AM - 8PM</p>
                  <p className="mt-1">Sunday: 9AM - 5PM</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                  <div className="bg-yellow-400 rounded-full p-1">
                    <MapPin className="h-3 w-3 text-blue-900" />
                  </div>
                  Service Area:
                </h4>
                <p className="text-xs md:text-sm ml-7">
                  Colchester & Surrounding Areas
                </p>
              </div>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Subscribe
            </h3>
            <div className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  data-testid="subscribe-email-input"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 md:px-6 rounded-lg transition-colors"
                  data-testid="subscribe-button"
                >
                  <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs md:text-sm text-center md:text-left">
              <p>© 2025 Laundry Express. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <div className="bg-white px-2 py-1 md:px-3 md:py-2 rounded">
                <span className="text-blue-600 font-bold text-xs md:text-sm">VISA</span>
              </div>
              <div className="bg-white px-2 py-1 md:px-3 md:py-2 rounded">
                <span className="text-slate-700 font-bold text-xs md:text-sm">Mastercard</span>
              </div>
              <div className="bg-white px-2 py-1 md:px-3 md:py-2 rounded">
                <span className="text-blue-500 font-bold text-xs md:text-sm">AMEX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};