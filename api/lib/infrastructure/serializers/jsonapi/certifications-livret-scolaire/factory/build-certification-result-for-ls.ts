// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const Certificate = require('../../../../../../lib/infrastructure/serializers/jsonapi/certifications-livret-scolaire/response-objects/Certificate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResults = require('../../../../../../lib/infrastructure/serializers/jsonapi/certifications-livret-scolaire/response-objects/CompetenceResults');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationsResults = require('../../../../../../lib/infrastructure/serializers/jsonapi/certifications-livret-scolaire/response-objects/CertificationsResults');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCompetenceForLS = require('./build-competences-for-ls');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'buildAreaF... Remove this comment to see the full error message
const buildAreaForLS = require('./build-area-for-ls');

function buildReferentialOfCompetences() {
  const area1 = buildAreaForLS({
    id: '1',
    name: '1. Information et données',
  });

  const area2 = buildAreaForLS({
    id: '2',
    name: '2. Communication et collaboration',
  });

  return [
    buildCompetenceForLS({
      name: 'Mener une recherche et une veille d’information',
      id: '1.1',
      area: area1,
    }),
    buildCompetenceForLS({
      name: 'Mener une recherche et une veille d’information',
      id: '1.2',
      area: area1,
    }),
    buildCompetenceForLS({
      name: 'Mener une recherche et une veille d’information',
      id: '1.3',
      area: area1,
    }),
    buildCompetenceForLS({
      name: 'Interagir avec des individus et de petits groupes',
      id: '2.1',
      area: area2,
    }),
    buildCompetenceForLS({
      name: 'Partager et publier des informations et des contenus',
      id: '2.2',
      area: area2,
    }),
    buildCompetenceForLS({
      name: 'Collaborer dans un groupe pour réaliser un projet',
      id: '2.3',
      area: area2,
    }),
  ];
}

function _buildCompetenceResult(level = 5, competenceId: any) {
  return new CompetenceResults({ level, competenceId });
}

function _buildCompetenceResults() {
  const competenceResults = buildReferentialOfCompetences();
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'map' does not exist on type '{}'.
  return competenceResults.map((competence: any) => _buildCompetenceResult(4, competence.id));
}

function buildCertificateForLS({
  id = 1,
  firstName = 'Jean',
  middleName = 'Jerry',
  thirdName = 'Bobby',
  lastName = 'Bon',
  birthdate = '1992-06-12',
  nationalStudentId = 'nationalStudentId1',
  status = 'started',
  pixScore = 320,
  verificationCode = 'P-BBBCCCDD',
  date = '2018-12-01T01:02:03Z',
  deliveredAt = '2018-10-03T01:02:03Z',
  certificationCenter = 'ToonsVille',
  competenceResults = _buildCompetenceResults(),
} = {}) {
  const certificate = new Certificate({
    id,
    firstName,
    middleName,
    thirdName,
    lastName,
    birthdate,
    nationalStudentId,
    status,
    pixScore,
    verificationCode,
    date,
    deliveredAt,
    competenceResults,
    certificationCenter,
  });

  return certificate;
}

function buildCertificationsResults(certifications: any, competences = buildReferentialOfCompetences()) {
  return new CertificationsResults({ certifications, competences });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { buildCertificateForLS, buildReferentialOfCompetences, buildCertificationsResults };
