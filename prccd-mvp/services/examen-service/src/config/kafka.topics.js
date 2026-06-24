'use strict';

const TOPICS = Object.freeze({
  EXAMEN_COMPLETADO:   'examen.completado',
  CERTIFICADO_EMITIDO: 'certificado.emitido',
  FRAUDE_DETECTADO:    'fraude.detectado',
});

function kafkaConfig(clientId) {
  return {
    clientId,
    brokers: [(process.env.KAFKA_BROKER || 'kafka:9092')],
    retry: { initialRetryTime: 300, retries: 5 },
  };
}

module.exports = { TOPICS, kafkaConfig };
