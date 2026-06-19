// Módulo: Instancia Express — Microservicio de Dashboard BI
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'dashboard-service', timestamp: new Date().toISOString() });
});

app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.use(errorMiddleware);

module.exports = app;
