import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from './pages/MainContent';
import BestSellers from './components/BestSellers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './pages/admin/AdminLayout';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import ScrollToTop from './components/ScrollToTop';


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
       
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/bestsellers" element={<BestSellers />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

export default App;