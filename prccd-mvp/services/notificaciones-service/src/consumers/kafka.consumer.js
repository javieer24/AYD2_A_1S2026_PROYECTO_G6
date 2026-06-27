'use strict';
const { Kafka } = require('kafkajs');
const env = require('../config/env');
const { TOPICS } = require('../config/kafka.topics');
const { handleCertificadoEmitido } = require('../handlers/certificadoEmitido.handler');
const { handleFraudeDetectado }    = require('../handlers/fraudeDetectado.handler');

const kafka = new Kafka({
  clientId: 'notificaciones-service',
  brokers: [env.kafka.broker],
  retry: { initialRetryTime: 300, retries: 10 },
});

const consumer = kafka.consumer({ groupId: 'notificaciones-group' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topics: [TOPICS.CERTIFICADO_EMITIDO, TOPICS.FRAUDE_DETECTADO],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      let payload;
      try {
        payload = JSON.parse(message.value.toString());
      } catch {
        console.error('[Kafka Consumer] Mensaje con formato inválido, se ignora.');
        return;
      }

      try {
        if (topic === TOPICS.CERTIFICADO_EMITIDO) {
          await handleCertificadoEmitido(payload);
        } else if (topic === TOPICS.FRAUDE_DETECTADO) {
          await handleFraudeDetectado(payload);
        }
      } catch (err) {
        console.error(`[Kafka Consumer] Error procesando topic ${topic}:`, err.message);
      }
    },
  });

  console.log('[Kafka Consumer] Escuchando topics:', TOPICS.CERTIFICADO_EMITIDO, '|', TOPICS.FRAUDE_DETECTADO);
}

module.exports = { startConsumer };
