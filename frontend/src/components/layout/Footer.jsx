import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-2xl font-bold">Wolfinic</span>
            </div>
            <p className="text-gray-400 mb-6">Your one-stop destination for food, groceries, fashion, electronics & more. Delivering happiness to your doorstep.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"><Globe className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition">Home</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-orange-400 transition">Categories</Link></li>
              <li><Link to="/stores" className="text-gray-400 hover:text-orange-400 transition">Stores</Link></li>
              <li><Link to="/offers" className="text-gray-400 hover:text-orange-400 transition">Today's Offers</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-orange-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Partners</h3>
            <ul className="space-y-3">
              <li><Link to="/register-store" className="text-gray-400 hover:text-orange-400 transition">Register as Store</Link></li>
              <li><Link to="/register-delivery" className="text-gray-400 hover:text-orange-400 transition">Become a Delivery Partner</Link></li>
              <li><Link to="/advertise" className="text-gray-400 hover:text-orange-400 transition">Advertise with Us</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-orange-400 transition">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-0.5" />
                <span className="text-gray-400">123, Wolfinic Tower, MG Road, Bangalore - 560001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400">support@wolfinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; 2026 Wolfinic. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</Link>
            <Link to="/refund" className="text-gray-500 hover:text-gray-300 text-sm">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;