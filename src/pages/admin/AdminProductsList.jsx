import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/Admin/AdminProductsList.css';

const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://e-commerce-cloths-backend-production.up.railway.app/api/shop/products/get');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`https://e-commerce-cloths-backend-production.up.railway.app/api/admin/delete-product/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      toast.success(data.message);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return (
    <div className="admin-loading">
      <div className="loader"></div>
      <p>Loading products...</p>
    </div>
  );

  return (
    <div className="admin-products-list">
      <div className="admin-header">
        <h1>All Products</h1>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <div 
            key={product._id} 
            className="product-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="product-image-container">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-info">
              <h3>{product.title}</h3>
              <div className="price-info">
                <p className="original-price">₹{product.originalPrice}</p>
                <p className="sale-price">₹{product.salePrice}</p>
              </div>
              <div className="status-badges">
                <div className={`status-badge ${product.onSale ? 'on-sale' : 'out-of-stock'}`}>
                  {product.onSale ? 'On Sale' : 'Out of Stock'}
                </div>
                <div className={`status-badge ${product.isFeatured ? 'featured' : 'not-featured'}`}>
                  {product.isFeatured ? '⭐ Featured' : '◇ Not Featured'}
                </div>
              </div>
              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                >
                  <span className="btn-icon">✏️</span>
                  <span className="btn-text">Edit</span>
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  <span className="btn-icon">🗑️</span>
                  <span className="btn-text">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsList; 