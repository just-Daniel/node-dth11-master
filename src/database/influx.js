const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const influxUrl = process.env.INFLUX_URL;
const influxToken = process.env.INFLUX_TOKEN;
const influxOrg = process.env.INFLUX_ORG;
const influxBucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({
  url: influxUrl,
  token: influxToken,
});

const writeApi = influxDB.getWriteApi(influxOrg, influxBucket, "ns");

async function saveSensorData(data) {
  const point = new Point("dht11_readings")
    .tag("source", data.source)
    .floatField("temperature", data.temperature)
    .floatField("humidity", data.humidity)
    .timestamp(new Date(data.timestamp));

  writeApi.writePoint(point);

  await writeApi.flush();

  console.log("Data saved to InfluxDB:", data);
}

module.exports = {
  saveSensorData,
};
