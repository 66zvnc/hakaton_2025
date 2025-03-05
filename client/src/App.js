import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch sensor data from the API
    const fetchSensorData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/sensors');
        setSensorData(response.data);
        setLoading(false); // Stop loading after data is fetched
      } catch (err) {
        setError('Failed to fetch data from the server.');
        setLoading(false);
      }
    };

    fetchSensorData(); // Initial fetch
    const intervalId = setInterval(fetchSensorData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval when component unmounts
  }, []);

  if (loading) {
    return <div>Loading sensor data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Sensor Data</h1>
      <p>Temperature: {sensorData.temperature} °C</p>
      <p>Humidity: {sensorData.humidity} %</p>
      <p>Flame Detected: {sensorData.flameDetected}</p>
      <p>Obstacle Detected: {sensorData.obstacleDetected}</p>
      <p>Hit Detected: {sensorData.hitDetected}</p>
    </div>
  );
}

export default App;
