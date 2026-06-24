/**
 * Contrato de topics Kafka compartido — PRCCD/SICA Fase 3
 *
 * Cada servicio productor copia este archivo a src/config/kafka.topics.js
 * y lo importa desde ahí. El broker se configura via variable de entorno
 * KAFKA_BROKER (default: kafka:9092 dentro de Docker).
 *
 * Topics definidos:
 *   examen.completado   — examen-service publica cuando el candidato termina evaluación
 *   certificado.emitido — certificado-service publica tras INSERT exitoso en certificados_pki
 *   fraude.detectado    — telemetria-service publica cuando suspenderSiCorresponde() actúa
 *
 * Consumidores esperados:
 *   examen.completado   → certificado-service (emitir cert automático), notificaciones-service
 *   certificado.emitido → notificaciones-service (email candidato + universidad)
 *   fraude.detectado    → notificaciones-service (alerta auditor SICA), auditoria-service
 */

'use strict';

const TOPICS = Object.freeze({
  EXAMEN_COMPLETADO:   'examen.completado',
  CERTIFICADO_EMITIDO: 'certificado.emitido',
  FRAUDE_DETECTADO:    'fraude.detectado',
});

/**
 * Devuelve la configuración base de KafkaJS para un servicio dado.
 * clientId debe ser el nombre del microservicio (ej. 'examen-service').
 */
function kafkaConfig(clientId) {
  return {
    clientId,
    brokers: [(process.env.KAFKA_BROKER || 'kafka:9092')],
    retry: { initialRetryTime: 300, retries: 5 },
  };
}

module.exports = { TOPICS, kafkaConfig };
