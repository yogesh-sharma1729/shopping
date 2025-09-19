import React from 'react';
import Hero from '../component/hero/Hero';
import Footer from '../component/Footer';
import './Home.css';

function Home({ setCurrentPage }) {
  const handleNavigate = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="home">
      <Hero onNavigate={handleNavigate} />

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose MyShop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free delivery on orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">�</div>
              <h3>Secure Payment</h3>
              <p>100% secure checkout process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">�</div>
              <h3>24/7 Support</h3>
              <p>Round the clock customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of satisfied customers</p>
          <button
            className="btn-primary"
            onClick={() => handleNavigate('products')}
          >
            Get Started
          </button>
        </div>
      </section>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default Home;
