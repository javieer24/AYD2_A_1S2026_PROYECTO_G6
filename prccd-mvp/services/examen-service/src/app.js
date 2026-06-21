// Módulo: Instancia Express — Microservicio de Examen Adaptativo y Banco de Preguntas
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const examenRoutes = require('./routes/examen.routes');
const preguntasRoutes = require('./routes/preguntas.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'examen-service', timestamp: new Date().toISOString() });
});

app.use('/api/examen/preguntas', authMiddleware, preguntasRoutes);
app.use('/api/examen', authMiddleware, examenRoutes);

app.use(errorMiddleware);

module.exports = app;
