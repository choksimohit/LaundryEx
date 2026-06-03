import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Sitemap = () => {
  const sections = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Order Now', path: '/order' },
      ],
    },
    {
      title: 'Customer',
      links: [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'My Orders', path: '/dashboard' },
        { name: 'Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Laundry Service', path: '/order' },
        { name: 'Dry Cleaning Service', path: '/order' },
        { name: 'Wash & Iron Service', path: '/order' },
        { name: 'Ironing Service', path: '/order' },
        { name: 'Household', path: '/order' },
        { name: 'Alteration & Repairs', path: '/order' },
        { name: 'Shoe Cleaning', path: '/order' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4" data-testid="sitemap-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Sitemap</h1>
        <p className="text-slate-500 mb-10">Overview of all pages on Laundry Express</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-blue-600 mb-4 border-b border-slate-100 pb-3">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors text-sm group"
                      data-testid={`sitemap-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
