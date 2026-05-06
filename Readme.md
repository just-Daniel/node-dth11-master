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
- ngrok
- Bash
- Linux systemd

---

# GPIO

GPIO = General Purpose Input Output

GPIO pins on Raspberry Pi allow communication with external hardware devices such as sensors.

In this project, the DHT11 sensor is connected to a Raspberry Pi GPIO pin:

```env
GPIO_PIN=4
```

---

# Sensor Modes

The project supports two sensor modes:

```env
SENSOR_MODE=simulator
SENSOR_MODE=real
```

- `simulator` — generates fake temperature and humidity data.
- `real` — reads temperature and humidity from a DHT11 sensor connected to Raspberry Pi GPIO.

---

# Docker Compose Files

This project uses different Docker Compose configurations depending on the environment.

## `docker-compose.yml`

Used for local development on macOS or standard Docker environments.

Uses Docker bridge networking.

### Communication

```text
node-api → influxdb:8086
grafana  → influxdb:8086
```

Docker automatically creates:

- internal bridge network
- internal DNS
- container IP addresses

Containers communicate using Docker service names:

```env
INFLUX_URL=http://influxdb:8086
```

---

## `docker-compose.rpi.yml`

Used specifically for Raspberry Pi.

Uses host networking:

```yaml
network_mode: host
```

### Communication

```text
node-api → 127.0.0.1:8087
grafana  → 127.0.0.1:8087
```

Containers use Raspberry Pi networking directly.

This configuration was required because Docker bridge networking on Raspberry Pi 3 did not correctly assign IP addresses to containers.

---

# Docker Networking Difference

## Bridge Network (macOS)

```text
Docker internal network
├── node-api
├── influxdb
└── grafana
```

### Characteristics

- each container has its own IP address
- Docker provides internal DNS
- containers communicate using service names
- ports are isolated per container

Example:

```env
INFLUX_URL=http://influxdb:8086
```

---

## Host Network (Raspberry Pi)

```text
Raspberry Pi host network
├── node-api
├── influxdb
└── grafana
```

### Characteristics

- containers share Raspberry Pi network
- no Docker internal DNS
- localhost refers to Raspberry Pi itself
- ports must be unique

Example:

```env
INFLUX_URL=http://127.0.0.1:8087
```

---

# Ports

| Service     | macOS / Local                  | Raspberry Pi |
| ----------- | ------------------------------ | ------------ |
| Node.js API | 3001                           | 3001         |
| Grafana     | 3000                           | 3000         |
| InfluxDB    | 8087 external → 8086 container | 8087         |

---

# Bash Scripts

The project includes helper Bash scripts for starting services.

## `start-mac.sh`

Used on macOS.

### Features

- stops previous containers
- rebuilds Docker images
- starts services in background
- prints local URLs

### Run

```bash
./start-mac.sh
```

---

## `start-rpi.sh`

Used on Raspberry Pi.

### Features

- starts Docker stack
- starts ngrok tunnel
- saves ngrok logs
- prints Raspberry Pi IP addresses

### Run

```bash
./start-rpi.sh
```

---

# Bash Basics

## Shebang

```bash
#!/bin/bash
```

This line tells Linux to execute the script using Bash shell.

---

## Background Process

```bash
&
```

Runs a process in background.

Example:

```bash
ngrok http 3000 &
```

---

## Redirect Output

```bash
> file.log
```

Redirects terminal output into a file.

Example:

```bash
ngrok http 3000 --log=stdout > ngrok.log &
```

This:

- starts ngrok
- saves logs into `ngrok.log`
- runs ngrok in background

---

# systemd Service

`systemd` is the Linux service manager.

It:

- starts services automatically
- restarts crashed services
- launches services after reboot

Example:

```ini
[Service]
ExecStart=/usr/bin/ngrok http 3000
Restart=always
```

This automatically starts ngrok on Raspberry Pi boot.

---

# ngrok Remote Access

ngrok creates a secure public tunnel to Grafana.

Example:

```text
Internet
    ↓
https://xxxxx.ngrok-free.app
    ↓
Grafana on Raspberry Pi
```

This allows remote monitoring outside the local Wi-Fi network.

---

# Run Locally on macOS

```bash
docker compose up --build
```

or:

```bash
./start-mac.sh
```

---

# Run on Raspberry Pi

```bash
sudo docker compose -f docker-compose.rpi.yml up --build
```

or:

```bash
./start-rpi.sh
```

---

# Grafana

Grafana reads sensor data from InfluxDB and visualizes:

- temperature
- humidity
- historical metrics
- real-time charts

---

# Grafana URLs

## macOS

```text
http://localhost:3000
```

## Raspberry Pi local network

```text
http://RPI_IP:3000
```

Example:

```text
http://10.0.0.47:3000
```

## Remote access using ngrok

```text
https://xxxxx.ngrok-free.app
```

---

# InfluxDB Datasource URLs

## macOS

```text
http://influxdb:8086
```

## Raspberry Pi

```text
http://127.0.0.1:8087
```
