'use strict';
const { sendMail } = require('../config/mailer');
const { createServiceClient } = require('../config/serviceClient');
const env = require('../config/env');

async function handleCertificadoEmitido(payload) {
  const { id_certificado, id_candidato, hash_documento, sesion_examen_id } = payload;

  // Obtener datos del candidato (email, nombre, universidad) desde auth-service
  let candidato = null;
  try {
    const client = createServiceClient();
    const { data } = await client.get(`${env.services.authUrl}/api/auth/candidatos/${id_candidato}`);
    candidato = data;
  } catch (err) {
    console.error('[Notif] No se pudo obtener datos del candidato:', err.message);
  }

  const nombreCandidato = candidato?.nombre_completo || id_candidato;
  const emailCandidato  = candidato?.email || null;
  const universidad     = candidato?.universidad_origen || null;
  const verifyUrl = `${env.appUrl}/api/certificate/verificar/${id_certificado}`;

  // Email al candidato
  if (emailCandidato) {
    await sendMail({
      to: emailCandidato,
      subject: '¡Tu certificado PRCCD fue emitido exitosamente!',
      html: `
        <h2>Felicitaciones, ${nombreCandidato}</h2>
        <p>Tu certificado de competencia profesional ha sido emitido y registrado en el sistema SICA.</p>
        <p><strong>ID Certificado:</strong> ${id_certificado}</p>
        <p><strong>Hash de verificación:</strong> <code>${hash_documento}</code></p>
        <p>Podés verificar la autenticidad de tu certificado en el siguiente enlace:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <hr>
        <small>Este es un mensaje automático del Sistema SICA — PRCCD.</small>
      `,
    });
  } else {
    console.warn(`[Notif] Candidato ${id_candidato} no tiene email registrado — se omite notificación personal.`);
  }

  // Email al coordinador de la universidad
  if (universidad && env.universidades[universidad]) {
    await sendMail({
      to: env.universidades[universidad],
      subject: `Nuevo egresado aprobado — ${universidad}`,
      html: `
        <h2>Reporte de egresado aprobado — ${universidad}</h2>
        <p>El candidato <strong>${nombreCandidato}</strong> (ID: ${id_candidato}) aprobó el examen de competencia PRCCD.</p>
        <p><strong>Certificado emitido:</strong> ${id_certificado}</p>
        <p><strong>Sesión de examen:</strong> ${sesion_examen_id}</p>
        <p>Verificación pública: <a href="${verifyUrl}">${verifyUrl}</a></p>
        <hr>
        <small>Sistema SICA — notificación automática.</small>
      `,
    });
  }
}

module.exports = { handleCertificadoEmitido };
