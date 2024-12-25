import { Link, useLocation } from 'react-router-dom';
import '../styles/Admin/AdminNav.css';

const AdminNav = () => {
  const location = useLocation();
  
  return (
    <nav className="admin-nav">
      <div className="admin-nav-container">
        <h2 className="admin-logo">
          <span className="logo-text">Admin</span>
          <span className="logo-accent">Dashboard</span>
        </h2>
        <div className="admin-nav-links">
          <Link 
            to="/admin/products"
            className={`nav-link ${location.pathname === '/admin/products' ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">All Products</span>
          </Link>
          <Link 
            to="/admin/products/add"
            className={`nav-link ${location.pathname === '/admin/products/add' ? 'active' : ''}`}
          >
            <span className="nav-icon">➕</span>
            <span className="nav-text">Add Product</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;