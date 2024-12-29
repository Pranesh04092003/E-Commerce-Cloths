import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { login } = useAuth();

  const [isNewUser, setIsNewUser] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setError(''); // Clear any previous errors
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const endpoint = isNewUser 
        ? 'http://localhost:5000/api/shop/auth/register'
        : 'http://localhost:5000/api/shop/auth/login';

      const response = await axios.post(endpoint, formData);

      if (response.data.success) {
        // Use the login function from context
        login(response.data.data.user, response.data.data.token);
        
        setSuccessMessage(isNewUser ? 'Account created successfully!' : 'Login successful!');
        
        setTimeout(() => {
          navigate(from);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    errorMessage: {
      color: '#ff4444',
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      padding: '10px',
      backgroundColor: 'rgba(255, 68, 68, 0.1)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    successMessage: {
      color: '#4CAF50',
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      padding: '10px',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="login-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1>{isNewUser ? 'Create Account' : 'Welcome Back'}</h1>
          <p>Please enter your details</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isNewUser && (
            <motion.div 
              className="form-group"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="fullName">Full Name</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={styles.errorMessage}
            >
              <span>❌</span> {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={styles.successMessage}
            >
              <span>✅</span> {successMessage}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              isNewUser ? 'Create Account' : 'Login'
            )}
          </motion.button>
        </motion.form>

        <motion.div 
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="toggle-container">
            <button 
              className="toggle-mode"
              onClick={() => setIsNewUser(!isNewUser)}
            >
              {isNewUser 
                ? 'Already have an account? Login' 
                : 'New here? Create an account'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 