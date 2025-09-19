import React, { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Navbar from './component/navBar/navBar.js';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'home', 'products', 'cart'
  const [isLogin, setIsLogin] = useState(false); // true for login, false for signup
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (savedUser && savedUser !== 'undefined') {
      setCurrentUser(JSON.parse(savedUser));
      // Redirect admin users to admin page
      if (isAdmin) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    }
  }, []);

  const handleSuccess = (user) => {
    console.log('handleSuccess called with user:', user);
    console.log('isAdmin check:', user.isAdmin || localStorage.getItem('isAdmin') === 'true');

    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Check if admin user and redirect to admin page
    if (user.isAdmin || localStorage.getItem('isAdmin') === 'true') {
      console.log('Redirecting to admin page');
      setCurrentPage('admin');
    } else {
      console.log('Redirecting to home page');
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
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
        <Navbar
          setCurrentPage={setCurrentPage}
          cartCount={cart.length}
          handleLogout={handleLogout}
        />
        <Home setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  if (currentPage === 'products') {
    return (
      <div className="App">
        <Navbar
          setCurrentPage={setCurrentPage}
          cartCount={cart.length}
          handleLogout={handleLogout}
        />
        <Products addToCart={addToCart} />
      </div>
    );
  }

  if (currentPage === 'cart') {
    return (
      <div className="App">
        <Navbar
          setCurrentPage={setCurrentPage}
          cartCount={cart.length}
          handleLogout={handleLogout}
        />
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          setCurrentPage={setCurrentPage}
        />
      </div>
    );
  }

  if (currentPage === 'checkout') {
    return (
      <div className="App">
        <Navbar
          setCurrentPage={setCurrentPage}
          cartCount={cart.length}
          handleLogout={handleLogout}
        />
        <Checkout
          cart={cart}
          setCurrentPage={setCurrentPage}
          currentUser={currentUser}
        />
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="App">
        <Navbar
          setCurrentPage={setCurrentPage}
          cartCount={cart.length}
          handleLogout={handleLogout}
        />
        <Profile userEmail={currentUser?.email} />
      </div>
    );
  }

  if (currentPage === 'admin') {
    return (
      <div className="App">
        <Navbar
          setCurrentPage={setCurrentPage}
          cartCount={cart.length}
          handleLogout={handleLogout}
        />
        <Admin setCurrentPage={setCurrentPage} />
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
