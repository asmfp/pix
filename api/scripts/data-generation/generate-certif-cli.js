#!/usr/bin/env node
'use strict';
const inquirer = require('inquirer');
require('dotenv').config({ path: `${__dirname}/../../.env` });
const { knex } = require(`../../db/knex-database-connection`);
const domainBuilder = require('../../tests/tooling/domain-builder/factory');
const omit = require('lodash/omit');
const times = require('lodash/times');

console.log('Salut tu veux des sessions?');

const CERTIFICATION_CENTER_IDS_BY_TYPE = {
  SCO: 1,
  SUP: 3,
  PRO: 2,
};

const questions = [
  {
    type: 'list',
    name: 'centerType',
    message: 'Quel type de centre ?',
    choices: ['SCO', 'SUP', 'PRO'],
  },
  {
    type: 'input',
    name: 'candidateNumber',
    message: 'Combien de candidats ?',
    validate(value) {
      const valid = !isNaN(parseInt(value));
      return valid || 'Renseigner un nombre';
    },
    filter: Number,
  },
  {
    type: 'confirm',
    name: 'needComplementaryCertifications',
    message: 'As tu besoin de certifications complémentaires ?',
    default: false,
    when({ centerType }) {
      return centerType !== 'SCO';
    },
  },
  {
    type: 'checkbox',
    name: 'complementaryCertifications',
    message: 'Quelles certifications complémentaires souhaitez-vous ?',
    when({ needComplementaryCertifications }) {
      return needComplementaryCertifications;
    },
    choices: [
      {
        name: 'Pix+ Edu',
        value: 'Pix+ Edu',
      },
      {
        name: 'Pix+ Droit',
        value: 'Pix+ Droit',
      },
      {
        name: 'Cléa Numérique',
        value: 'Cléa Numérique',
      },
    ],
  },
];

inquirer
  .prompt(questions)
  .then(async (answers) => {
    console.log('\nDetails:');
    console.log(JSON.stringify(answers, null, '  '));

    const { centerType, candidateNumber } = answers;
    const certificationCenterId = CERTIFICATION_CENTER_IDS_BY_TYPE[centerType];

    const sessionId = await _createSessionAndReturnId(certificationCenterId);

    if (centerType === 'SCO') {
      await _createScoCertificationCandidates(certificationCenterId, candidateNumber, sessionId);
    } else {
      await _createNonScoCertificationCandidates(candidateNumber, sessionId);
    }

    const results = await _getResults(sessionId);
    console.table(results);

    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function _createSessionAndReturnId(certificationCenterId) {
  const [sessionId] = await knex('sessions')
    .insert(omit(domainBuilder.buildSession({ certificationCenterId }), ['id', 'certificationCandidates']))
    .returning('id');
  return sessionId;
}

async function _createNonScoCertificationCandidates(candidateNumber, sessionId) {
  times(candidateNumber, async (index) => {
    const birthdate = new Date('2020-01-01');
    birthdate.setDate(birthdate.getDate() + index);
    await knex('certification-candidates').insert(
      omit(
        domainBuilder.buildCertificationCandidate({
          firstName: 'John',
          lastName: 'Doe',
          birthdate,
          sessionId,
        }),
        ['id', 'userId', 'complementaryCertifications']
      )
    );
  });
}

async function _createScoCertificationCandidates(certificationCenterId, candidateNumber, sessionId) {
  const schoolingRegistrations = await knex('schooling-registrations')
    .select('schooling-registrations.id as schoolingRegistrationId', 'firstName', 'lastName', 'birthdate')
    .innerJoin('organizations', 'organizations.id', 'schooling-registrations.organizationId')
    .innerJoin('certification-centers', 'certification-centers.externalId', 'organizations.externalId')
    .where('certification-centers.id', certificationCenterId)
    .limit(candidateNumber);
  for (const { schoolingRegistrationId, firstName, lastName, birthdate } of schoolingRegistrations) {
    await knex('certification-candidates').insert(
      omit(
        domainBuilder.buildCertificationCandidate({
          firstName,
          lastName,
          birthdate,
          schoolingRegistrationId,
          sessionId,
        }),
        ['id', 'userId', 'complementaryCertifications']
      )
    );
  }
}

async function _getResults(sessionId) {
  return await knex('sessions')
    .select(
      'sessions.id as sessionId',
      'sessions.accessCode',
      'certification-candidates.firstName',
      'certification-candidates.lastName',
      'certification-candidates.birthdate'
    )
    .join('certification-candidates', 'certification-candidates.sessionId', 'sessions.id')
    .where('sessions.id', sessionId);
}
