import React, { useState } from "react";
import "./navBar.css";

const Navbar = ({ setCurrentPage, cartCount, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin on component mount
  React.useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  const handleClick = (page) => {
    setCurrentPage(page);
    setIsOpen(false); // close drawer
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => handleClick("home")}>
          MyShop
        </div>

        {/* Links */}
        <ul className={isOpen ? "navbar-links active" : "navbar-links"}>
          <li><button onClick={() => handleClick("home")}>Home</button></li>
          <li><button onClick={() => handleClick("products")}>Products</button></li>
          <li><button onClick={() => handleClick("cart")}>Cart ({cartCount})</button></li>
          <li><button onClick={() => handleClick("profile")}>Profile</button></li>
          {isAdmin && <li><button onClick={() => handleClick("admin")}>Admin</button></li>}
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>

        {/* Hamburger */}
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={`hamburger ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Navbar;
