'use strict';

function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Données invalides', errors: parsed.error.errors });
    }
    req.validatedBody = parsed.data;
    next();
  };
}

module.exports = validate;
