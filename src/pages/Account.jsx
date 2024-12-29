import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Account.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = window.innerWidth <= 768;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Define animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -10 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAddresses();
    fetchOrders();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/addresses/${addressId}/set-default`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/addresses/${addressId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          toast.success('Address deleted successfully');
          fetchAddresses(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error(error.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/addresses/${editingAddress._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Address updated successfully');
        setIsEditModalOpen(false);
        setEditingAddress(null);
        fetchAddresses(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error(error.response?.data?.message || 'Failed to update address');
    }
  };

  const EditAddressModal = ({ address, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Edit Address</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode:</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="update-btn">Update</button>
              <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <motion.div 
        className="account-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="account-sidebar">
          <h2>My Account</h2>
          <nav className="account-nav">
            <button 
              className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button 
              className={`nav-button ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </nav>
        </div>

        <div className="account-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h3>Profile Information</h3>
              <div className="profile-info">
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h3>Your Orders</h3>
              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map(order => (
                    <motion.div
                      key={order._id}
                      className="order-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p><strong>Order ID:</strong> {order._id}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>
                        <strong>Status:</strong>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </p>
                      <p><strong>Total:</strong> ₹{order.total}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  No orders found
                </motion.p>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <h3>Your Addresses</h3>
              <div className="addresses-list">
                {addresses.map(address => (
                  <div key={address._id} className="address-card">
                    <div className="address-actions">
                      <button 
                        onClick={() => handleEditClick(address)}
                        className="edit-btn"
                        title="Edit Address"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(address._id)}
                        className="delete-btn"
                        title="Delete Address"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {address.isDefault && <span className="default-badge">Default</span>}
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                    {!address.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultAddress(address._id)}
                        className="set-default-btn"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {isEditModalOpen && (
        <EditAddressModal
          address={editingAddress}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAddress(null);
          }}
          onUpdate={handleUpdateAddress}
        />
      )}
    </>
  );
};

export default Account; 