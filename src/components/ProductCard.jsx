import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ id, title, image, originalPrice, salePrice, onSale, isOutOfStock }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Navigating to the ProductDetails page and passing the product details as state
    navigate(`/product/${id}`, {
      state: {
        id,
        title,
        image,
        originalPrice,
        salePrice,
        onSale,
        isOutOfStock,
      },
    });
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {onSale && <span className="sale-badge">Sale</span>}
      {!onSale && isOutOfStock && <span className="out-of-stock-badge">Out of Stock</span>}
      <img src={image} alt={title} />
      <div className="product-title">
        {title}
      </div>
      <div className="price-container">
        <span className="original-price">Rs. {originalPrice.toFixed(2)}</span>
        {onSale && <span className="sale-price">Rs. {salePrice.toFixed(2)}</span>}
      </div>
    </div>
  );
};

export default ProductCard;
