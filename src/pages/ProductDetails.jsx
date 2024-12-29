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
import CartNotification from '../components/CartNotification';
import '../styles/ProductDetails.css';
import '../styles/CartNotification.css';
import { useCartStore } from '../lib/cart-store';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // All hooks at the top level
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [thumbnailImages, setThumbnailImages] = useState([
    '/placeholder_image1.svg', // Thumbnail 1
    '/placeholder_image2.svg'  // Thumbnail 2
  ]); 
  const [showNotification, setShowNotification] = useState(false);
  const { addToCart } = useCartStore();
  const [sizes, setSizes] = useState([]);
  const [brand, setBrand] = useState('');
  const [productDescription, setProductDescription] = useState([]);

  // Polling for size updates
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch(`https://e-commerce-cloths-backend-production.up.railway.app/api/shop/products/${id}/sizes`);
        if (!response.ok) {
          throw new Error('Failed to fetch sizes');
        }
        const sizesData = await response.json();
        
        // Only update if there are actual changes
        if (JSON.stringify(sizesData) !== JSON.stringify(sizes)) {
          setSizes(sizesData);
          
          // Set the first available size as default if no size is selected
          if (!selectedSize) {
            const firstAvailableSize = sizesData.find(size => !size.disabled);
            setSelectedSize(firstAvailableSize?.name || null);
          }
          // If selected size becomes disabled, switch to first available size
          else if (sizesData.find(size => size.name === selectedSize)?.disabled) {
            const firstAvailableSize = sizesData.find(size => !size.disabled);
            setSelectedSize(firstAvailableSize?.name || null);
          }
        }
      } catch (err) {
        console.error('Error fetching sizes:', err);
      }
    };

    // Initial fetch
    fetchSizes();

    // Set up polling interval (every 2 seconds)
    const pollInterval = setInterval(fetchSizes, 2000);

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [id, selectedSize, sizes]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // First fetch all products
        const response = await fetch('https://e-commerce-cloths-backend-production.up.railway.app/api/shop/products/get');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts = await response.json();
        
        // Find the specific product that matches the ID from the URL
        const productData = allProducts.find(product => product._id === id);
        
        if (!productData) {
          throw new Error('Product not found');
        }

        setProduct(productData);
        setMainImage(productData.image);
        // Set brand from the matched product
        setBrand(productData.brand || '');
        // Set thumbnails from the matched product
        setThumbnailImages(productData.thumbnails || [productData.image]);
        // Set product description from the matched product
        setProductDescription(
          Array.isArray(productData.description) 
            ? productData.description 
            : [productData.description || '']
        );
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id, location.pathname]);

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

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.title,
      image: product.image,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      selectedSize: selectedSize,
      quantity: quantity
    };
    
    addToCart(cartItem);
    setShowNotification(true);
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
              <h2 className="pd-brand">{brand}</h2>
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
              {sizes.length === 0 || sizes.every((size) => size.disabled) ? (
                <p className="pd-no-sizes">Size not available</p>
              ) : (
                <div className="pd-size-options">
                  {sizes.map((size) => (
                    <button
                      key={size.name}
                      className={`pd-size-option ${selectedSize === size.name ? 'selected' : ''} ${size.disabled ? 'disabled' : ''}`}
                      onClick={() => !size.disabled && setSelectedSize(size.name)}
                      disabled={size.disabled}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="pd-quantity-selector">
              <h3 className="pd-section-title">Quantity</h3>
              <div className="pd-quantity-controls">
                <button
                  onClick={decreaseQuantity}
                  className="pd-quantity-button"
                >
                  <AiOutlineMinus className="pd-icon" />
                </button>
                <span className="pd-quantity">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="pd-quantity-button"
                >
                  <AiOutlinePlus className="pd-icon" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pd-action-buttons">
              <button 
                className="pd-button outline"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Add to cart
              </button>
              <button className="pd-button primary">Buy it now</button>
            </div>

            {showNotification && (
              <CartNotification 
                onClose={() => setShowNotification(false)}
                productTitle={product.title}
                selectedSize={selectedSize}
                quantity={quantity}
              />
            )}

            {/* Product Description */}
            <div className="pd-product-description">
              {productDescription.length > 0 ? (
                productDescription.map((paragraph, index) => (
                  <p 
                    key={index}
                    style={
                      productDescription.length > 1 && index === productDescription.length - 1 
                        ? { color: '#6b7280' } 
                        : {}
                    }
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="pd-note">Product details will be updated soon.</p>
              )}
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
