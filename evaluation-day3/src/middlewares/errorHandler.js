'use strict';

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${status} — ${err.message}`);

  if (process.env.NODE_ENV === 'production' && status >= 500) {
    return res.status(status).json({ message: 'Erreur interne' });
  }

  res.status(status).json({ message: err.message || 'Erreur interne du serveur' });
}

module.exports = errorHandler;
