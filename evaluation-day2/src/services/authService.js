'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');

async function register({ nom, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Cet email est déjà utilisé');
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { nom, email, password: hashedPassword },
    select: { id: true, nom: true, email: true, role: true, createdAt: true },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return { user, token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error('Email ou mot de passe incorrect');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, nom: true, email: true, role: true, createdAt: true },
  });
  return user;
}

module.exports = { register, login, getMe };
