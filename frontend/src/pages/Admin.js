import React, { useState, useEffect } from 'react';
import Footer from '../component/Footer';
import './Admin.css';

function Admin({ setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchAllOrders();
    } else if (activeTab === 'products') {
      fetchAllProducts();
    }
  }, [activeTab]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      // Try to fetch from database first
      const response = await fetch('http://localhost:5001/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        // If database fails, use mock data
        console.log('Using mock order data');
        setOrders([
          {
            _id: '1',
            orderId: 'ORD-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            totalAmount: 299.99,
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            orderId: 'ORD-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            totalAmount: 149.99,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      // If database fails, use mock data
      console.log('Database connection failed, using mock data');
      setOrders([
        {
          _id: '1',
          orderId: 'ORD-001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          totalAmount: 299.99,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          orderId: 'ORD-002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          totalAmount: 149.99,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      ]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/products');
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        }),
      });

      if (!response.ok) throw new Error('Failed to add product');

      alert('Product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: ''
      });
      // Refresh products list
      fetchAllProducts();
    } catch (err) {
      alert('Error adding product: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      alert('Order status updated successfully!');
      fetchAllOrders(); // Refresh orders list
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    }
  };

  const handleNavigate = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage orders, products, and more</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          Add Product
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order Management</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <h3>Order #{order.orderId}</h3>
                      <span className={`status ${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <p><strong>Customer:</strong> {order.customerName}</p>
                      <p><strong>Email:</strong> {order.customerEmail}</p>
                      <p><strong>Total:</strong> ${order.totalAmount}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="order-actions">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <h2>Product Management</h2>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-admin-card">
                    <img src={product.image} alt={product.name} className="product-admin-image" />
                    <div className="product-admin-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <p><strong>Price:</strong> ${product.price}</p>
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Stock:</strong> {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add-product' && (
          <div className="add-product-section">
            <h2>Add New Product</h2>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL:</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity:</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Add Product</button>
            </form>
          </div>
        )}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default Admin;
