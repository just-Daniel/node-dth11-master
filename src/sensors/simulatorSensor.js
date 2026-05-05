function readSensor() {
  const temperature = 20 + Math.random() * 10;
  const humidity = 40 + Math.random() * 30;

  return {
    source: "simulator",
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  readSensor,
};
