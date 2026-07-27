import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { getProfile } from './redux/slices/authSlice';

// Placeholder pages
const CartPage = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <p className="text-gray-500 mt-4">Cart functionality with add, remove, update items, coupon application, and checkout.</p>
    </div>
  </div>
);

const DashboardPage = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-semibold">Profile</h3><p className="text-gray-500 mt-2">Manage your personal information</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-semibold">Orders</h3><p className="text-gray-500 mt-2">Track and manage your orders</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-semibold">Wallet</h3><p className="text-gray-500 mt-2">View wallet balance and transactions</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-semibold">Addresses</h3><p className="text-gray-500 mt-2">Manage delivery addresses</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-semibold">Wishlist</h3><p className="text-gray-500 mt-2">Your saved items</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm"><h3 className="font-semibold">Support</h3><p className="text-gray-500 mt-2">Get help and support</p></div>
      </div>
    </div>
  </div>
);

const OrdersPage = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p className="text-gray-500 mt-4">View all your orders, track status, cancel, return or reorder.</p>
    </div>
  </div>
);

const ProductsPage = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">All Products</h1>
      <p className="text-gray-500 mt-4">Browse all products with filters, sorting, and search.</p>
    </div>
  </div>
);

const StoresPage = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">All Stores</h1>
      <p className="text-gray-500 mt-4">Discover restaurants, grocery stores, fashion brands and more.</p>
    </div>
  </div>
);

const CategoriesPage = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="text-gray-500 mt-4">Browse by category - Food, Grocery, Fashion, Electronics & more.</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500 mt-4">Manage users, stores, products, orders, analytics and platform settings.</p>
    </div>
  </div>
);

const StoreDashboard = () => (
  <div className="min-h-screen pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Store Dashboard</h1>
      <p className="text-gray-500 mt-4">Manage your store, products, orders, earnings and settings.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">Go Home</a>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/store/dashboard" element={<StoreDashboard />} />
            <Route path="/product/:id" element={<ProductsPage />} />
            <Route path="/store/:slug" element={<StoresPage />} />
            <Route path="/category/:slug" element={<CategoriesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;