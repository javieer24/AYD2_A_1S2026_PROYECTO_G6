'use strict';
const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (env.nodeEnv === 'development' || !env.smtp.host) {
    // Ethereal: cuenta de prueba gratuita, los emails se ven en https://ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log('[Mailer] Usando Ethereal. Credenciales:', testAccount.user, testAccount.pass);
    console.log('[Mailer] Ver emails en: https://ethereal.email/messages');
  } else {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }

  return transporter;
}

async function sendMail({ to, subject, html }) {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: env.smtp.from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  });
  if (env.nodeEnv === 'development') {
    console.log(`[Mailer] Email enviado → ${nodemailer.getTestMessageUrl(info)}`);
  }
  return info;
}

module.exports = { sendMail };
