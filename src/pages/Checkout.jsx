import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../lib/cart-store';
import Header from '../components/Header';
import '../styles/Checkout.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Checkout = () => {
  const { items } = useCartStore();
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingDetails, setShippingDetails] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setShippingDetails(prevDetails => ({
        ...prevDetails,
        fullName: user.fullName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/addresses', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setSavedAddresses(response.data.addresses);
        
        const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setShippingDetails(prevDetails => ({
            ...prevDetails,
            phone: defaultAddress.phone,
            address: defaultAddress.address,
            city: defaultAddress.city,
            state: defaultAddress.state,
            pincode: defaultAddress.pincode
          }));
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to fetch saved addresses');
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const calculateEstimatedTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.salePrice * item.quantity);
    }, 0);
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      localStorage.setItem('savedShippingDetails', JSON.stringify(shippingDetails));
      
      navigate('/login', { 
        state: { 
          from: '/checkout',
          message: 'Please login to continue with payment'
        } 
      });
      
      toast.info('Please login to continue with payment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const addressResponse = await axios.get('http://localhost:5000/api/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const addressExists = addressResponse.data.addresses?.some(addr => 
        addr.phone === shippingDetails.phone &&
        addr.address === shippingDetails.address &&
        addr.city === shippingDetails.city &&
        addr.state === shippingDetails.state &&
        addr.pincode === shippingDetails.pincode
      );

      if (!addressExists) {
        const addressData = {
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode,
          isDefault: true
        };

        await axios.post('http://localhost:5000/api/addresses', addressData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        toast.success('New address saved as default');
        
        await fetchAddresses();
      }

      setActiveStep(2);
    } catch (error) {
      console.error('Error handling shipping details:', error);
      toast.error('Failed to save address details');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Handle payment processing
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (selectedAddress) => {
    setShippingDetails(prev => ({
      ...prev,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode
    }));
    setShowAddressModal(false);
  };

  const AddressModal = ({ addresses, onSelect, onClose }) => {
    const modalRef = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    return (
      <motion.div 
        className="address-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          ref={modalRef}
          className="address-modal"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <div className="modal-header">
            <h3>Select Previous Address</h3>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <div className="addresses-list">
            {addresses.map((addr) => (
              <motion.div
                key={addr._id}
                className={`address-item ${addr.isDefault ? 'default' : ''}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelect(addr)}
              >
                {addr.isDefault && <span className="default-badge">Default</span>}
                <p><strong>Address:</strong> {addr.address}</p>
                <p><strong>City:</strong> {addr.city}</p>
                <p><strong>State:</strong> {addr.state}</p>
                <p><strong>Pincode:</strong> {addr.pincode}</p>
                <p><strong>Phone:</strong> {addr.phone}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <motion.div 
        className="checkout-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="checkout-steps">
          {[1, 2].map((step) => (
            <motion.div
              key={step}
              className={`step ${activeStep >= step ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 ? 'Shipping' : 'Payment'}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="checkout-main">
          <div className="checkout-form-container">
            {activeStep === 1 ? (
              <motion.form 
                onSubmit={handleShippingSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="shipping-form"
              >
                <div className="shipping-header">
                  <h2>Shipping Details</h2>
                  {user && savedAddresses.length > 0 && (
                    <motion.button
                      type="button"
                      className="previous-addresses-button"
                      onClick={() => setShowAddressModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Select Previous Address
                    </motion.button>
                  )}
                </div>

                {showAddressModal && (
                  <AddressModal
                    addresses={savedAddresses}
                    onSelect={handleAddressSelect}
                    onClose={() => setShowAddressModal(false)}
                  />
                )}

                <div className="form-group">
                  <div className="name-login-wrapper">
                    <label htmlFor="fullName">
                      Full Name
                      {user && (
                        <span className="edit-hint">
                          (editable)
                        </span>
                      )}
                    </label>
                    {!user && (
                      <button 
                        type="button"
                        className="login-link"
                        onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                      >
                        Login
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleInputChange}
                    required
                    className="input-editable"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      required
                      readOnly={user}
                      className={user ? 'input-autofilled' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={shippingDetails.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="continue-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Payment
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                onSubmit={handlePaymentSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="payment-methods">
                  <h2>Payment Method</h2>
                  <div className="payment-options">
                    {['card', 'upi', 'netbanking'].map((method) => (
                      <motion.div
                        key={method}
                        className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img src={`/images/${method}-icon.svg`} alt={method} />
                        <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div 
                  className="payment-details"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {paymentMethod === 'card' && (
                    <div className="card-details">
                      <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiry">Expiry Date</label>
                          <input type="text" id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="cvv">CVV</label>
                          <input type="text" id="cvv" required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardName">Cardholder Name</label>
                        <input type="text" id="cardName" required />
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="button-group">
                  <motion.button
                    type="button"
                    className="back-button"
                    onClick={() => setActiveStep(1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Shipping
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="pay-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Pay Now
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>

          <motion.div 
            className="order-summary"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Order Summary</h2>
            <div className="summary-items">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="summary-item">
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p>Size: {item.selectedSize}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    Rs. {item.salePrice * item.quantity}.00
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>Rs. {calculateEstimatedTotal()}.00</span>
              </div>
              <div className="shipping">
                <span>Shipping</span>
                <span>Rs.100</span>
              </div>
              <div className="estimated-total">
                <span>Estimated Total</span>
                <span>Rs. {calculateEstimatedTotal()}.00</span>
              </div>
              <p className="tax-note">Taxes and shipping calculated</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
    </>
  );
};

export default Checkout;