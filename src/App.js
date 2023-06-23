import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [address, setAddress] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
    if (!e.target.value) {
      onClearAddress();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      setError('Please provide an address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `http://localhost:3000/weather?address=${encodeURIComponent(address)}`;
      const response = await axios.get(url);
      const weatherData = response.data;

      if (!weatherData.forecastData.current) {
        setError('Invalid weather data received.');
        setIsLoading(false);
        return;
      }

      setWeatherData(weatherData);
    } 
    catch (error) {
      setError('An error occurred while fetching data.');
    } 
    finally {
      setIsLoading(false);
    }
  };

  const onClearAddress = () => {
    setAddress('');
    setWeatherData(null);
    setError(null);
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter address" value={address} onChange={handleInputChange} />
        <button type="submit">Get Weather</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h2>Weather Information:</h2>
          <p>Location: {weatherData.location}</p>
          <p>Temperature: {weatherData.forecastData.current.temperature} degrees</p>
          <p>Weather Description: {weatherData.forecastData.current.weather_descriptions[0]}</p>
          <p>Is Day: {weatherData.forecastData.current.is_day} </p>
        </div>
      )}
    </div>
  );
}

export default App;
