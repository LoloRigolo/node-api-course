'use strict';

const { z } = require('zod');
const authService = require('../services/authService');

const registerSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Données invalides', errors: parsed.error.errors });
    }

    const result = await authService.register(parsed.data);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Données invalides', errors: parsed.error.errors });
    }

    const result = await authService.login(parsed.data);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
