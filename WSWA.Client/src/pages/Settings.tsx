import { useState, useEffect } from 'react';

export default function Settings() {
  const [baseUrl, setBaseUrl] = useState('');

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