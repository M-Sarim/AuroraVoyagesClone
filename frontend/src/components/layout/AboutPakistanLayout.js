import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AboutPakistanLayout = ({ title, subtitle, heroImage, children }) => {
  const location = useLocation();
  
  // Navigation items for the About Pakistan section
  const navItems = [
    { name: "Safe Travel", href: "/safe-travel" },
    { name: "Visa Information", href: "/visa-info" },
    { name: "Geography of Pakistan", href: "/geography" },
    { name: "General Information", href: "/info" },
    { name: "Weather & Seasons", href: "/weather" },
    { name: "Regulations & Culture Hub", href: "/regulations-culture" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero section */}
      <div 
        className="relative h-80 bg-cover bg-center" 
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container-custom h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white max-w-2xl">{subtitle}</p>
        </div>
      </div>

      {/* Navigation and content */}
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar navigation */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Pakistan</h3>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPakistanLayout;
