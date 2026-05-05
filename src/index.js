const express = require("express");
const { saveSensorData } = require("./database/influx");

const app = express();

const PORT = Number(process.env.PORT || 3000);
const SENSOR_MODE = process.env.SENSOR_MODE || "simulator";

let sensorModule;

if (SENSOR_MODE === "real") {
  sensorModule = require("./sensors/realDht11Sensor");
} else {
  sensorModule = require("./sensors/simulatorSensor");
}

let latestData = null;
let history = [];

async function collectData() {
  try {
    const data = sensorModule.readSensor();

    latestData = data;
    history.push(data);

    if (history.length > 100) {
      history.shift();
    }

    await saveSensorData(data);

    console.log("Saved sensor data:", data);
  } catch (error) {
    console.error("Sensor/database error:", error.message);
  }
}

setInterval(collectData, 2000);
collectData();

app.get("/", (req, res) => {
  res.json({
    status: "running",
    sensorMode: SENSOR_MODE,
    endpoints: ["/data", "/history"],
  });
});

app.get("/data", (req, res) => {
  res.json(latestData);
});

app.get("/history", (req, res) => {
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Node API running on port ${PORT}`);
  console.log(`Sensor mode: ${SENSOR_MODE}`);
});
