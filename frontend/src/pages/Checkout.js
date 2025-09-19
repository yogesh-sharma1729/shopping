import React, { useState } from 'react';
import './Checkout.css';

function Checkout({ cart, setCurrentPage, currentUser }) {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: currentUser?.name || ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: currentUser?._id || 'guest',
        items: cart,
        shippingInfo,
        paymentInfo: { ...paymentInfo, cardNumber: '**** **** **** ' + paymentInfo.cardNumber.slice(-4) },
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending'
      };

      const response = await fetch('http://localhost:5001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderId(result.orderId);
        setOrderPlaced(true);
        // Clear cart after successful order
        localStorage.setItem('cart', JSON.stringify([]));
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-confirmation">
          <div className="confirmation-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been placed successfully.</p>
          <div className="order-details">
            <h3>Order #{orderId}</h3>
            <p>Total: ${total.toFixed(2)}</p>
            <p>You will receive an email confirmation shortly.</p>
          </div>
          <div className="confirmation-actions">
            <button
              className="btn-primary"
              onClick={() => setCurrentPage('products')}
            >
              Continue Shopping
            </button>
            <button
              className="btn-secondary"
              onClick={() => setCurrentPage('home')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Cart</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Review</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        {/* Step 1: Cart Review */}
        {step === 1 && (
          <div className="checkout-step">
            <h2>Review Your Cart</h2>
            <div className="cart-review">
              {cart.map(item => (
                <div key={item._id} className="cart-review-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Shipping Information */}
        {step === 2 && (
          <div className="checkout-step">
            <h2>Shipping Information</h2>
            <form className="shipping-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Brazil">Brazil</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Payment Information */}
        {step === 3 && (
          <div className="checkout-step">
            <h2>Payment Information</h2>
            <div className="payment-notice">
              <p>⚠️ This is a demo application. No real payment will be processed.</p>
            </div>
            <form className="payment-form">
              <div className="form-group">
                <label>Name on Card</label>
                <input
                  type="text"
                  name="nameOnCard"
                  value={paymentInfo.nameOnCard}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Order Review */}
        {step === 4 && (
          <div className="checkout-step">
            <h2>Review Your Order</h2>
            <div className="order-review">
              <div className="review-section">
                <h3>Shipping Address</h3>
                <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                <p>{shippingInfo.country}</p>
              </div>

              <div className="review-section">
                <h3>Payment Method</h3>
                <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                <p>Expires {paymentInfo.expiryDate}</p>
              </div>

              <div className="review-section">
                <h3>Order Items</h3>
                {cart.map(item => (
                  <div key={item._id} className="review-item">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="review-total">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="checkout-navigation">
          {step > 1 && (
            <button className="btn-secondary" onClick={handlePrev}>
              Previous
            </button>
          )}
          {step < 4 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={handlePlaceOrder}>
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
