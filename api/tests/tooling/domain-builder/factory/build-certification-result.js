const CertificationResult = require('../../../../lib/domain/models/CertificationResult');

const buildCertificationResult = function ({
  id = 123,
  firstName = 'Malik',
  lastName = 'Wayne',
  birthplace = 'Perpignan',
  birthdate = '2000-08-30',
  externalId = 'externalId',
  createdAt = new Date('2020-01-01'),
  sessionId = 789,
  status = CertificationResult.status.REJECTED,
  pixScore = 0,
  commentForOrganization = 'comment organization',
  competencesWithMark = [],
  partnerCertifications = [],
} = {}) {
  return new CertificationResult({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status,
    pixScore,
    commentForOrganization,
    competencesWithMark,
    partnerCertifications,
  });
};

buildCertificationResult.validated = function ({
  id,
  firstName,
  lastName,
  birthplace,
  birthdate,
  externalId,
  createdAt,
  sessionId,
  pixScore,
  commentForOrganization,
  competencesWithMark,
  partnerCertifications,
}) {
  return buildCertificationResult({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status: CertificationResult.status.VALIDATED,
    pixScore,
    commentForOrganization,
    competencesWithMark,
    partnerCertifications,
  });
};

buildCertificationResult.rejected = function ({
  id,
  firstName,
  lastName,
  birthplace,
  birthdate,
  externalId,
  createdAt,
  sessionId,
  pixScore,
  commentForOrganization,
  competencesWithMark,
  partnerCertifications,
}) {
  return buildCertificationResult({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status: CertificationResult.status.REJECTED,
    pixScore,
    commentForOrganization,
    competencesWithMark,
    partnerCertifications,
  });
};

buildCertificationResult.cancelled = function ({
  id,
  firstName,
  lastName,
  birthplace,
  birthdate,
  externalId,
  createdAt,
  sessionId,
  pixScore,
  commentForOrganization,
  competencesWithMark,
  partnerCertifications,
}) {
  return buildCertificationResult({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status: CertificationResult.status.CANCELLED,
    pixScore,
    commentForOrganization,
    competencesWithMark,
    partnerCertifications,
  });
};

buildCertificationResult.error = function ({
  id,
  firstName,
  lastName,
  birthplace,
  birthdate,
  externalId,
  createdAt,
  sessionId,
  pixScore,
  commentForOrganization,
  competencesWithMark,
  partnerCertifications,
}) {
  return buildCertificationResult({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status: CertificationResult.status.ERROR,
    pixScore,
    commentForOrganization,
    competencesWithMark,
    partnerCertifications,
  });
};

module.exports = buildCertificationResult;
