'use strict';

const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { nom, email, password } = req.validatedBody;
    const { user, accessToken, refreshToken } = await authService.register({ nom, email, password });
    authService.setRefreshCookie(res, refreshToken);
    return res.status(201).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validatedBody;
    const { user, accessToken, refreshToken } = await authService.login({ email, password });
    authService.setRefreshCookie(res, refreshToken);
    return res.json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    const result = await authService.refresh(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    await authService.logout(token);
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
    return res.json({ message: 'Déconnecté avec succès' });
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

module.exports = { register, login, refresh, logout, me };
