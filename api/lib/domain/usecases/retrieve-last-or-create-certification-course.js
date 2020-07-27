const CertificationCourse = require('../models/CertificationCourse');
const Assessment = require('../models/Assessment');
const { UserNotAuthorizedToCertifyError, NotFoundError } = require('../errors');

module.exports = async function retrieveLastOrCreateCertificationCourse({
  domainTransaction,
  accessCode,
  sessionId,
  userId,
  assessmentRepository,
  competenceRepository,
  certificationCandidateRepository,
  certificationChallengeRepository,
  certificationCourseRepository,
  sessionRepository,
  certificationChallengesService,
  placementProfileService,
}) {
  const session = await sessionRepository.get(sessionId);
  if (session.accessCode !== accessCode) {
    throw new NotFoundError('Session not found');
  }

  const existingCertificationCourse = await certificationCourseRepository.findOneCertificationCourseByUserIdAndSessionId({ userId, sessionId, domainTransaction });
  if (existingCertificationCourse) {
    return {
      created: false,
      certificationCourse: existingCertificationCourse,
    };
  }

  return _startNewCertification({
    domainTransaction,
    sessionId,
    userId,
    assessmentRepository,
    competenceRepository,
    certificationCandidateRepository,
    certificationChallengeRepository,
    certificationCourseRepository,
    certificationChallengesService,
    placementProfileService,
  });
};

async function _startNewCertification({
  domainTransaction,
  sessionId,
  userId,
  assessmentRepository,
  certificationCandidateRepository,
  certificationChallengeRepository,
  certificationCourseRepository,
  certificationChallengesService,
  placementProfileService,
}) {
  let placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate: new Date() });

  if (!placementProfile.isCertifiable()) {
    throw new UserNotAuthorizedToCertifyError();
  }

  // FIXME : Ce n'est pas la responsabilité du placementProfile que d'avoir les challenges
  placementProfile = await placementProfileService.fillPlacementProfileWithChallenges(placementProfile);

  const existingCertificationCourse = await certificationCourseRepository.findOneCertificationCourseByUserIdAndSessionId({ userId, sessionId, domainTransaction });
  if (existingCertificationCourse) {
    return {
      created: false,
      certificationCourse: existingCertificationCourse,
    };
  }

  const newCertificationCourse = await _generateCertificationCourseFromCandidateParticipation({ userId, sessionId, certificationCandidateRepository });
  const savedCertificationCourse = await certificationCourseRepository.save({ certificationCourse: newCertificationCourse, domainTransaction });
  const newAssessment = _generateAssessmentForCertificationCourse({ userId, certificationCourseId: savedCertificationCourse.id });
  const savedAssessment = await assessmentRepository.save({ assessment: newAssessment, domainTransaction });
  const newCertificationChallenges = certificationChallengesService.generateCertificationChallenges(placementProfile.userCompetences, savedCertificationCourse.id);
  const savedChallenges = await Promise.all(newCertificationChallenges.map((certificationChallenge) => certificationChallengeRepository.save({ certificationChallenge, domainTransaction })));

  savedCertificationCourse.assessment = savedAssessment;
  savedCertificationCourse.challenges = savedChallenges;

  return {
    created: true,
    certificationCourse: savedCertificationCourse,
  };
}

async function _generateCertificationCourseFromCandidateParticipation({ userId, sessionId, certificationCandidateRepository }) {
  const personalInfo = { firstName: null, lastName: null, birthdate: null, birthplace: null, externalId: null };
  const certificationCandidate = await certificationCandidateRepository.getBySessionIdAndUserId({ sessionId, userId });

  personalInfo.firstName = certificationCandidate.firstName;
  personalInfo.lastName = certificationCandidate.lastName;
  personalInfo.birthdate = certificationCandidate.birthdate;
  personalInfo.birthplace = certificationCandidate.birthCity;
  personalInfo.externalId = certificationCandidate.externalId;

  return new CertificationCourse({
    userId,
    sessionId,
    ...personalInfo,
    isV2Certification: true,
  });
}

function _generateAssessmentForCertificationCourse({ userId, certificationCourseId }) {
  return new Assessment({
    userId,
    certificationCourseId,
    state: Assessment.states.STARTED,
    type: Assessment.types.CERTIFICATION,
  });
}
