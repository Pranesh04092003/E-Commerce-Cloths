import { Link } from 'react-router-dom';
import { SearchIcon, UserIcon, CartIcon } from './Icons';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '../lib/cart-store';
import AnnouncementBar from './AnnouncementBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Search from './Search';

const Header = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const items = useCartStore((state) => state.items);
  const headerHeight = '120px'; // Combined height of announcement bar and header
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(
        currentScrollPos < prevScrollPos || 
        currentScrollPos < 50
      );

      setPrevScrollPos(currentScrollPos);
    };

    // Add padding to body when component mounts
    document.body.style.paddingTop = headerHeight;

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      // Reset padding when component unmounts
      document.body.style.paddingTop = '0px';
    };
  }, [prevScrollPos]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // First, clear the auth context
      logout();
      
      // Clear any additional storage if needed
      localStorage.clear(); // This will clear ALL localStorage items
      
      // Close mobile menu if open
      setIsMenuOpen(false);
      
      // Show success toast
      toast.success('👋 Logged out successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4CAF50',
          color: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '16px',
          padding: '16px 24px',
        },
        progressStyle: {
          background: 'rgba(255, 255, 255, 0.7)'
        }
      });

      // Navigate after a brief delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show error toast if logout fails
      toast.error('Logout failed. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        style: {
          background: '#ef4444',
          color: 'white',
          borderRadius: '10px',
        }
      });
    }
  };

  const styles = {
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative'
    },
    userIcon: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    userName: {
      fontSize: '0.9rem',
      color: '#4b5563'
    },
    logoutBtn: {
      padding: '6px 12px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#dc2626'
      }
    },
    mobileUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb',
      color: '#4b5563'
    },
    mobileLogoutBtn: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      textAlign: 'left',
      fontSize: '1rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#dc2626'
      }
    }
  };

  // Add button animation variants
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    tap: {
      scale: 0.95,
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s ease-in-out',
    }}>
      <AnnouncementBar />
      <header style={{ 
        backgroundColor: 'white',
        boxShadow: visible ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
      }}>
        <nav className="navbar">
          {isMobile && (
            <button 
              className="menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <Link to="/" className="logo" onClick={handleNavClick}>
            <img 
              src="https://i.imgur.com/jWyMwxF.png" 
              alt="My logo" 
              width="150"
              style={{
                filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
                transition: "transform 0.2s ease, filter 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))"
                }
              }}
            />
          </Link>

          {!isMobile && (
            <div className="nav-links">
              <Link to="/" className="nav-link underline" onClick={handleNavClick}>Home</Link>
              <Link to="/full-length" className="nav-link" onClick={handleNavClick}>Full length</Link>
              <Link to="/ankle-length" className="nav-link" onClick={handleNavClick}>Ankle length</Link>
              <Link to="/pyjamas" className="nav-link" onClick={handleNavClick}>Pyjamas Sets For Womens</Link>
              <Link to="/catalog" className="nav-link" onClick={handleNavClick}>Catalog</Link>
              <Link to="/contact" className="nav-link" onClick={handleNavClick}>Contact Us</Link>
              {/* <Link to="/cart" className="nav-link" onClick={handleNavClick}>Cart</Link> */}
            </div>
          )}

          <div className="nav-icons">
            <Search />
            <>
              {user ? (
                <div style={styles.userMenu}>
                  <Link 
                    to="/account" 
                    className="icon-btn" 
                    style={styles.userIcon}
                  >
                    <UserIcon />
                    {!isMobile && (
                      <span style={styles.userName}>
                        {user.fullName.split(' ')[0]}
                      </span>
                    )}
                  </Link>
                  {!isMobile && (
                    <motion.button 
                      onClick={handleLogout}
                      aria-label="Logout"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      style={{
                        ...styles.logoutBtn,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Logout</span>
                      <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, -45, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        👋
                      </motion.span>
                    </motion.button>
                  )}
                </div>
              ) : (
                <Link to="/login" className="icon-btn">
                  <UserIcon />
                </Link>
              )}
            </>
            <Link to="/cart" className="cart-btn">
              <CartIcon />
              <span className="cart-count">{totalItems}</span>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={handleNavClick}>Home</Link>
            <Link to="/full-length" className="mobile-link" onClick={handleNavClick}>Full length</Link>
            <Link to="/ankle-length" className="mobile-link" onClick={handleNavClick}>Ankle length</Link>
            <Link to="/pyjamas" className="mobile-link" onClick={handleNavClick}>Pyjamas Sets For Womens</Link>
            <Link to="/catalog" className="mobile-link" onClick={handleNavClick}>Catalog</Link>
            <Link to="/contact" className="mobile-link" onClick={handleNavClick}>Contact Us</Link>
            {user && (
              <>
                <div style={styles.mobileUserInfo}>
                  <Link 
                    to="/account" 
                    className="mobile-link" 
                    onClick={handleNavClick}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <UserIcon />
                    <span>{user.fullName}</span>
                  </Link>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    ...styles.mobileLogoutBtn,
                    '&:hover': {
                      backgroundColor: '#dc2626'
                    }
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
