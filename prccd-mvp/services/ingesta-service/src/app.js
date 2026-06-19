// Módulo: Instancia Express — Microservicio de Ingesta
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const ingestaRoutes = require('./routes/ingesta.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ingesta-service', timestamp: new Date().toISOString() });
});

app.use('/api/ingest', authMiddleware, ingestaRoutes);

app.use(errorMiddleware);

module.exports = app;
