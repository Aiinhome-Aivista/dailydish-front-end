import { Send } from 'lucide-react';
import cookerIcon from '../../../assets/cooker.svg';
import { useNavigate } from 'react-router-dom';

const LandingFooter = () => {
  const navigate = useNavigate();
  return (
    <footer className="pt-15">
      <div className="w-full">
        <div className="grid md:grid-cols-4 gap-12 mb-8 px-6 md:px-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src={cookerIcon} alt="Bowl" className="w-8 h-8" />
              <span className="text-brand-dark font-bold text-lg">DailyDish</span>
            </div>
            <p className="text-brand-dark text-lg leading-none font-medium">
              Personalized Dr. Foodie for recipe generator based on ingredients, cuisine preference, and nutritional value.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-brand-dark mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-brand-dark cursor-pointer">
              <li><a onClick={()=> navigate("/How-it-Works")} className="hover:text-brand-dark transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-brand-dark mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-brand-dark">
              <li><a href="#" className="hover:text-brand-dark transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-dark transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-brand-dark mb-4">Newsletter</h4>
            <p className="text-brand-dark text-sm mb-4">Weekly recipes and cooking tips</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full pl-4 pr-12 py-3 bg-brand-light rounded text-sm text-brand-dark placeholder:text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-dark/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white p-1.5 rounded hover:bg-opacity-90">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-brand-accent w-full py-8">
          <p className="text-[#43533466] text-xs font-bold">@2026 Aiinhome Technologies Pvt. Ltd. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
