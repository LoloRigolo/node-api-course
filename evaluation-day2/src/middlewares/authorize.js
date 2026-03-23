'use strict';

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès interdit : rôle insuffisant' });
    }
    next();
  };
}

module.exports = authorize;
