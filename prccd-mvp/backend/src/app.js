// Módulo: Instancia Express — App principal
// Responsable: Javier Andrés Monjes Solórzano — 202100081
// Rama: feature/ingesta-usac
// Tarea: F2-01

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const authRoutes = require('./routes/auth.routes');
const ingestaRoutes = require('./routes/ingesta.routes');
const examenRoutes = require('./routes/examen.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check — público
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'prccd-backend', timestamp: new Date().toISOString() });
});

// Autenticación — público
app.use('/api/auth', authRoutes);

// Rutas protegidas con JWT
app.use('/api/ingest', authMiddleware, ingestaRoutes);

// Error handler global — siempre al final
app.use(errorMiddleware);

app.use('/api/examen', authMiddleware, examenRoutes);
module.exports = app;