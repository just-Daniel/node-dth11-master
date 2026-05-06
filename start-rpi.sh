#!/bin/bash

echo "Starting IoT stack on Raspberry Pi..."

sudo docker compose -f docker-compose.rpi.yml down

sudo docker compose -f docker-compose.rpi.yml up --build -d

echo ""
echo "Starting ngrok tunnel for Grafana..."

ngrok http 3000 --log=stdout > ngrok.log &

sleep 5

echo ""
echo "Raspberry Pi services started"
echo ""

echo "Node API:"
hostname -I | awk '{print "http://" $1 ":3001/data"}'

echo ""
echo "Grafana local:"
hostname -I | awk '{print "http://" $1 ":3000"}'

echo ""
echo "ngrok logs:"
echo "tail -f ngrok.log"