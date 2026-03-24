'use strict';

const { z } = require('zod');

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

module.exports = { createLivreSchema, updateLivreSchema };
