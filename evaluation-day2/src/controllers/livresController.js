'use strict';

const { z } = require('zod');
const livresService = require('../services/livresService');

const createLivreSchema = z.object({
  titre: z.string().min(1),
  auteur: z.string().min(1),
  annee: z.number().int().optional(),
  genre: z.string().optional(),
});

const updateLivreSchema = z.object({
  titre: z.string().min(1).optional(),
  auteur: z.string().min(1).optional(),
  annee: z.number().int().optional(),
  genre: z.string().optional(),
  disponible: z.boolean().optional(),
});

async function getAll(req, res, next) {
  try {
    const livres = await livresService.getAllLivres();
    return res.json(livres);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const livre = await livresService.getLivreById(Number(req.params.id));
    return res.json(livre);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = createLivreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Données invalides', errors: parsed.error.errors });
    }

    const livre = await livresService.createLivre(parsed.data);
    return res.status(201).json(livre);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const parsed = updateLivreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Données invalides', errors: parsed.error.errors });
    }

    const livre = await livresService.updateLivre(Number(req.params.id), parsed.data);
    return res.json(livre);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await livresService.deleteLivre(Number(req.params.id));
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function emprunter(req, res, next) {
  try {
    const result = await livresService.emprunterLivre(Number(req.params.id), req.user.id);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function retourner(req, res, next) {
  try {
    const result = await livresService.retournerLivre(Number(req.params.id), req.user.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove, emprunter, retourner };
