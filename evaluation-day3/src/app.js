'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const { NODE_ENV, ALLOWED_ORIGINS } = require('./config/env');

const authRoutes = require('./routes/auth');
const livresRoutes = require('./routes/livres');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());

const corsOptions =
  NODE_ENV === 'production'
    ? { origin: ALLOWED_ORIGINS, credentials: true }
    : { origin: true, credentials: true };
app.use(cors(corsOptions));

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives d\'authentification, veuillez réessayer plus tard.' },
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/livres', livresRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route non trouvée : ${req.method} ${req.path}` });
});

app.use(errorHandler);

module.exports = app;
