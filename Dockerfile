FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./

RUN npm install

COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]