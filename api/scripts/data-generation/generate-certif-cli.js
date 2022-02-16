#!/usr/bin/env node
'use strict';
const inquirer = require('inquirer');
require('dotenv').config({ path: `${__dirname}/../../.env` });
const { knex } = require(`${__dirname}/../../db/knex-database-connection`);
const DatabaseBuilder = require(`${__dirname}/../../db/database-builder/database-builder`);
const databaseBuilder = new DatabaseBuilder({ knex });

console.log('Salut tu veux des sessions?');

const questions = [
  {
    type: 'list',
    name: 'centerType',
    message: 'Quel type de centre ?',
    choices: ['SCO', 'SUP', 'PRO'],
    filter(centerType) {
      return centerType.toLowerCase();
    },
  },
  {
    type: 'input',
    name: 'candidates',
    message: 'Combien de candidats?',
    validate(value) {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Renseigner un nombre';
    },
    filter: Number,
  },
  {
    type: 'confirm',
    name: 'needComplementaryCertifications',
    message: 'As tu besoin de certifications complementaires?',
    default: false,
  },
  {
    type: 'checkbox',
    name: 'complementaryCertifications',
    message: 'Quelles certifications complémentaires souhaitez-vous ?',
    choices: [
      {
        key: 'p',
        name: 'Pix+Edu',
        value: 'PixEdu',
      },
      {
        key: 'a',
        name: 'Pix+Droit',
        value: 'PixDroit',
      },
      {
        key: 'w',
        name: 'Cléa Numérique',
        value: 'clea',
      },
    ],
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log('\nDetails:');
  console.log(JSON.stringify(answers, null, '  '));

  databaseBuilder.factory.buildSession();
  databaseBuilder.commit().then(() => {
    console.log('Done !');
  });
});
