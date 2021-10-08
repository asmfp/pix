const PrivateCertificate = require('../../../../lib/domain/models/PrivateCertificate');
const buildCleaCertificationResult = require('./build-clea-certification-result');

const buildPrivateCertificate = function ({
  id = 1,
  firstName = 'Jean',
  lastName = 'Bon',
  birthdate = '1992-06-12',
  birthplace = 'Paris',
  isPublished = true,
  userId = 1,
  certificationCenter = 'L’univeristé du Pix',
  date = new Date('2018-12-01T01:02:03Z'),
  deliveredAt = new Date('2018-10-03T01:02:03Z'),
  commentForCandidate = null,
  pixScore = 156,
  status = PrivateCertificate.status.VALIDATED,
  cleaCertificationResult = buildCleaCertificationResult.notTaken(),
  certifiedBadgeImages = [],
  resultCompetenceTree = null,
  verificationCode = 'P-BBBCCCDD',
  maxReachableLevelOnCertificationDate = 5,
} = {}) {
  return new PrivateCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    commentForCandidate,
    pixScore,
    status,
    resultCompetenceTree,
    cleaCertificationResult,
    certifiedBadgeImages,
    verificationCode,
    maxReachableLevelOnCertificationDate,
  });
};

buildPrivateCertificate.cancelled = function ({
  id,
  firstName,
  lastName,
  birthdate,
  birthplace,
  isPublished,
  userId,
  certificationCenter,
  date,
  deliveredAt,
  commentForCandidate,
  pixScore,
  cleaCertificationResult,
  certifiedBadgeImages,
  resultCompetenceTree,
  verificationCode,
  maxReachableLevelOnCertificationDate,
}) {
  return buildPrivateCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    commentForCandidate,
    pixScore,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    status: PrivateCertificate.status.CANCELLED,
  });
};

buildPrivateCertificate.validated = function ({
  id,
  firstName,
  lastName,
  birthdate,
  birthplace,
  isPublished,
  userId,
  certificationCenter,
  date,
  deliveredAt,
  commentForCandidate,
  pixScore,
  cleaCertificationResult,
  certifiedBadgeImages,
  resultCompetenceTree,
  verificationCode,
  maxReachableLevelOnCertificationDate,
}) {
  return buildPrivateCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    commentForCandidate,
    pixScore,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    status: PrivateCertificate.status.VALIDATED,
  });
};

buildPrivateCertificate.rejected = function ({
  id,
  firstName,
  lastName,
  birthdate,
  birthplace,
  isPublished,
  userId,
  certificationCenter,
  date,
  deliveredAt,
  commentForCandidate,
  pixScore,
  cleaCertificationResult,
  certifiedBadgeImages,
  resultCompetenceTree,
  verificationCode,
  maxReachableLevelOnCertificationDate,
}) {
  return buildPrivateCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    commentForCandidate,
    pixScore,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    status: PrivateCertificate.status.REJECTED,
  });
};

buildPrivateCertificate.error = function ({
  id,
  firstName,
  lastName,
  birthdate,
  birthplace,
  isPublished,
  userId,
  certificationCenter,
  date,
  deliveredAt,
  commentForCandidate,
  pixScore,
  cleaCertificationResult,
  certifiedBadgeImages,
  resultCompetenceTree,
  verificationCode,
  maxReachableLevelOnCertificationDate,
}) {
  return buildPrivateCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    commentForCandidate,
    pixScore,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    status: PrivateCertificate.status.ERROR,
  });
};

buildPrivateCertificate.started = function ({
  id,
  firstName,
  lastName,
  birthdate,
  birthplace,
  isPublished,
  userId,
  certificationCenter,
  date,
  deliveredAt,
  commentForCandidate,
  pixScore,
  cleaCertificationResult,
  certifiedBadgeImages,
  resultCompetenceTree,
  verificationCode,
  maxReachableLevelOnCertificationDate,
}) {
  return buildPrivateCertificate({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    certificationCenter,
    date,
    deliveredAt,
    commentForCandidate,
    pixScore,
    cleaCertificationResult,
    certifiedBadgeImages,
    resultCompetenceTree,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    status: PrivateCertificate.status.STARTED,
  });
};

module.exports = buildPrivateCertificate;
