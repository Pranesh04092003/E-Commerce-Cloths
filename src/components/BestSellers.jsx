import { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import Header from './Header';
import Footer from './Footer';
import '../styles/BestSellers.css';
import { BASE_URL } from '../utils/api';


const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: '',
    price: '',
    sort: 'featured'
  });
  const [tempFilters, setTempFilters] = useState({
    availability: '',
    price: '',
    sort: 'featured'
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    fetchProducts();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    if (products.length > 0) {
      const filtered = applyFilters(products, isMobile ? tempFilters : filters);
      setFilteredProducts(filtered);
    }
  }, [filters, tempFilters, products, isMobile]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/shop/products/get`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const applyFilters = (productList, currentFilters) => {
    let result = [...productList];

    // Apply availability filter
    if (currentFilters.availability) {
      result = result.filter(product => {
        if (currentFilters.availability === 'in-stock') {
          return product.onSale;
        } else if (currentFilters.availability === 'out-of-stock') {
          return !product.onSale;
        }
        return true;
      });
    }

    // Apply price filter
    if (currentFilters.price) {
      result = result.filter(product => {
        const price = product.salePrice || product.originalPrice;
        const [min, max] = currentFilters.price.split('-').map(Number);
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }

    // Apply sorting
    switch (currentFilters.sort) {
      case 'alphabetical-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alphabetical-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.salePrice || a.originalPrice;
          const priceB = b.salePrice || b.originalPrice;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.salePrice || a.originalPrice;
          const priceB = b.salePrice || b.originalPrice;
          return priceB - priceA;
        });
        break;
      case 'best-selling':
      case 'featured':
      default:
        // Maintain original order for featured and best-selling
        break;
    }

    return result;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const removeAllFilters = () => {
    setFilters({
      availability: '',
      price: '',
      sort: 'featured'
    });
  };

  const handleTempFilterChange = (filterType, value) => {
    setTempFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      
      // If in mobile, immediately apply the filter
      if (!isMobile) {
        const filtered = applyFilters(products, newFilters);
        setFilteredProducts(filtered);
      }
      
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    const filtered = applyFilters(products, tempFilters);
    setFilteredProducts(filtered);
    setIsFilterDrawerOpen(false);
  };

  const handleRemoveAllFilters = () => {
    const resetFilters = {
      availability: '',
      price: '',
      sort: 'featured'
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setFilteredProducts(products);
  };

  const handleDrawerOpen = () => {
    setIsFilterDrawerOpen(true);
    document.body.classList.add('filter-drawer-open');
  };

  const handleDrawerClose = () => {
    setIsFilterDrawerOpen(false);
    document.body.classList.remove('filter-drawer-open');
  };

  const MobileFilterDrawer = () => (
    <>
      <div 
        className={`shop-filter-drawer-overlay ${isFilterDrawerOpen ? 'open' : ''}`}
        onClick={handleDrawerClose}
      />
      <div className={`shop-filter-drawer ${isFilterDrawerOpen ? 'open' : ''}`}>
        <div className="shop-filter-drawer-header">
          <div className="shop-filter-drawer-title">
            <span>Filter and sort</span>
            <span className="shop-product-count">{products.length} products</span>
          </div>
          <button 
            className="close-drawer"
            onClick={handleDrawerClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="shop-filter-drawer-content">
          <div className="shop-filter-section">
            <span className="shop-filter-label">Availability</span>
            <select 
              className="shop-filter-select shop-filter-select-mobile"
              value={tempFilters.availability}
              onChange={(e) => handleTempFilterChange('availability', e.target.value)}
            >
              <option value="">All</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="shop-filter-section">
            <span className="shop-filter-label">Price</span>
            <select 
              className="shop-filter-select shop-filter-select-mobile"
              value={tempFilters.price}
              onChange={(e) => handleTempFilterChange('price', e.target.value)}
            >
              <option value="">All</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="501-1000">₹501 - ₹1000</option>
              <option value="1001-2000">₹1001 - ₹2000</option>
              <option value="2001+">₹2001+</option>
            </select>
          </div>

          <div className="shop-filter-section">
            <span className="shop-filter-label">Sort by:</span>
            <select 
              className="shop-sort-select shop-sort-select-mobile"
              value={tempFilters.sort}
              onChange={(e) => handleTempFilterChange('sort', e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="alphabetical-asc">Alphabetical, A-Z</option>
              <option value="alphabetical-desc">Alphabetical, Z-A</option>
              <option value="price-low">Price, Low to High</option>
              <option value="price-high">Price, High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-filter-drawer-footer">
          <button className="shop-apply-filters-btn" onClick={handleApplyFilters}>
            Apply filters
          </button>
          <button className="shop-remove-all-btn" onClick={handleRemoveAllFilters}>
            Remove all
          </button>
        </div>
      </div>
    </>
  );

  const DesktopFilters = () => (
    <div className="shop-filters-container">
      <div className="shop-filters-left">
        <span className="shop-filter-label">Filter:</span>
        <div className="shop-filter-group">
          <select 
            className="shop-filter-select"
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
          >
            <option value="">Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select 
            className="shop-filter-select"
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
          >
            <option value="">Price</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="501-1000">₹501 - ₹1000</option>
            <option value="1001-2000">₹1001 - ₹2000</option>
            <option value="2001+">₹2001+</option>
          </select>
        </div>
      </div>

      <div className="shop-filters-right">
        <span className="shop-filter-label">Sort by:</span>
        <select 
          className="shop-sort-select"
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="best-selling">Best Selling</option>
          <option value="alphabetical-asc">Alphabetical, A-Z</option>
          <option value="alphabetical-desc">Alphabetical, Z-A</option>
          <option value="price-low">Price, Low to High</option>
          <option value="price-high">Price, High to Low</option>
        </select>
        <span className="shop-product-count">{products.length} products</span>
      </div>
    </div>
  );

  useEffect(() => {
    return () => {
      document.body.classList.remove('filter-drawer-open');
    };
  }, []);

  return (
    <div className="shop-main-layout">
      <Header />
      
      <main className="shop-bestsellers-content">
        <div className="shop-bestsellers-header">
          <h1 className="shop-bestsellers-title">Best Sellers</h1>
          <span className="shop-product-count">
            {filteredProducts.length} products
          </span>
        </div>

        {isMobile ? (
          <>
            <div className="shop-mobile-filters">
              <button 
                className="shop-mobile-filter-button"
                onClick={handleDrawerOpen}
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M3 6H17M6 10H14M8 14H12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Filter and sort
                {Object.values(filters).some(value => value) && 
                  <span className="shop-filter-active-indicator">•</span>
                }
              </button>
              <span className="shop-mobile-product-count">
                {filteredProducts.length} products
              </span>
            </div>
            <MobileFilterDrawer />
          </>
        ) : (
          <DesktopFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        <div className="shop-products-grid">
          {loading ? (
            <div className="shop-loading">Loading products...</div>
          ) : error ? (
            <div className="shop-error">Error: {error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="shop-no-products">No products match your filters</div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard 
                key={product._id}
                id={product._id}
                title={product.title}
                image={product.image}
                originalPrice={product.originalPrice}
                salePrice={product.salePrice}
                onSale={product.onSale}
                isOutOfStock={!product.onSale}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BestSellers;
