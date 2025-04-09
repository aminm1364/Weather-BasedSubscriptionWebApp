import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { checkUser, loginUser } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showCheckLocation, setShowCheckLocation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setError('');

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      return;
    }
    const res = await loginUser(email);
    
    if (res?.weather) {
      localStorage.setItem('weatherData', JSON.stringify(res));
      navigate('/dashboard');
    } else {
      const message = typeof res === 'object' && res?.message
        ? res.message
        : 'Login failed. Please make sure you are subscribed.';
      setError(message);
      if (message.includes("Unable to fetch weather data.")) 
      {
        const checkRes = await checkUser(email);
        if (checkRes !== undefined) {
          localStorage.setItem("userToUpdate", JSON.stringify(checkRes));
          setShowCheckLocation(true);
        }
      }
    }
  };

  return (
    <div className="page center-content">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">Login</button>
        </form>
        {showCheckLocation && (
          <button
            type="button"
            className="form-button"
            onClick={() => navigate('/userinfo')}
            style={{ marginTop: '10px' }}
          >
            Check the location info
          </button>
        )}
        <div className="form-links">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p>
            <Link to="/settings">Settings</Link>
          </p>
        </div>
      </div>
    </div>
  );
}