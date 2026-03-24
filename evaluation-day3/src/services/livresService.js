'use strict';

const prisma = require('../db/prisma');

async function getAllLivres() {
  return prisma.livre.findMany({ orderBy: { createdAt: 'desc' } });
}

async function getLivreById(id) {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const err = new Error('Livre non trouvé');
    err.status = 404;
    throw err;
  }
  return livre;
}

async function createLivre(data) {
  return prisma.livre.create({ data });
}

async function updateLivre(id, data) {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const err = new Error('Livre non trouvé');
    err.status = 404;
    throw err;
  }
  return prisma.livre.update({ where: { id }, data });
}

async function deleteLivre(id) {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const err = new Error('Livre non trouvé');
    err.status = 404;
    throw err;
  }
  return prisma.livre.delete({ where: { id } });
}

async function emprunterLivre(livreId, userId) {
  const livre = await prisma.livre.findUnique({ where: { id: livreId } });
  if (!livre) {
    const err = new Error('Livre non trouvé');
    err.status = 404;
    throw err;
  }
  if (!livre.disponible) {
    const err = new Error('Ce livre n\'est pas disponible');
    err.status = 409;
    throw err;
  }

  const [updatedLivre, emprunt] = await prisma.$transaction([
    prisma.livre.update({
      where: { id: livreId },
      data: { disponible: false },
    }),
    prisma.emprunt.create({
      data: { livreId, userId },
    }),
  ]);

  return { livre: updatedLivre, emprunt };
}

async function retournerLivre(livreId, userId) {
  const emprunt = await prisma.emprunt.findFirst({
    where: { livreId, userId, dateRetour: null },
  });
  if (!emprunt) {
    const err = new Error('Aucun emprunt actif trouvé pour ce livre');
    err.status = 404;
    throw err;
  }

  const [updatedLivre, updatedEmprunt] = await prisma.$transaction([
    prisma.livre.update({
      where: { id: livreId },
      data: { disponible: true },
    }),
    prisma.emprunt.update({
      where: { id: emprunt.id },
      data: { dateRetour: new Date() },
    }),
  ]);

  return { livre: updatedLivre, emprunt: updatedEmprunt };
}

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  emprunterLivre,
  retournerLivre,
};
