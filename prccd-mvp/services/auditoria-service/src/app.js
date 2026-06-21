// Módulo: Instancia Express — Microservicio de Auditoría
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const auditoriaRoutes = require('./routes/auditoria.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auditoria-service', timestamp: new Date().toISOString() });
});

app.use('/api/audit', authMiddleware, auditoriaRoutes);

app.use(errorMiddleware);

module.exports = app;
