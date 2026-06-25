const { pipeline } = require('@xenova/transformers');
const { spawn } = require('child_process');
const env = require('../config/env');

let transcriberPipeline = null;

async function getTranscriber() {
  if (!transcriberPipeline) {
    transcriberPipeline = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny',
      { quantized: true }
    );
  }
  return transcriberPipeline;
}

async function precalentarModelo() {
  console.log('[voz-service] Cargando modelo Whisper...');
  await getTranscriber();
  console.log('[voz-service] Modelo listo.');
}

// Usa el ffmpeg del contenedor para convertir cualquier formato de audio
// a PCM Float32 mono 16kHz, que es lo que espera el pipeline de Whisper.
function decodificarAudio(buffer) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    const proc = spawn('ffmpeg', [
      '-i', 'pipe:0',   // entrada desde stdin
      '-ar', '16000',   // 16 kHz
      '-ac', '1',       // mono
      '-f', 'f32le',    // float32 little-endian sin cabecera
      'pipe:1'          // salida a stdout
    ]);

    proc.stdin.write(buffer);
    proc.stdin.end();

    proc.stdout.on('data', chunk => chunks.push(chunk));

    proc.on('close', code => {
      if (code !== 0 && chunks.length === 0) {
        return reject(new Error(`ffmpeg falló al decodificar el audio (código ${code})`));
      }
      const combined = Buffer.concat(chunks);
      const float32 = new Float32Array(
        combined.buffer,
        combined.byteOffset,
        combined.byteLength / 4
      );
      resolve(float32);
    });

    proc.on('error', reject);
  });
}

async function transcribir(fileBuffer) {
  const t = await getTranscriber();
  const audio = await decodificarAudio(fileBuffer);
  const result = await t(audio, { language: 'spanish' });
  return {
    texto: result.text.trim(),
    idioma: 'es',
  };
}

async function transcribirYResponder(fileBuffer, sesion_id, pregunta_id, authHeader) {
  const { texto } = await transcribir(fileBuffer);

  const respuesta = texto.trim().toUpperCase().charAt(0);
  if (!['A', 'B', 'C', 'D'].includes(respuesta)) {
    const err = new Error(
      `La transcripción "${texto.trim()}" no comienza con una opción válida (A, B, C o D)`
    );
    err.status = 422;
    throw err;
  }

  const url = `${env.examenServiceUrl}/api/examen/responder`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({ sesion_id: Number(sesion_id), pregunta_id: Number(pregunta_id), respuesta }),
  });

  const data = await response.json();
  if (!response.ok) {
    const detalle = data.error || data.message || JSON.stringify(data);
    const err = new Error(`Error del motor adaptativo (${response.status}): ${detalle}`);
    err.status = response.status;
    throw err;
  }

  return { texto_transcrito: texto, respuesta_enviada: respuesta, resultado_examen: data };
}

module.exports = { transcribir, transcribirYResponder, precalentarModelo };
