import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../lib/cart-store';

const CartNotification = ({ onClose, productTitle, selectedSize }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className={`cart-notification-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="cart-notification-content">
        <div className="notification-header">
          <div className="success-message">
            <svg 
              className="checkmark-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
            Item added to your cart
          </div>
          <button 
            onClick={handleClose} 
            className="close-button"
            aria-label="Close notification"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path 
                fill="currentColor" 
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          </button>
        </div>

        <div className="notification-details">
          <h3>{productTitle}</h3>
          <p>Size: {selectedSize}</p>
        </div>

        <div className="notification-actions">
          <button 
            className="view-cart-button"
            onClick={handleViewCart}
          >
            View cart ({totalItems})
          </button>
          <button 
            className="checkout-button"
            onClick={() => navigate('/checkout')}
          >
            Check out
          </button>
          <button 
            className="continue-shopping-button"
            onClick={onClose}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
};

CartNotification.propTypes = {
  onClose: PropTypes.func.isRequired,
  productTitle: PropTypes.string.isRequired,
  selectedSize: PropTypes.string.isRequired
};

export default CartNotification; 