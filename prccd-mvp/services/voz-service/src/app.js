const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const vozRoutes = require('./routes/voz.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'voz-service', timestamp: new Date().toISOString() });
});

app.use('/api/voz', authMiddleware, vozRoutes);

app.use(errorMiddleware);

module.exports = app;
