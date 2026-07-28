import React, { useState, useEffect } from 'react';
import './profile.css';
import api from '../api/axios';
import defaultAvatar from '../assets/demo_avatar.jpg';
import moment from 'moment';

export default function ProfileModal({ isOpen, onClose, onUserUpdated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pfp, setPfp] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProfileInfo();
    }
  }, [isOpen]);

  const fetchProfileInfo = async () => {
    try {
      setLoading(true);
      setError('');
      setMsg('');
      const response = await api.get('/users/profile');
      const userData = response.data;
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPfp(defaultAvatar);
      setCreatedAt(userData.createdAt || '');
      setIsAdmin(userData.isAdmin ?? true);

      // Save updated info in localStorage
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        token: localStorage.getItem('token')
      }));
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Fallback from localStorage
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (localUser.name) {
        setName(localUser.name);
        setEmail(localUser.email || 'admin@medtrack.com');
        setPfp(defaultAvatar);
        setCreatedAt(localUser.createdAt || new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const payload = { name, email, pfp };
      if (password.trim().length > 0) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        payload.password = password;
      }

      const response = await api.put('/users/profile', payload);
      setMsg('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');

      const updated = response.data;
      localStorage.setItem('user', JSON.stringify({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        pfp: updated.pfp,
        isAdmin: updated.isAdmin,
        createdAt: updated.createdAt,
        token: localStorage.getItem('token')
      }));

      if (onUserUpdated) {
        onUserUpdated(updated);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="profile-header-info">
          <div className="profile-avatar-wrapper">
            <img src={defaultAvatar} alt="Avatar" className="profile-avatar-img" onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }} />
            <span className="profile-role-badge">{isAdmin ? 'Admin' : 'Staff'}</span>
          </div>
          <div className="profile-details-text">
            <h2>{name || 'Admin User'}</h2>
            <p><i className="fa-regular fa-envelope"></i> {email || 'admin@medtrack.com'}</p>
            <p><i className="fa-regular fa-calendar"></i> Member since: {createdAt ? moment(createdAt).format('MMM YYYY') : 'Jan 2025'}</p>
          </div>
        </div>

        {msg && <div className="profile-success-alert">{msg}</div>}
        {error && <div className="profile-error-alert">{error}</div>}

        {!isEditing ? (
          <>
            <div className="profile-meta-grid">
              <div className="profile-meta-item">
                <span>Account Role</span>
                <strong>{isAdmin ? 'System Administrator' : 'Inventory Operator'}</strong>
              </div>
              <div className="profile-meta-item">
                <span>Database ID</span>
                <strong>Active User</strong>
              </div>
            </div>
            <div className="profile-actions">
              <button className="profile-save-btn" onClick={() => setIsEditing(true)}>
                <i className="fa-solid fa-pen-to-square"></i> Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="profile-form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter full name"
                required 
              />
            </div>

            <div className="profile-form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email"
                required 
              />
            </div>

            <div className="profile-form-group">
              <label>New Password (leave blank to keep current)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>

            <div className="profile-form-group">
              <label>Profile Picture URL</label>
              <input 
                type="text" 
                value={pfp} 
                onChange={(e) => setPfp(e.target.value)} 
                placeholder="Enter profile picture URL"
              />
            </div>

            <div className="profile-actions">
              <button type="button" className="profile-cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="profile-save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
