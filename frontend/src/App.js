import React, { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'home', 'products', 'cart'
  const [isLogin, setIsLogin] = useState(false); // true for login, false for signup
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser !== 'undefined') {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('home');
    }
  }, []);

  const handleSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('auth');
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item._id === product._id);
      if (existing) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  if (currentPage === 'home') {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => setCurrentPage('products')}>Products</button>
          <button onClick={() => setCurrentPage('cart')}>Cart ({cart.length})</button>
          <button onClick={() => setCurrentPage('profile')}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
          <Home />
        </header>
      </div>
    );
  }

  if (currentPage === 'products') {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('cart')}>Cart ({cart.length})</button>
          <button onClick={handleLogout}>Logout</button>
          <Products addToCart={addToCart} />
        </header>
      </div>
    );
  }

  if (currentPage === 'cart') {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('products')}>Products</button>
          <button onClick={handleLogout}>Logout</button>
          <Cart cart={cart} removeFromCart={removeFromCart} />
        </header>
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('products')}>Products</button>
          <button onClick={() => setCurrentPage('cart')}>Cart ({cart.length})</button>
          <button onClick={handleLogout}>Logout</button>
          <Profile userEmail={currentUser?.email} />
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setIsLogin(false)}>Sign Up</button>
        <button onClick={() => setIsLogin(true)}>Login</button>
        {isLogin ? <Login onSuccess={handleSuccess} /> : <Signup onSuccess={handleSuccess} />}
      </header>
    </div>
  );
}

export default App;
