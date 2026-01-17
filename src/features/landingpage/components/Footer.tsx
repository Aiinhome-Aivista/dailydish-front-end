import React from 'react';
import { ChefHat, Send } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="bg-brand-beige/50 pt-16 pb-8 border-t border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <ChefHat className="text-brand-dark w-6 h-6" />
              <span className="text-brand-dark font-bold text-lg">DailyDish</span>
            </div>
            <p className="text-brand-dark/60 text-sm leading-relaxed">
              Personalized AI recipe generator based on ingredients, cuisine preference, and nutritional value.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-brand-dark mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-brand-dark/70">
              <li><a href="#" className="hover:text-brand-dark transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-brand-dark mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-brand-dark/70">
              <li><a href="#" className="hover:text-brand-dark transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-brand-dark mb-6">Newsletter</h4>
            <p className="text-brand-dark/70 text-sm mb-4">Weekly recipes and cooking tips</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full pl-4 pr-12 py-3 bg-brand-dark/10 rounded text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:ring-1 focus:ring-brand-dark/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white p-1.5 rounded hover:bg-opacity-90">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-brand-dark/5">
          <p className="text-brand-dark/40 text-xs">© 2026 DailyDish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
