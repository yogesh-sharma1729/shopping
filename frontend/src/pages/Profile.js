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
    <div>
      <h1>User Profile</h1>
      {editing ? (
        <div>
          <label>Name:</label>
          <input name="name" value={profile.name} onChange={handleChange} />
          <br />
          <label>Email:</label>
          <input name="email" value={profile.email} onChange={handleChange} disabled />
          <br />
          <label>Phone:</label>
          <input name="phone" value={profile.phone} onChange={handleChange} />
          <br />
          <label>Address:</label>
          <input name="address" value={profile.address} onChange={handleChange} />
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone || 'Not provided'}</p>
          <p>Address: {profile.address || 'Not provided'}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
