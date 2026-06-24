'use strict';
const { sendMail } = require('../config/mailer');
const env = require('../config/env');

async function handleFraudeDetectado(payload) {
  const { sesion_id, total_eventos, timestamp } = payload;

  await sendMail({
    to: env.auditoresEmails,
    subject: `[ALERTA FRAUDE] Sesión suspendida por comportamiento sospechoso — ID ${sesion_id}`,
    html: `
      <h2 style="color:#c0392b;">⚠ Alerta de Fraude Detectado — Sistema SICA</h2>
      <p>Se ha suspendido automáticamente una sesión de examen por superar el umbral de eventos sospechosos.</p>
      <table border="1" cellpadding="6" cellspacing="0">
        <tr><td><strong>Sesión ID</strong></td><td>${sesion_id}</td></tr>
        <tr><td><strong>Total eventos sospechosos</strong></td><td>${total_eventos}</td></tr>
        <tr><td><strong>Detectado en</strong></td><td>${timestamp || new Date().toISOString()}</td></tr>
      </table>
      <p>Por favor revise el registro de auditoría en el panel SICA para más detalles.</p>
      <hr>
      <small>Sistema SICA — alerta automática antifraude.</small>
    `,
  });

  console.log(`[Notif] Alerta de fraude enviada para sesión ${sesion_id} → ${env.auditoresEmails.join(', ')}`);
}

module.exports = { handleFraudeDetectado };
