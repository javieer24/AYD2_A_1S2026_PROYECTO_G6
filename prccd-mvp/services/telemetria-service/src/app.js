// Módulo: Instancia Express — Microservicio de Telemetría
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const telemetriaRoutes = require('./routes/telemetria.routes');
const evidenciaRoutes = require('./routes/evidencia.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'telemetria-service', timestamp: new Date().toISOString() });
});

// Mas especifica primero: si no, "/evidencia" caeria en la ruta generica
// GET /api/telemetria/:sesion_id de telemetriaRoutes.
app.use('/api/telemetria/evidencia', authMiddleware, evidenciaRoutes);
app.use('/api/telemetria', authMiddleware, telemetriaRoutes);

app.use(errorMiddleware);

module.exports = app;
