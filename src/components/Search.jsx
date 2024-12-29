import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from './Icons';

const Search = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const searchDropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    }
  };

  const searchResultVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    hover: {
      backgroundColor: '#f3f4f6',
      scale: 1.01,
      transition: {
        duration: 0.2
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchInput = async (value) => {
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/shop/products/get');
        const products = await response.json();
        
        const filtered = products.filter(product => 
          product.title.toLowerCase().includes(value.toLowerCase())
        );
        
        setSearchResults(filtered.slice(0, 5));
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
      setIsLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={searchRef}>
      <motion.button 
        aria-label="Search" 
        className="icon-btn"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <SearchIcon />
      </motion.button>
      
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            variants={searchDropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: -10,
              zIndex: 1000,
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              width: '350px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <SearchIcon style={{
                  position: 'absolute',
                  left: '12px',
                  width: '20px',
                  height: '20px',
                  color: '#94a3b8'
                }} />
                <motion.input
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>

            <AnimatePresence>
              {searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ 
                        padding: '20px',
                        textAlign: 'center',
                        color: '#64748b'
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear"
                        }}
                        style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          border: '3px solid #e2e8f0',
                          borderTopColor: '#94a3b8',
                          borderRadius: '50%',
                          marginBottom: '8px'
                        }}
                      />
                      <div>Searching...</div>
                    </motion.div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product, index) => (
                      <motion.div
                        key={product._id}
                        custom={index}
                        variants={searchResultVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        <motion.img 
                          src={product.image} 
                          alt={product.title}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9'
                          }}
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: '500',
                            color: '#1e293b',
                            marginBottom: '4px'
                          }}>
                            {product.title}
                          </div>
                          <div style={{ 
                            fontSize: '0.875rem',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              color: '#0f766e',
                              fontWeight: '600'
                            }}>
                              ₹{product.salePrice || product.originalPrice}
                            </span>
                            {product.salePrice && (
                              <span style={{
                                textDecoration: 'line-through',
                                color: '#94a3b8'
                              }}>
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ color: '#94a3b8' }}
                          whileHover={{ x: 3 }}
                        >
                          <path
                            d="M4.166 10h11.667M11.666 5l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ 
                        padding: '20px',
                        textAlign: 'center',
                        color: '#64748b'
                      }}
                    >
                      No products found
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search; 