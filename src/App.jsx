import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import MainContent from './pages/MainContent';
import BestSellers from './components/BestSellers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HeaderNav from './components/HeaderNav';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './pages/Checkout';
import Account from './pages/Account';


// Add this CSS to your styles
const toastStyles = `
  .Toastify__toast-container {
    padding: 16px;
  }
  
  .Toastify__toast {
    border-radius: 10px !important;
    padding: 16px !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }
  
  .Toastify__toast--success {
    background: #4CAF50 !important;
  }
  
  .Toastify__toast--error {
    background: #ef4444 !important;
  }
  
  .Toastify__progress-bar {
    height: 3px !important;
  }
`;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <style>{toastStyles}</style>
        <ScrollToTop />
        <div className="app-container">
          <Routes>
            {/* All Public Routes - No login required */}
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/bestsellers" element={<BestSellers />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/full-length" element={<MainContent />} />
            <Route path="/ankle-length" element={<MainContent />} />
            <Route path="/pyjamas" element={<MainContent />} />
            <Route path="/catalog" element={<MainContent />} />
            <Route path="/contact" element={<MainContent />} />
            <Route path="/admin/*" element={<HeaderNav />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;