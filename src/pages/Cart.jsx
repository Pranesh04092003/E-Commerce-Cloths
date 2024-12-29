import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../lib/cart-store';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Cart.css';

const Cart = () => {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  // Calculate estimated total using sale price
  const calculateEstimatedTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.salePrice * item.quantity);
    }, 0);
  };

  // Create unique key for items with same product but different sizes
  const getItemKey = (item) => `${item.id}-${item.title}-${item.selectedSize}`;

  const handleQuantityChange = (itemKey, newQuantity) => {
    // Add loading for item total price
    const totalPriceElement = document.querySelector(`[data-item-key="${itemKey}"] .total-price`);
    totalPriceElement?.classList.add('updating', 'show-loader');
    
    // Add loading for estimated total
    const estimatedElement = document.querySelector('.estimated-total');
    estimatedElement?.classList.add('updating');
    
    // Update the quantity
    updateQuantity(itemKey, newQuantity);

    // Simulate loading (remove in production if using real API)
    setTimeout(() => {
      // Remove loading from item total
      totalPriceElement?.classList.remove('show-loader');
      totalPriceElement?.classList.add('price-changed');

      // Remove loading from estimated total
      estimatedElement?.classList.remove('updating');

      // Cleanup animations
      setTimeout(() => {
        totalPriceElement?.classList.remove('updating', 'price-changed');
      }, 400);
    }, 300);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <h1>Your cart is empty</h1>
            <Link to="/" className="continue-shopping-btn">
              Continue shopping
            </Link>
            <div className="login-prompt">
              <h2>Have an account?</h2>
              <div>
                <Link to="/login" className="login-link">Log in</Link>
                <span className="login-description">to check out faster.</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page">
        <div className="cart-header">
          <h1>Your cart</h1>
          <Link to="/" className="continue-shopping">
            Continue shopping
          </Link>
        </div>

        <div className="cart-labels">
          <span className="label-product">PRODUCT</span>
          <span className="label-quantity">QUANTITY</span>
          <span className="label-total">TOTAL</span>
        </div>

        <div className="cart-items">
          {items.map((item) => (
            <div 
              key={item.cartItemId || getItemKey(item)} 
              className="cart-item" 
              data-item-key={getItemKey(item)}
            >
              <div className="product-info">
                <img src={item.image} alt={item.title} />
                <div className="product-details">
                  <h2>{item.title}</h2>
                  <div className="price-info">
                    <span className="original-price">Rs. {item.originalPrice || 0}.00</span>
                    <span className="sale-price">Rs. {item.salePrice || 0}.00</span>
                  </div>
                  <p className="size">Size: {item.selectedSize}</p>
                  <p className="offer-tag">BUY 3 & GET 200Rs Discount</p>
                </div>
              </div>

              <div className="quantity-section">
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(getItemKey(item), item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(getItemKey(item), item.quantity + 1)}>+</button>
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => removeFromCart(getItemKey(item))}
                  aria-label="Remove item"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>

              <div className="total-price">
                <span className="original">Rs. {(item.originalPrice * item.quantity) || 0}.00</span>
                <span className="final">Rs. {(item.salePrice * item.quantity) || 0}.00</span>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-summary">    
            <p className="estimated-total">
              Estimated total
              <span>Rs. {calculateEstimatedTotal()}.00</span>
            </p>
            <p className="tax-note">Taxes, discounts and shipping calculated at checkout.</p>
          </div>
          <button 
      className="checkout-button"
      onClick={() => navigate('/checkout')}
    >
      Check out
    </button>   </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart; 