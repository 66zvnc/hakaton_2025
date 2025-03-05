const express = require('express');
const sensorLib = require('node-dht-sensor');
const { Gpio } = require('onoff');

const app = express();
const port = 3001;

// Initialize the DHT11 sensor on GPIO pin 4
sensorLib.initialize(11, 4);

// Initialize the KY-032 obstacle sensor on GPIO pin 17
const obstacleSensor = new Gpio(17, 'in', 'both');

// Initialize the KY-026 flame sensor on GPIO pin 27
const flameSensor = new Gpio(27, 'in', 'both');

// Initialize the KY-006 passive buzzer on GPIO pin 22
const buzzer = new Gpio(22, 'out');

// Initialize the KY-031 hit sensor on GPIO pin 23
const hitSensor = new Gpio(23, 'in', 'both');

// Serve static files from the React app
app.use(express.static('client/build'));

// API endpoint to get sensor data
app.get('/api/sensors', (req, res) => {
  // Read temperature and humidity from KY-015
  sensorLib.read(11, 4, (err, temperature, humidity) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read from KY-015 sensor' });
    }

    // Read flame detection status from KY-026
    const flameDetected = flameSensor.readSync() === 0 ? 'Yes' : 'No';

    // Read obstacle detection status from KY-032
    const obstacleDetected = obstacleSensor.readSync() === 0 ? 'Yes' : 'No';

    // Read hit detection status from KY-031
    const hitDetected = hitSensor.readSync() === 0 ? 'Yes' : 'No';

    // Return the sensor data as JSON
    res.json({
      temperature: temperature.toFixed(1),
      humidity: humidity.toFixed(1),
      flameDetected,
      obstacleDetected,
      hitDetected,
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
