import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/MainContent.css';

const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shop/products/get');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();

      // Filter products to only include those with isFeatured: true
      const featuredProducts = data.filter(product => product.isFeatured);
      setProducts(featuredProducts.slice(0, 8)); // Show up to 8 featured products
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="main-content-layout">
      <Header />
      
      {/* Featured Products Section */}
      <section className="main-content-featured">
        <h2 className="main-content-section-title">Featured Products</h2>
        <div className="main-content-products-grid">
          {loading ? (
            <div className="main-content-loading">Loading products...</div>
          ) : error ? (
            <div className="main-content-error">Error: {error}</div>
          ) : (
            products.map(product => (
              <ProductCard 
                key={product._id}
                id={product._id}
                title={product.title}
                image={product.image}
                originalPrice={product.originalPrice}
                salePrice={product.salePrice}
                onSale={product.onSale}
                isOutOfStock={product.isOutOfStock}
              />
            ))
          )}
        </div>
      </section>

      {/* View More Section */}
      <div className="main-content-view-more">
        <Link 
          to="/bestsellers" 
          className="main-content-view-more-link"
        >
          View More Products →
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default MainContent;
