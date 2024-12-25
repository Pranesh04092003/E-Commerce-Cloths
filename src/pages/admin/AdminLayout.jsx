import { Routes, Route } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import AdminProductsList from './AdminProductsList';
import AdminProductForm from './AdminProductForm';
import '../../styles/Admin/AdminProducts.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <Routes>
          <Route path="products" element={<AdminProductsList />} />
          <Route path="products/add" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout; 