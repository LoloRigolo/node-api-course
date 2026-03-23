'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bibliotheque.fr' },
    update: {},
    create: {
      nom: 'Administrateur',
      email: 'admin@bibliotheque.fr',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('Admin créé :', admin.email);

  const userPassword = await bcrypt.hash('user1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@bibliotheque.fr' },
    update: {},
    create: {
      nom: 'Utilisateur Test',
      email: 'user@bibliotheque.fr',
      password: userPassword,
      role: 'user',
    },
  });
  console.log('User créé :', user.email);

  const livres = [
    { titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupéry', annee: 1943, genre: 'Roman' },
    { titre: 'L\'Étranger', auteur: 'Albert Camus', annee: 1942, genre: 'Roman' },
    { titre: 'Clean Code', auteur: 'Robert C. Martin', annee: 2008, genre: 'Informatique' },
    { titre: 'JavaScript: The Good Parts', auteur: 'Douglas Crockford', annee: 2008, genre: 'Informatique' },
    { titre: 'Node.js Design Patterns', auteur: 'Mario Casciaro', annee: 2020, genre: 'Informatique' },
  ];

  for (const livre of livres) {
    const created = await prisma.livre.upsert({
      where: { id: livres.indexOf(livre) + 1 },
      update: {},
      create: livre,
    });
    console.log('Livre créé :', created.titre);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
