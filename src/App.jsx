import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from './pages/MainContent';
import BestSellers from './components/BestSellers';
import AnnouncementBar from './components/AnnouncementBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './pages/admin/AdminLayout';
import ProductDetails from './pages/ProductDetails';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <AnnouncementBar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/bestsellers" element={<BestSellers />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
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