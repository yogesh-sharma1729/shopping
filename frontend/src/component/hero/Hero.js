import React from 'react';
import './Hero.css';

function Hero({ onNavigate }) {
  const handleExploreCategories = () => {
    // Navigate to products page using parent navigation function
    if (onNavigate) {
      onNavigate('products');
    }
  };

  const handleShopNow = () => {
    // Navigate to products page using parent navigation function
    if (onNavigate) {
      onNavigate('products');
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span className="brand-name">MyShop</span>
        </h1>
        <p className="hero-subtitle">
          Discover amazing products at unbeatable prices. Your one-stop destination for quality shopping.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleShopNow}>
            Shop Now
          </button>
          <button className="btn-secondary" onClick={handleExploreCategories}>
            Explore Categories
          </button>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-placeholder">
          <div className="shopping-icon">🛍️</div>
          <p>Premium Products</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
