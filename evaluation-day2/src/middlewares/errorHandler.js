'use strict';

function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(status).json({ message });
}

module.exports = errorHandler;
