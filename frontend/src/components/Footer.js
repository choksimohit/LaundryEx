import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Contact Us
            </h3>
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 rounded-full p-2">
                    <Phone className="h-4 w-4 text-blue-900" />
                  </div>
                  <span className="font-semibold">Call Us</span>
                </div>
                <a href="tel:+447777367078" className="text-white hover:text-yellow-400 transition-colors ml-10">
                  +44 7777 367078
                </a>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 rounded-full p-2">
                    <Mail className="h-4 w-4 text-blue-900" />
                  </div>
                  <span className="font-semibold">Email Us</span>
                </div>
                <a href="mailto:support@laundry-express.co.uk" className="text-white hover:text-yellow-400 transition-colors ml-10 break-all">
                  support@laundry-express.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Useful Links
            </h3>
            <ul className="space-y-3 mt-6">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <span className="text-yellow-400">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <span className="text-yellow-400">→</span> Service
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <span className="text-yellow-400">→</span> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <span className="text-yellow-400">→</span> Terms and Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours & Service Area */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Working Hours
            </h3>
            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-2">
                <div className="bg-yellow-400 rounded-full p-1 mt-1">
                  <Clock className="h-3 w-3 text-blue-900" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Monday to Saturday: 8AM - 8PM</p>
                  <p className="mt-1">Sunday: 9AM - 5PM</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <div className="bg-yellow-400 rounded-full p-1">
                    <MapPin className="h-3 w-3 text-blue-900" />
                  </div>
                  Service Area:
                </h4>
                <p className="text-sm ml-7">
                  Highwoods | Stanway | Berechurch<br />
                  Greenstead | Marks Tey | Wivenhoe<br />
                  Layer De La Haye | Shrub End<br />
                  Fingringhoe | Hythe
                </p>
              </div>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-400 inline-block pb-1">
              Subscribe Us
            </h3>
            <div className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  data-testid="subscribe-email-input"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-6 rounded-lg transition-colors"
                  data-testid="subscribe-button"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center md:text-left">
              <p>Crafted with passion by Emergent Agent © 2025. All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded flex items-center gap-2">
                <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-slate-600 font-medium">Guaranteed safe & secure checkout</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-600 font-bold text-sm">VISA</span>
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-slate-700 font-bold text-sm">Mastercard</span>
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-blue-500 font-bold text-sm">AMEX</span>
            </div>
            <div className="bg-white px-3 py-2 rounded">
              <span className="text-slate-700 font-bold text-sm">Discover</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
