import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const ProductRecommendations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/shop/products/get`);
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        
        const filteredProducts = data
          .filter(product => product._id !== id)
          .slice(0, 4);
        
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [id]);

  const handleProductClick = (product) => {
    // Scroll to top before navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Navigate with product data after a small delay to allow smooth scroll
    setTimeout(() => {
      navigate(`/product/${product._id}`, {
        state: {
          id: product._id,
          title: product.title,
          image: product.image,
          originalPrice: product.originalPrice,
          salePrice: product.salePrice,
          onSale: product.onSale,
          isOutOfStock: product.isOutOfStock
        }
      });
    }, 400); // Adjust timing based on your scroll animation duration
  };

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return null;
  if (products.length === 0) return null;

  return (
    <section className="pd-recommendations">
      <h2 className="pd-section-title">You may also like</h2>
      <div className="pd-recommendations-grid">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="pd-product-card"
            onClick={() => handleProductClick(product)}
            style={{ cursor: 'pointer' }}
          >
            <div className="pd-product-image-container">
              {product.onSale && (
                <div className="pd-sale-badge">
                  <span>Sale</span>
                </div>
              )}
              <img
                src={product.image}
                alt={product.title}
                className="pd-product-image"
              />
            </div>
            <h3 className="pd-product-name">{product.title}</h3>
            <div className="pd-product-price">
              <p className="pd-sale-price">Rs. {product.salePrice?.toFixed(2)}</p>
              <p className="pd-original-price">
                Rs. {product.originalPrice?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductRecommendations;