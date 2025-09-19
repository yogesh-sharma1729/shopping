import React, { useState } from 'react';
import axios from 'axios';

function Login({ onSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Login attempt:', formData);

    // Check for admin credentials first (bypass database)
    if (formData.email === 'yogesh@1234gmail.com' && formData.password === 'yogesh1234') {
      console.log('Admin credentials detected, redirecting...');

      // Store admin info in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        name: 'Admin User',
        email: 'yogesh@1234gmail.com'
      }));

      // Create admin user object
      const adminUser = {
        name: 'Admin User',
        email: 'yogesh@1234gmail.com',
        isAdmin: true
      };

      console.log('Calling onSuccess with admin user:', adminUser);

      // Call onSuccess to trigger navigation
      onSuccess(adminUser);

      return;
    }

    // For regular users, try database login
    try {
      const response = await axios.post('http://localhost:5001/login', formData);
      setMessage(response.data.message);
      if (response.status === 200) {
        onSuccess(response.data.user);
      }
    } catch (error) {
      setMessage('Error: ' + error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
