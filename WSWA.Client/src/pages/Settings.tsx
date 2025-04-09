import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [baseUrl, setBaseUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('apiBaseUrl');
    if (stored) setBaseUrl(stored);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('apiBaseUrl', baseUrl);
    alert('API Base URL saved!');
  };

  return (
    <div className="page center-content">
      <div className="form-container">
      <div className="form-nav">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
        </div>
        <h2 className="form-title">Settings</h2>
        <div className="form-group">
          <label className="form-label">API Base URL:</label>
          <input
            className="form-input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:5000/api"
          />
        </div>
        <button className="form-button" onClick={saveSettings}>Save</button>
      </div>
    </div>
  );
}