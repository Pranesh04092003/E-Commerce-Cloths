import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  AiOutlineMinus, 
  AiOutlinePlus, 
  AiOutlineShareAlt 
} from 'react-icons/ai';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import AnnouncementBar from '../components/AnnouncementBar';
import ProductRecommendations from '../components/ProductRecommendations';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // All hooks at the top level
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('2XL');
  const [mainImage, setMainImage] = useState('');
  const [thumbnailImages, setThumbnailImages] = useState([
    '/placeholder_image1.svg', // Thumbnail 1
    '/placeholder_image2.svg'  // Thumbnail 2
  ]); 

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        let productData;
        
        if (location.state) {
          productData = location.state;
        } else {
          const response = await fetch(`https://e-commerce-cloths-backend-production.up.railway.app/api/shop/products/get/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          productData = await response.json();
        }

        setProduct(productData);
        setMainImage(productData.image);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, location.state]);

  const handleThumbnailClick = (thumbnail) => {
    // Set the current main image to the clicked thumbnail
    const newThumbnails = [...thumbnailImages];
    const index = newThumbnails.indexOf(thumbnail);
    if (index === 0) {
      setMainImage(thumbnail); // Update main image with the clicked thumbnail
      newThumbnails[0] = mainImage; // Swap the main image to the first thumbnail
    } else {
      setMainImage(thumbnail); // Update main image with the clicked thumbnail
      newThumbnails[1] = mainImage; // Swap the main image to the second thumbnail
    }
    setThumbnailImages(newThumbnails); // Update the thumbnails state
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      {/* <AnnouncementBar /> */}
      <Header />
      
      <div className="pd-container">
        <div className="pd-product-grid">
          {/* Image Gallery */}
          <div className="pd-image-gallery">
            <div className="pd-main-image">
              <img
                src={mainImage}
                alt={product.title}
                className="pd-image"
              />
            </div>
            <div className="pd-thumbnail-grid">
              {thumbnailImages.map((thumb, index) => (
                <div 
                  key={index}
                  className="pd-thumbnail"
                  onClick={() => handleThumbnailClick(thumb)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={thumb}
                    alt={`${product.title} view ${index + 1}`}
                    className="pd-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="pd-product-details">
            <div>
              <h2 className="pd-brand">SREE GARMENTS</h2>
              <h1 className="pd-product-title">{product.title || 'Product Title'}</h1>
            </div>

            <div className="pd-price-container">
              <span className="pd-sale-price">Rs. {product.salePrice || product.originalPrice}</span>
              {product.onSale && <span className="pd-original-price">Rs. {product.originalPrice}</span>}
              {product.onSale && <span className="pd-sale-badge">Sale</span>}
            </div>

            {/* Size Selector */}
            <div className="pd-size-selector">
              <h3 className="pd-section-title">Size</h3>
              <div className="pd-size-options">
                {['M', 'L', 'XL', '2XL'].map((size) => (
                  <button
                    key={size}
                    className={`pd-size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pd-quantity-selector">
              <h3 className="pd-section-title">Quantity</h3>
              <div className="pd-quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="pd-quantity-button"
                >
                  <AiOutlineMinus className="pd-icon" />
                </button>
                <span className="pd-quantity">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="pd-quantity-button"
                >
                  <AiOutlinePlus className="pd-icon" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pd-action-buttons">
              <button className="pd-button outline">Add to cart</button>
              <button className="pd-button primary">Buy it now</button>
            </div>

            {/* Product Description */}
            <div className="pd-product-description">
              <p>Floral Maternity and feeding wear ankle length with puff sleeves.</p>
              <p>Zipless comfortable feeding wear. Inner feeding neck is round-shaped.</p>
              <p>100% soft hosiery cotton, with a right-side pocket.</p>
              <p className="pd-note">There may be a small variation in the colour due to photography and lighting.</p>
            </div>

            {/* Share Button */}
            <button className="pd-share-button">
              <AiOutlineShareAlt className="pd-icon" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Add ProductRecommendations here */}
        <ProductRecommendations currentProductId={id} />

        {/* WhatsApp Chat Button */}
        <div className="pd-whatsapp-button">
          <button className="pd-chat-button">Chat with us</button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;

