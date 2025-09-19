import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ userEmail }) {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/user/${userEmail}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Error fetching profile: ' + error.response?.data || error.message);
      }
    };
    if (userEmail) {
      fetchProfile();
    }
  }, [userEmail]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      console.log('Updating profile for:', userEmail);
      console.log('Request URL:', `http://localhost:5001/user/${userEmail}`);
      console.log('Request data:', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      const response = await axios.put(`http://localhost:5001/user/${userEmail}`, {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      setProfile(response.data);
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response?.data, error.response?.status);
      alert('Error updating profile');
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>User Profile</h1>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        marginBottom: '20px'
      }}>
        {editing ? (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#555' }}>Edit Profile</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Name:</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Email:</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Phone:</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Address:</label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#555' }}>Profile Information</h2>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#495057' }}>Name:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#212529' }}>{profile.name}</p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#495057' }}>Email:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#212529' }}>{profile.email}</p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#495057' }}>Phone:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#212529' }}>{profile.phone || 'Not provided'}</p>
              </div>

              <div style={{ marginBottom: '0' }}>
                <strong style={{ color: '#495057' }}>Address:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#212529', whiteSpace: 'pre-wrap' }}>{profile.address || 'Not provided'}</p>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
