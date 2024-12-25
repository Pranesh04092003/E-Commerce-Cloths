import { Link } from 'react-router-dom';
import { SearchIcon, UserIcon, CartIcon } from './Icons';
import { useState, useEffect } from 'react';
import { useCartStore } from '../lib/cart-store';
import AnnouncementBar from './AnnouncementBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const items = useCartStore((state) => state.items);
  const headerHeight = '120px'; // Combined height of announcement bar and header

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
            <button aria-label="Search" className="icon-btn">
              <SearchIcon />
            </button>
            {!isMobile && (
              <button aria-label="Account" className="icon-btn">
                <UserIcon />
              </button>
            )}
            <Link to="/cart" className="cart-btn" onClick={handleNavClick}>
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
{/*             <Link to="/cart" className="mobile-link" onClick={handleNavClick}>Cart</Link> */}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
