import React, { useState, useEffect } from 'react';
import Footer from '../component/Footer';
import './Products.css';

function Products({ addToCart, setCurrentPage }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/external/fakestore/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(['all', ...data]);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = 'http://localhost:5001/external/fakestore/products';
      if (selectedCategory !== 'all') {
        url = `http://localhost:5001/external/fakestore/category/${selectedCategory}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product) => {
    // Transform Fake Store API product to match cart structure
    const cartProduct = {
      _id: product.id.toString(), // Convert id to _id for cart compatibility
      name: product.title,
      price: product.price,
      image: product.image,
      description: product.description
    };
    addToCart(cartProduct);
  };

  const handleNavigate = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover amazing products from our curated collection</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <h3>Filter by Category:</h3>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.image}
                alt={product.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">
                {product.description.length > 100
                  ? product.description.substring(0, 100) + '...'
                  : product.description}
              </p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <div className="product-rating">
                  <span className="stars">
                    {'★'.repeat(Math.round(product.rating?.rate || 0))}
                    {'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}
                  </span>
                  <span className="rating-count">
                    ({product.rating?.count || 0})
                  </span>
                </div>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try selecting a different category</p>
        </div>
      )}

      <Footer onNavigate={handleNavigate} setSelectedCategory={setSelectedCategory} />
    </div>
  );
}

export default Products;
