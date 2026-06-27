FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Pre-descarga el modelo Whisper tiny (~40 MB) durante el build.
RUN node -e "\
  const { pipeline } = require('@xenova/transformers'); \
  pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', { quantized: true }) \
    .then(() => { console.log('Modelo Whisper listo.'); process.exit(0); }) \
    .catch(e => { console.error(e); process.exit(1); })"

COPY . .

EXPOSE 3008

CMD ["node", "index.js"]
