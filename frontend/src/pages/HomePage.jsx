import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Truck, TrendingUp, Zap, Award, ArrowRight, ShoppingBag, UtensilsCrossed, Shirt, Laptop, Sparkles, Heart, Percent } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import { productAPI, categoryAPI, storeAPI, bannerAPI } from '../utils/api';

const SectionHeader = ({ title, subtitle, link }) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
    </div>
    {link && <Link to={link} className="hidden sm:flex items-center space-x-2 text-orange-500 font-semibold hover:text-orange-600 transition">View All <ArrowRight className="w-4 h-4" /></Link>}
  </div>
);

const ProductCard = ({ product }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all group">
    <Link to={`/product/${product._id}`}>
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
        )}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">{product.discount}% OFF</div>
        )}
        {product.isVeg && <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">V</div>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{product.store?.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            {product.comparePrice > 0 && <span className="text-sm text-gray-400 line-through">₹{product.comparePrice}</span>}
          </div>
          <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-green-600 fill-green-600" />
            <span className="text-xs font-semibold text-green-600">{product.rating || 'NEW'}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const StoreCard = ({ store }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all">
    <Link to={`/store/${store.slug}`}>
      <div className="relative h-40 bg-gradient-to-br from-orange-100 to-red-50">
        {store.banner ? <img src={store.banner} alt={store.name} className="w-full h-full object-cover" /> : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🏪</div>
        )}
        <div className="absolute -bottom-8 left-4">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl border-2 border-white">
            {store.logo ? <img src={store.logo} className="w-full h-full object-cover rounded-xl" /> : '🏪'}
          </div>
        </div>
      </div>
      <div className="pt-10 p-4">
        <h3 className="font-semibold text-gray-900">{store.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{store.address?.city}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="text-sm font-semibold">{store.rating || 'NEW'}</span></div>
          <span className="text-xs text-gray-400">{store.avgDeliveryTime || '30-40 min'}</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const CategoryCard = ({ category, index }) => {
  const icons = ['🍕', '🛒', '👕', '💻', '🛋️', '💊', '📚', '⚽', '💄', '🐾'];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
      <Link to={`/category/${category.slug}`} className="w-20 h-20 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl flex items-center justify-center text-3xl hover:shadow-lg hover:from-orange-100 hover:to-red-100 transition-all border border-orange-100">
        {category.icon || icons[index % icons.length]}
      </Link>
      <span className="text-sm font-medium text-gray-700 mt-2 text-center">{category.name}</span>
    </motion.div>
  );
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredStores, setFeaturedStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, trending, flash, cats, stores] = await Promise.all([
          productAPI.getFeatured(), productAPI.getTrending(), productAPI.getFlashSale(),
          categoryAPI.getAll({}), storeAPI.getFeatured()
        ]);
        setFeaturedProducts(featured.data.data || []);
        setTrendingProducts(trending.data.data || []);
        setFlashSaleProducts(flash.data.data || []);
        setCategories(cats.data.data || []);
        setFeaturedStores(stores.data.data || []);
      } catch (error) { console.error('Error fetching data:', error); }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What's on your mind?" subtitle="Explore top categories" link="/categories" />
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {categories.slice(0, 12).map((cat, idx) => <CategoryCard key={cat._id} category={cat} index={idx} />)}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={<span className="flex items-center"><Zap className="w-8 h-8 text-orange-500 mr-2" /> Flash Sale</span>} subtitle="Limited time offers" link="/flash-sale" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {flashSaleProducts.slice(0, 10).map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Products" subtitle="Top picks for you" link="/products" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.slice(0, 10).map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={<span className="flex items-center"><TrendingUp className="w-8 h-8 text-orange-500 mr-2" /> Trending Now</span>} subtitle="Most popular products" link="/trending" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingProducts.slice(0, 10).map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Popular Stores" subtitle="Top rated stores near you" link="/stores" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStores.slice(0, 8).map((store) => <StoreCard key={store._id} store={store} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6"><Truck className="w-12 h-12 mx-auto mb-4 opacity-80" /><h3 className="text-xl font-bold">Free Delivery</h3><p className="text-orange-100 mt-2">On orders above ₹499</p></div>
            <div className="p-6"><Percent className="w-12 h-12 mx-auto mb-4 opacity-80" /><h3 className="text-xl font-bold">Best Offers</h3><p className="text-orange-100 mt-2">Daily deals & discounts</p></div>
            <div className="p-6"><Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" /><h3 className="text-xl font-bold">Premium Quality</h3><p className="text-orange-100 mt-2">100% satisfaction</p></div>
            <div className="p-6"><Heart className="w-12 h-12 mx-auto mb-4 opacity-80" /><h3 className="text-xl font-bold">Easy Returns</h3><p className="text-orange-100 mt-2">Hassle-free returns</p></div>
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-16 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">Download the App</h2>
                <p className="text-gray-300 text-lg mb-8">Get the best experience with our mobile app. Order food, groceries, fashion & more on the go!</p>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="flex items-center space-x-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
                    <ShoppingBag className="w-6 h-6" /><span>App Store</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
                    <ShoppingBag className="w-6 h-6" /><span>Google Play</span>
                  </a>
                </div>
              </div>
              <div className="text-center text-8xl">📱</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;