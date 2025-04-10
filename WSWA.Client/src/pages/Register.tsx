import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ email: '', city: '', country: '', zipCode: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await registerUser(form);
    
    if (res?.email) {
      navigate('/');
    } else {
      
      const message = typeof res === 'object' && res?.message
        ? res.message
        : 'Registration failed. This email may already be subscribed.';
      setError(message);
    }
  };

  return (
    <div className="page center-content">
      <div className="form-container">
        <div className="form-nav">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
        </div>
        <h2 className="form-title">Register</h2>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input className="form-input" name="city" placeholder="City" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input className="form-input" name="country" placeholder="Country" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Zip Code (optional)</label>
            <input className="form-input" name="zipCode" placeholder="Zip Code" onChange={handleChange} />
          </div>
          <button type="submit" className="form-button">Subscribe</button>
        </form>
      </div>
    </div>
  );
}