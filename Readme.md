# IoT DHT11 Monitoring System

## Architecture

```text
DHT11 / Simulator
        ↓
Node.js API
        ↓
InfluxDB
        ↓
Grafana Dashboard
```

## Technologies

- Node.js
- Express
- Docker
- InfluxDB 2
- Grafana
- Raspberry Pi 3
- DHT11 sensor

## Sensor Modes

The project supports two sensor modes:

```env
SENSOR_MODE=simulator
SENSOR_MODE=real
```

- `simulator` — generates fake temperature and humidity data.
- `real` — reads temperature and humidity from a DHT11 sensor connected to Raspberry Pi GPIO.

## Docker Compose Files

This project uses different Docker Compose files for different environments.

### `docker-compose.yml`

Used for local development on macOS or a normal Docker environment.

It uses Docker bridge networking:

```text
node-api → influxdb:8086
grafana  → influxdb:8086
```

In this mode Docker creates an internal network between containers.  
Containers can communicate using service names, for example:

```env
INFLUX_URL=http://influxdb:8086
```

### `docker-compose.rpi.yml`

Used on Raspberry Pi.

It uses host networking:

```yaml
network_mode: host
```

This means containers do not use Docker's internal bridge network.  
Instead, they use the Raspberry Pi network directly.

On Raspberry Pi, services communicate through localhost:

```env
INFLUX_URL=http://127.0.0.1:8087
```

This was needed because Docker bridge networking on Raspberry Pi did not correctly assign an IP address to the `node-api` container.

## Docker Networking Difference

### Bridge Network

Used on macOS:

```text
Docker internal network
├── node-api
├── influxdb
└── grafana
```

Each container gets its own internal IP address.  
Docker also provides internal DNS, so containers can reach each other by service name:

```text
influxdb
```

Example:

```env
INFLUX_URL=http://influxdb:8086
```

### Host Network

Used on Raspberry Pi:

```text
Raspberry Pi host network
├── node-api
├── influxdb
└── grafana
```

Containers use the Raspberry Pi network directly.  
There is no Docker internal DNS between containers.

Example:

```env
INFLUX_URL=http://127.0.0.1:8087
```

## Ports

| Service     |                  macOS / Local |              Raspberry Pi |
| ----------- | -----------------------------: | ------------------------: |
| Node.js API |                           3001 | 3000 or configured `PORT` |
| Grafana     |                           3000 |                      3000 |
| InfluxDB    | 8087 external → 8086 container |                      8087 |

## Run Locally on macOS

```bash
docker compose up --build
```

## Run on Raspberry Pi

```bash
sudo docker compose -f docker-compose.rpi.yml up --build
```

## Grafana

Grafana reads sensor data from InfluxDB and visualizes:

- temperature
- humidity
- historical metrics
- real-time charts

For Raspberry Pi, use this InfluxDB URL in Grafana datasource settings:

```text
http://127.0.0.1:8087
```

For macOS/local Docker bridge mode, use:

```text
http://influxdb:8086
```
