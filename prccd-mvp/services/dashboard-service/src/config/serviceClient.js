'use strict';
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
