import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/Admin/AdminProductForm.css';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const initialFormData = {
    title: '',
    image: '',
    originalPrice: '',
    salePrice: '',
    onSale: false,
    isOutOfStock: true,
    isFeatured: false
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Reset form when navigating to add product page
    if (!id && location.pathname === '/admin/products/add') {
      setFormData(initialFormData);
    }
    // Only fetch product data if we're on edit page
    else if (id) {
      fetchProduct();
    }
  }, [id, location.pathname]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/shop/products/get`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      const product = data.find(p => p._id === id);
      
      if (product) {
        setFormData({
          title: product.title,
          image: product.image,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          onSale: product.onSale,
          isOutOfStock: product.isOutOfStock,
          isFeatured: product.isFeatured // Include isFeatured
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        title: formData.title,
        originalPrice: parseFloat(formData.originalPrice),
        salePrice: parseFloat(formData.salePrice),
        onSale: formData.onSale,
        isFeatured: formData.isFeatured // Include isFeatured
      };

      // Handle image update if it's changed
      if (formData.image) {
        if (id && formData.image !== formData.originalImage) {
          productData.image = formData.image;
        } else if (!id) {
          productData.image = formData.image;
        }
      }

      const url = id
        ? `http://localhost:5000/api/admin/update-product/${id}`
        : 'http://localhost:5000/api/admin/add-products';

      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      toast.success(data.message);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="form-loading">
      <div className="loader"></div>
      <p>{id ? 'Loading product...' : 'Creating product...'}</p>
    </div>
  );

  return (
    <div className="admin-form-container">
      <div className="admin-form-wrapper">
        <h1 className="form-title">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        
        <form onSubmit={handleSubmit} className="product-form">
          {/* Product Title */}
          <div className="form-group">
            <label htmlFor="title">
              <span className="label-text">Product Title</span>
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter product title"
              className="form-input"
            />
          </div>

          {/* Product Image */}
          <div className="form-group">
            <label htmlFor="image">
              <span className="label-text">Product Image</span>
              <span className="required">*</span>
            </label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required={!id}
                className="file-input"
              />
              <label htmlFor="image" className="file-label">
                <span className="upload-icon">📸</span>
                <span>Choose an image</span>
              </label>
            </div>
            {formData.image && (
              <div className="image-preview-container">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="image-preview"
                />
              </div>
            )}
          </div>

          {/* Original Price & Sale Price */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originalPrice">
                <span className="label-text">Original Price</span>
                <span className="required">*</span>
              </label>
              <div className="price-input-container">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="form-input price-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="salePrice">
                <span className="label-text">Sale Price</span>
                <span className="required">*</span>
              </label>
              <div className="price-input-container">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  id="salePrice"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="form-input price-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* On Sale Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <div className="custom-checkbox">
                <input
                  type="checkbox"
                  name="onSale"
                  checked={formData.onSale}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-mark sale-mark">✓</span>
              </div>
              <div className="checkbox-content">
                <span className="checkbox-title">On Sale</span>
                <small className="stock-status">
                  <span className="status-label">Product will be marked as </span>
                  <span className={`status-text ${formData.onSale ? 'in-stock' : 'out-of-stock'}`}>
                    {formData.onSale ? 'In Stock' : 'Out of Stock'}
                  </span>
                </small>
              </div>
            </label>
          </div>

          {/* Featured Product Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <div className="custom-checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-mark featured-mark">✓</span>
              </div>
              <div className="checkbox-content">
                <span className="checkbox-title">Featured Product</span>
                <small className="featured-status">
                  <span className="status-label">Product will be </span>
                  <span className={`status-text ${formData.isFeatured ? 'featured' : 'not-featured'}`}>
                    {formData.isFeatured ? (
                      <>
                        <span className="featured-icon">⭐</span>
                        Featured
                      </>
                    ) : (
                      'Not Featured'
                    )}
                  </span>
                </small>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>{id ? 'Update Product' : 'Add Product'}</>
              )}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
