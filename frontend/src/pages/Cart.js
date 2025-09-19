import React from 'react';
import './Cart.css';

function Cart({ cart, removeFromCart, setCurrentPage }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button
            className="shop-now-btn"
            onClick={() => setCurrentPage && setCurrentPage('products')}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <p className="cart-item-description">
                    {item.description && item.description.length > 80
                      ? item.description.substring(0, 80) + '...'
                      : item.description || 'No description available'}
                  </p>
                  <div className="cart-item-footer">
                    <span className="cart-item-price">${item.price}</span>
                    <span className="cart-item-quantity">Qty: {item.quantity}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <h3>Order Summary</h3>
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="checkout-btn"
              onClick={() => setCurrentPage('checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
