'use strict';
const { Kafka } = require('kafkajs');
const { kafkaConfig } = require('./kafka.topics');

const kafka = new Kafka(kafkaConfig('telemetria-service'));
const producer = kafka.producer();
let connected = false;

async function publish(topic, payload) {
  try {
    if (!connected) {
      await producer.connect();
      connected = true;
    }
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }) }],
    });
  } catch (err) {
    console.error(`[Kafka] Error publicando en ${topic}:`, err.message);
  }
}

module.exports = { publish };
