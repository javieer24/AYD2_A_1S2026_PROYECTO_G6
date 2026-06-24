'use strict';
const axios = require('axios');
const jwt = require('jsonwebtoken');
const env = require('./env');

function createServiceClient() {
  const token = jwt.sign({ rol: 'SERVICE' }, env.jwtSecret, { expiresIn: '60s' });
  return axios.create({
    timeout: 5000,
    headers: { Authorization: `Bearer ${token}` },
  });
}

module.exports = { createServiceClient };
