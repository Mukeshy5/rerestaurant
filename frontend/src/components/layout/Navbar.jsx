import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../redux/slices/authSlice';
import { fetchCart } from '../../redux/slices/cartSlice';
import { Search, ShoppingCart, User, Menu, X, Heart, Store, ChevronDown, LogOut, Package, Settings, Headphones } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    if (isAuthenticated) dispatch(fetchCart());
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Wolfinic</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, products, groceries..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent focus:border-orange-500 rounded-full text-sm outline-none transition-all"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <button type="submit" className="absolute right-2 top-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-600 transition">Search</button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{itemCount}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border p-2">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowUserMenu(false)}>
                        <User className="w-5 h-5 text-gray-500" /> <span>My Profile</span>
                      </Link>
                      <Link to="/orders" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowUserMenu(false)}>
                        <Package className="w-5 h-5 text-gray-500" /> <span>My Orders</span>
                      </Link>
                      <Link to="/wishlist" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowUserMenu(false)}>
                        <Heart className="w-5 h-5 text-gray-500" /> <span>Wishlist</span>
                      </Link>
                      {user?.role === 'store_owner' && (
                        <Link to="/store/dashboard" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowUserMenu(false)}>
                          <Store className="w-5 h-5 text-gray-500" /> <span>Store Dashboard</span>
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowUserMenu(false)}>
                          <Settings className="w-5 h-5 text-gray-500" /> <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link to="/support" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition" onClick={() => setShowUserMenu(false)}>
                        <Headphones className="w-5 h-5 text-gray-500" /> <span>Support</span>
                      </Link>
                      <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 rounded-xl transition w-full text-red-600">
                        <LogOut className="w-5 h-5" /> <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                Sign In
              </Link>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none" />
              </form>
              <Link to="/" className="block py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/categories" className="block py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Categories</Link>
              <Link to="/stores" className="block py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Stores</Link>
              <Link to="/offers" className="block py-2 text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Offers</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;