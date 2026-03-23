'use strict';

require('dotenv').config();

const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const livresRoutes = require('./routes/livres');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/livres', livresRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});