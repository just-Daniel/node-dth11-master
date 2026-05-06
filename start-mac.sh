#!/bin/bash

echo "Starting IoT stack on macOS..."

docker compose down

docker compose up --build -d

echo ""
echo "Services started:"
echo "Grafana:  http://localhost:3000"
echo "Node API: http://localhost:3001/data"
echo "InfluxDB: http://localhost:8087"