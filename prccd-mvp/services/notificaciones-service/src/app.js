'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notificaciones-service', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

module.exports = app;
