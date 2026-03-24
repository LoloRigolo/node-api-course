'use strict';

const livresService = require('../services/livresService');

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
    const { titre, auteur, annee, genre } = req.validatedBody;
    const livre = await livresService.createLivre({ titre, auteur, annee, genre });
    return res.status(201).json(livre);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { titre, auteur, annee, genre, disponible } = req.validatedBody;
    const livre = await livresService.updateLivre(Number(req.params.id), { titre, auteur, annee, genre, disponible });
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
