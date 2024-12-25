import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <h2 className="footer-heading">Quick links</h2>
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/shipping">Shipping Policy</Link>
          <Link to="/returns">Returns & Refund Policy</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024, <Link to="/">Better Bee</Link> <a href="https://shopify.com">Powered by Shopify</a> • <Link to="/privacy">Privacy policy</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
