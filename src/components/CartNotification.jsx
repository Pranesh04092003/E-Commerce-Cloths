import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../lib/cart-store';
import { CartIcon } from './Icons';

const CartNotification = ({ onClose, productTitle, selectedSize }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const items = useCartStore((state) => state.items);
  const isMobile = window.innerWidth <= 768;

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleClose = () => {
    setIsClosing(true);
    const animationDuration = isMobile ? 400 : 300;
    setTimeout(() => {
      onClose();
    }, animationDuration);
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const timeoutDuration = isMobile ? 3000 : 2500;
    
    const closeTimer = setTimeout(() => {
      handleClose();
    }, timeoutDuration);

    return () => clearTimeout(closeTimer);
  }, []);

  const notificationClass = `cart-notification-overlay ${
    isMobile ? 'mobile' : 'desktop'
  } ${isClosing ? (isMobile ? 'mobile-closing' : 'closing') : ''}`;

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className={notificationClass}>
      <div className="cart-notification-content">
        <div className="notification-header">
          <div className="success-message">
            <div className="success-icon-wrapper">
              <svg 
                className="checkmark-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
              >
                <circle className="checkmark-circle" cx="12" cy="12" r="11" />
                <path 
                  className="checkmark-check"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M6 12l4 4 8-8"
                />
              </svg>
            </div>
            <span className="success-text">Added to cart</span>
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

        <div className="notification-details fade-in">
          <h3>{productTitle}</h3>
          <p>Size: {selectedSize}</p>
        </div>

        <div className="notification-actions slide-up">
          <button 
            className="view-cart-button"
            onClick={handleViewCart}
          >
            <CartIcon />
            <span>View cart ({totalItems})</span>
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