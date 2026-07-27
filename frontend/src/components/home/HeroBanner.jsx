import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Star, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  { id: 1, title: 'Delicious Food Delivered', subtitle: 'Order from your favorite restaurants', bg: 'from-orange-500 to-red-600', image: '🍕', tag: 'Food' },
  { id: 2, title: 'Fresh Groceries at Home', subtitle: 'Shop daily essentials from local stores', bg: 'from-green-500 to-emerald-600', image: '🛒', tag: 'Grocery' },
  { id: 3, title: 'Trendy Fashion Deals', subtitle: 'Discover the latest styles & brands', bg: 'from-purple-500 to-pink-600', image: '👕', tag: 'Fashion' },
  { id: 4, title: 'Electronics & Gadgets', subtitle: 'Best prices on top brands', bg: 'from-blue-500 to-cyan-600', image: '💻', tag: 'Electronics' },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mt-16 lg:mt-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-r ${slides[current].bg} opacity-10`}
        />
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="pt-8">
            <motion.div key={current} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">{slides[current].tag}</span>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">{slides[current].title}</h1>
              <p className="text-xl text-gray-600 mb-8">{slides[current].subtitle}</p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants, groceries, fashion..."
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-lg border-2 border-transparent focus:border-orange-500 text-base outline-none"
                />
              </div>
              <Link to={searchQuery ? `/search?q=${searchQuery}` : '/categories'} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all text-center whitespace-nowrap">
                Explore Now
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2"><Star className="w-5 h-5 text-yellow-500" /><span className="text-gray-600">50K+ Restaurants</span></div>
              <div className="flex items-center space-x-2"><Truck className="w-5 h-5 text-green-500" /><span className="text-gray-600">30 Min Delivery</span></div>
              <div className="flex items-center space-x-2"><Clock className="w-5 h-5 text-blue-500" /><span className="text-gray-600">24/7 Service</span></div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, scale: 0.8, rotateY: -180 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }} className="text-center">
                <span className="text-[300px] leading-none">{slides[current].image}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'w-10 bg-orange-500' : 'bg-gray-300'}`} />
        ))}
      </div>

      <button onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-lg transition hidden lg:flex">
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-lg transition hidden lg:flex">
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default HeroBanner;