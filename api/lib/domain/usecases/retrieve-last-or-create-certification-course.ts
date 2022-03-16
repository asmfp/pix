// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../models/CertificationCourse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourse = require('../models/ComplementaryCertificationCourse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const { PIX_PLUS_DROIT, CLEA } = require('../models/ComplementaryCertification');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToCertifyError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionNot... Remove this comment to see the full error message
  SessionNotAccessible,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CandidateN... Remove this comment to see the full error message
  CandidateNotAuthorizedToJoinSessionError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CandidateN... Remove this comment to see the full error message
  CandidateNotAuthorizedToResumeCertificationTestError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'features'.
const { features, featureToggles } = require('../../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function retrieveLastOrCreateCertificationCourse({
  domainTransaction,
  accessCode,
  sessionId,
  userId,
  locale,
  assessmentRepository,
  competenceRepository,
  certificationCandidateRepository,
  certificationCourseRepository,
  complementaryCertificationRepository,
  sessionRepository,
  certificationCenterRepository,
  certificationChallengesService,
  placementProfileService,
  certificationBadgesService,
  verifyCertificateCodeService,
  endTestScreenRemovalService
}: any) {
  const session = await sessionRepository.get(sessionId);
  if (session.accessCode !== accessCode) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('Session not found');
  }
  if (!session.isAccessible()) {
    throw new SessionNotAccessible();
  }

  const certificationCandidate = await certificationCandidateRepository.getBySessionIdAndUserId({
    userId,
    sessionId,
  });

  const isEndTestRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId(
    session.id
  );

  const existingCertificationCourse =
    await certificationCourseRepository.findOneCertificationCourseByUserIdAndSessionId({
      userId,
      sessionId,
      domainTransaction,
    });

  if (isEndTestRemovalEnabled && !certificationCandidate.isAuthorizedToStart()) {
    if (existingCertificationCourse) {
      throw new CandidateNotAuthorizedToResumeCertificationTestError();
    } else {
      throw new CandidateNotAuthorizedToJoinSessionError();
    }
  }

  if (isEndTestRemovalEnabled) {
    certificationCandidate.authorizedToStart = false;
    certificationCandidateRepository.update(certificationCandidate);
  }

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
    certificationCandidate,
    locale,
    assessmentRepository,
    competenceRepository,
    certificationCourseRepository,
    certificationCenterRepository,
    certificationChallengesService,
    placementProfileService,
    verifyCertificateCodeService,
    complementaryCertificationRepository,
    certificationBadgesService,
  });
};

async function _startNewCertification({
  domainTransaction,
  sessionId,
  userId,
  certificationCandidate,
  locale,
  assessmentRepository,
  certificationCourseRepository,
  certificationCenterRepository,
  certificationChallengesService,
  placementProfileService,
  certificationBadgesService,
  verifyCertificateCodeService,
  complementaryCertificationRepository
}: any) {
  const challengesForCertification = [];

  const challengesForPixCertification = await _createPixCertification(
    placementProfileService,
    certificationChallengesService,
    userId,
    locale
  );
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
  challengesForCertification.push(...challengesForPixCertification);

  // Above operations are potentially slow so that two simultaneous calls of this function might overlap 😿
  // In case the simultaneous call finished earlier than the current one, we want to return its result
  const certificationCourseCreatedMeanwhile = await _getCertificationCourseIfCreatedMeanwhile(
    certificationCourseRepository,
    userId,
    sessionId,
    domainTransaction
  );
  if (certificationCourseCreatedMeanwhile) {
    return {
      created: false,
      certificationCourse: certificationCourseCreatedMeanwhile,
    };
  }

  const certificationCenter = await certificationCenterRepository.getBySessionId(sessionId);

  const complementaryCertificationIds = [];

  const complementaryCertifications = await complementaryCertificationRepository.findAll();

  if (
    certificationCenter.isHabilitatedClea &&
    (!featureToggles.isComplementaryCertificationSubscriptionEnabled || certificationCandidate.isGrantedCleA())
  ) {
    if (await certificationBadgesService.hasStillValidCleaBadgeAcquisition({ userId })) {
      const cleAComplementaryCertification = complementaryCertifications.find((comp: any) => comp.name === CLEA);
      if (cleAComplementaryCertification) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        complementaryCertificationIds.push(cleAComplementaryCertification.id);
      }
    }
  }

  const highestCertifiableBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId,
    domainTransaction,
  });

  if (
    certificationCenter.isHabilitatedPixPlusDroit &&
    (!featureToggles.isComplementaryCertificationSubscriptionEnabled || certificationCandidate.isGrantedPixPlusDroit())
  ) {
    const pixDroitBadgeAcquisition = highestCertifiableBadgeAcquisitions.find((badgeAcquisition: any) => badgeAcquisition.isPixDroit()
    );
    if (pixDroitBadgeAcquisition) {
      const pixDroitComplementaryCertification = complementaryCertifications.find(
        (comp: any) => comp.name === PIX_PLUS_DROIT
      );
      if (pixDroitComplementaryCertification) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        complementaryCertificationIds.push(pixDroitComplementaryCertification.id);
      }

      const certificationChallengesForPixDroit =
        await certificationChallengesService.pickCertificationChallengesForPixPlus(
          pixDroitBadgeAcquisition.badge,
          userId,
          locale
        );
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      challengesForCertification.push(...certificationChallengesForPixDroit);
    }
  }

  const pixEduBadgeAcquisition = highestCertifiableBadgeAcquisitions.find((badgeAcquisition: any) => badgeAcquisition.isPixEdu()
  );
  if (pixEduBadgeAcquisition) {
    const certificationChallengesForPixEdu = await certificationChallengesService.pickCertificationChallengesForPixPlus(
      pixEduBadgeAcquisition.badge,
      userId,
      locale
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    challengesForCertification.push(...certificationChallengesForPixEdu);
  }

  return _createCertificationCourse({
    certificationCandidate,
    certificationCourseRepository,
    assessmentRepository,
    complementaryCertificationRepository,
    userId,
    certificationChallenges: challengesForCertification,
    domainTransaction,
    verifyCertificateCodeService,
    complementaryCertificationIds,
  });
}

async function _getCertificationCourseIfCreatedMeanwhile(
  certificationCourseRepository: any,
  userId: any,
  sessionId: any,
  domainTransaction: any
) {
  return certificationCourseRepository.findOneCertificationCourseByUserIdAndSessionId({
    userId,
    sessionId,
    domainTransaction,
  });
}

async function _createPixCertification(placementProfileService: any, certificationChallengesService: any, userId: any, locale: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate: new Date() });

  if (!placementProfile.isCertifiable()) {
    throw new UserNotAuthorizedToCertifyError();
  }

  return certificationChallengesService.pickCertificationChallenges(placementProfile, locale);
}

async function _createCertificationCourse({
  certificationCandidate,
  certificationCourseRepository,
  assessmentRepository,
  verifyCertificateCodeService,
  userId,
  certificationChallenges,
  complementaryCertificationIds,
  domainTransaction
}: any) {
  const verificationCode = await verifyCertificateCodeService.generateCertificateVerificationCode();
  const complementaryCertificationCourses = complementaryCertificationIds.map(
    ComplementaryCertificationCourse.fromComplementaryCertificationId
  );
  const newCertificationCourse = CertificationCourse.from({
    certificationCandidate,
    challenges: certificationChallenges,
    maxReachableLevelOnCertificationDate: features.maxReachableLevel,
    complementaryCertificationCourses,
    verificationCode,
  });

  const savedCertificationCourse = await certificationCourseRepository.save({
    certificationCourse: newCertificationCourse,
    domainTransaction,
  });

  const newAssessment = Assessment.createForCertificationCourse({
    userId,
    certificationCourseId: savedCertificationCourse.getId(),
  });
  const savedAssessment = await assessmentRepository.save({ assessment: newAssessment, domainTransaction });

  const certificationCourse = savedCertificationCourse.withAssessment(savedAssessment);

  // FIXME : return CertificationCourseCreated or CertificationCourseRetrieved with only needed fields
  return {
    created: true,
    certificationCourse,
  };
}
