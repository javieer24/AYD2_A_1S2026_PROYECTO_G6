// Módulo: Instancia Express — Microservicio de Telemetría
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const telemetriaRoutes = require('./routes/telemetria.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'telemetria-service', timestamp: new Date().toISOString() });
});

app.use('/api/telemetria', authMiddleware, telemetriaRoutes);

app.use(errorMiddleware);

module.exports = app;
