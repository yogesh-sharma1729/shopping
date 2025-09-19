import React from 'react';
import './Footer.css';

function Footer({ onNavigate, setSelectedCategory }) {
  const handleCategoryClick = (category) => {
    if (onNavigate) {
      onNavigate('products'); // Navigate to products page
    }
    if (setSelectedCategory) {
      setSelectedCategory(category); // Set the selected category
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="contact-info">
              <span>📧 yogeshsharma6784y@gmail.com</span>
              <span>📞 +1 (987) 654-3210</span>
              <span>📍 Krishna Nagar, Mathura, Uttar Pradesh, India</span>
            </div>
            <p>&copy; 2025 MyShop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
