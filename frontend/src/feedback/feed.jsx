import React, { useState, useEffect } from 'react';
import './feed.css';
import api from '../api/axios';
import moment from 'moment';
import toast from 'react-hot-toast';

const Feed = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Populate user details if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
      } catch (e) {}
    }
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feedback');
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !title.trim() || !description.trim()) {
      toast.error('Please complete all required feedback fields!');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/feedback', {
        name,
        email,
        rating,
        title,
        description
      });

      toast.success('Thank you! Feedback submitted successfully.');
      setTitle('');
      setDescription('');
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>User Feedback & System Evaluation</h1>
        <p>Share your user experience or review feedback submitted across your team</p>
      </div>

      <div className="feedback-grid">
        <div className="feedback-card">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            <i className="fa-solid fa-pen-nib" style={{ color: '#329dff', marginRight: '8px' }}></i>
            Submit Feedback
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="feedback-form-group">
              <label>Rating Experience</label>
              <div className="feedback-stars-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-solid fa-star feedback-star-icon ${star <= rating ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  ></i>
                ))}
              </div>
            </div>

            <div className="feedback-form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="feedback-form-group">
              <label>Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="feedback-form-group">
              <label>Feedback Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Great Inventory Speed / Needs More Reports"
                required
              />
            </div>

            <div className="feedback-form-group">
              <label>Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed feedback or feature suggestions..."
                required
              />
            </div>

            <button type="submit" className="feedback-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        <div className="feedback-card">
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            <i className="fa-solid fa-comments" style={{ color: '#1dbfc6', marginRight: '8px' }}></i>
            Recent Submitted Feedback ({feedbacks.length})
          </h2>

          <div className="feedback-list-container">
            {loading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Loading feedbacks...</p>
            ) : feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <div className="feedback-item" key={fb._id}>
                  <div className="feedback-item-header">
                    <div className="feedback-item-user">
                      <h4>{fb.name}</h4>
                      <span>{moment(fb.date || fb.createdAt).format('DD-MM-YYYY hh:mm A')}</span>
                    </div>
                    <div className="feedback-item-stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${i < fb.rating ? '' : 'fa-regular'}`}
                          style={{ color: i < fb.rating ? '#f9d50a' : 'var(--border-color)' }}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="feedback-item-title">{fb.title}</div>
                  <div className="feedback-item-desc">{fb.description}</div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No feedbacks submitted yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;