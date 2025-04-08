import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('weatherData');
    if (!raw) {
      navigate('/');
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  if (!data) return null;

  const { subscription, weather } = data;

  return (
    <div className="page">
      <div className="top-bar">
        <span>Welcome back, {subscription.email}!</span>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('weatherData');
            navigate('/');
          }}
        >
          Log out
        </button>
      </div>
      <div className="container weather-card">
        <h3>Weather in {subscription.city}, {subscription.country}</h3>
        <ul>
          <li><strong>Description:</strong> {weather.description}</li>
          <li><strong>Temperature:</strong> {weather.temperature.current}°C (min {weather.temperature.min}°C, max {weather.temperature.max}°C)</li>
          <li><strong>Pressure:</strong> {weather.pressure} hPa</li>
          <li><strong>Humidity:</strong> {weather.humidity}%</li>
          <li><strong>Wind Speed:</strong> {weather.windSpeed} m/s</li>
          <li><strong>Cloudiness:</strong> {weather.cloudiness}</li>
          <li><strong>Sunrise:</strong> {weather.sunrise}</li>
          <li><strong>Sunset:</strong> {weather.sunset}</li>
          <li><strong>Timezone:</strong> {weather.timezone}</li>
        </ul>
      </div>
    </div>
  );
}