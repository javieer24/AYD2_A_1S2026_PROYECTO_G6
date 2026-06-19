// Módulo: Instancia Express — Microservicio de Autenticación
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() });
});

// Autenticación — público (este servicio emite los JWT, no los exige)
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;
