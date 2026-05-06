const sensor = require("node-dht-sensor");

const DHT_TYPE = 11;
const GPIO_PIN = Number(process.env.GPIO_PIN || 4);

function readSensor() {
  const result = sensor.read(DHT_TYPE, GPIO_PIN);

  console.log("---GPIO_PIN---", GPIO_PIN);
  console.log(
    `Read from DHT11: Temp=${result.temperature.toFixed(1)}°C, Humidity=${result.humidity.toFixed(1)}%`,
  );

  return {
    source: "real-dht11",
    temperature: Number(result.temperature.toFixed(1)),
    humidity: Number(result.humidity.toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

module.exports = { readSensor };
