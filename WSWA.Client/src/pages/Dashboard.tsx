import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import sunnyAnimation from "../animations/sunny.json"; 
import partlyCloudyAnimation from "../animations/partlyCloudy.json"; 
import cloudyAnimation from "../animations/cloudy.json"; 

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem('apiBaseUrl') || import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const raw = localStorage.getItem('weatherData');
    if (!raw) {
      navigate('/');
      return;
    }
  
    const parsed = JSON.parse(raw);
    fetch(`${baseUrl}/subscription/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.subscription.email),
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        localStorage.setItem('weatherData', JSON.stringify(result));
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  if (!data) return null;
  const { subscription, weather } = data;

  return (
    <div className="page">
      <div className="top-bar">
        <span>Welcome back, {subscription.email}!</span>
        <button
          className="userinfo-button"
          onClick={() => {
            localStorage.setItem("userToUpdate", JSON.stringify(data.subscription));
            navigate('/userinfo');
          }}
        >
         User Info
        </button>
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
        {weather.cloudiness.includes('Clear') && 
        (
        <Lottie animationData={sunnyAnimation} loop={true} style={{ height: 150 }} />
        )}
        {(weather.cloudiness.includes('partly cloudy'))&& 
        (
        <Lottie animationData={partlyCloudyAnimation} loop={true} style={{ height: 150 }} />
        )}
        {
        (weather.cloudiness.includes('Cloudy') ||
        weather.cloudiness.includes('Overcast')) && 
        (
        <Lottie animationData={cloudyAnimation} loop={true} style={{ height: 150 }} />
        )}
        
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