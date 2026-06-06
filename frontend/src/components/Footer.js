import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <a href="tel:+447777367076" className="text-white hover:text-yellow-400 transition-colors ml-10 text-sm md:text-base">
                  +44 7777 367076
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
              <li>
                <Link to="/blog" className="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <span className="text-yellow-400">→</span> Blog
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <span className="text-yellow-400">→</span> Sitemap
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

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs md:text-sm text-center md:text-left space-y-1">
              <p>© 2025 Laundry Express. All rights reserved.</p>
              <p className="text-blue-300">
                Designed & Developed by{' '}
                <a href="https://www.techgynt.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  Techgynt Infotech Private Limited
                </a>
              </p>
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