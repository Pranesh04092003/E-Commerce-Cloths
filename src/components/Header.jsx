import { Link } from 'react-router-dom';
import { SearchIcon, UserIcon, CartIcon } from './Icons';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to close menu
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
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
            <span className="cart-count">0</span>
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
        </div>
      )}
    </header>
  );
};

export default Header;
