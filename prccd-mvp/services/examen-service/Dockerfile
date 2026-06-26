FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3003

CMD ["sh", "-c", "node scripts/seed.js && node scripts/seed-mongo.js && node index.js"]