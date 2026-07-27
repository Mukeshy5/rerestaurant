import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { login, clearError } from '../redux/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, User, Store, Shield, UtensilsCrossed } from 'lucide-react';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ ...form, loginType }));
  };

  const tabs = [
    { id: 'user', label: 'User', icon: User, desc: 'Food, Grocery & More' },
    { id: 'store', label: 'Store', icon: Store, desc: 'Store Owner Login' },
    { id: 'admin', label: 'Admin', icon: Shield, desc: 'Admin Panel' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your Wolfinic account</p>
          </div>

          {/* Login Type Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = loginType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setLoginType(tab.id); dispatch(clearError()); }}
                  className={`flex-1 flex flex-col items-center py-2.5 px-2 rounded-xl transition-all ${
                    isActive ? 'bg-white shadow-md text-orange-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-orange-500' : ''}`} />
                  <span className="text-xs font-semibold">{tab.label}</span>
                  <span className="text-[10px] text-gray-400 hidden sm:block">{tab.desc}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-start space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition" placeholder="Enter your email" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5">
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-orange-500 font-medium hover:text-orange-600">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : `Sign In as ${tabs.find(t => t.id === loginType)?.label}`}
            </button>
          </form>

          {loginType === 'user' && (
            <div className="mt-6 text-center">
              <p className="text-gray-500">Don't have an account? <Link to="/register" className="text-orange-500 font-semibold hover:text-orange-600">Sign Up</Link></p>
            </div>
          )}

          {loginType === 'store' && (
            <div className="mt-6 text-center">
              <p className="text-gray-500">Don't have a store? <Link to="/register" className="text-orange-500 font-semibold hover:text-orange-600">Register Your Store</Link></p>
            </div>
          )}

          {loginType === 'admin' && (
            <div className="mt-6 pt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700 text-center">Admin access is restricted to authorized personnel only.</p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;