'use strict';
/**
 * Factory de cliente HTTP para comunicación inter-servicio.
 * Genera un JWT de corta duración con rol SERVICE firmado con el mismo
 * JWT_SECRET compartido por todos los microservicios. El auth middleware
 * de cada servicio lo acepta igual que un token de usuario.
 *
 * Uso:
 *   const { createServiceClient } = require('../config/serviceClient');
 *   const client = createServiceClient();
 *   const { data } = await client.get(`${process.env.EXAMEN_SERVICE_URL}/api/examen/sesion/${id}`);
 */
const axios = require('axios');
const jwt = require('jsonwebtoken');

function createServiceClient() {
  const token = jwt.sign(
    { rol: 'SERVICE' },
    process.env.JWT_SECRET || 'prccd_secret_2026',
    { expiresIn: '60s' }
  );
  return axios.create({
    timeout: 5000,
    headers: { Authorization: `Bearer ${token}` },
  });
}

module.exports = { createServiceClient };
