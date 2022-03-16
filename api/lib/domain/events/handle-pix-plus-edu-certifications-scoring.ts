// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixPlusEdu... Remove this comment to see the full error message
const PixPlusEduCertificationScoring = require('../models/PixPlusEduCertificationScoring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../models/ReproducibilityRate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerColl... Remove this comment to see the full error message
const AnswerCollectionForScoring = require('../models/AnswerCollectionForScoring');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/Badge').keys;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [CertificationScoringCompleted, CertificationRescoringCompleted];

async function _isAllowedToBeScored({
  certifiableBadgeKey
}: any) {
  return [
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  ].includes(certifiableBadgeKey);
}

async function _allowedToBeScoredBadgeKeys({
  certifiableBadgeKeys
}: any) {
  return bluebird.filter(certifiableBadgeKeys, async (certifiableBadgeKey: any) => _isAllowedToBeScored({
    certifiableBadgeKey,
  })
  );
}

async function handlePixPlusEduCertificationsScoring({
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  partnerCertificationScoringRepository
}: any) {
  checkEventTypes(event, eventTypes);
  const certificationCourseId = event.certificationCourseId;
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  const certifiableBadgeKeys = certificationAssessment.listCertifiableBadgePixPlusKeysTaken();
  const allowedToBeScoredBadgeKeys = await _allowedToBeScoredBadgeKeys({
    certifiableBadgeKeys,
  });
  for (const certifiableBadgeKey of allowedToBeScoredBadgeKeys) {
    const { certificationChallenges: pixPlusChallenges, certificationAnswers: pixPlusAnswers } =
      certificationAssessment.findAnswersAndChallengesForCertifiableBadgeKey(certifiableBadgeKey);
    const assessmentResult = await assessmentResultRepository.getByCertificationCourseId({ certificationCourseId });
    const pixPlusEduCertificationScoring = _buildPixPlusEduCertificationScoring(
      certificationCourseId,
      pixPlusChallenges,
      pixPlusAnswers,
      certifiableBadgeKey,
      assessmentResult
    );
    await partnerCertificationScoringRepository.save({ partnerCertificationScoring: pixPlusEduCertificationScoring });
  }
}

function _buildPixPlusEduCertificationScoring(
  certificationCourseId: any,
  challenges: any,
  answers: any,
  certifiableBadgeKey: any,
  assessmentResult: any
) {
  const answerCollection = AnswerCollectionForScoring.from({ answers, challenges });
  const reproducibilityRate = ReproducibilityRate.from({
    numberOfNonNeutralizedChallenges: answerCollection.numberOfNonNeutralizedChallenges(),
    numberOfCorrectAnswers: answerCollection.numberOfCorrectAnswers(),
  });
  return new PixPlusEduCertificationScoring({
    certificationCourseId,
    reproducibilityRate,
    certifiableBadgeKey,
    hasAcquiredPixCertification: assessmentResult.isValidated(),
  });
}

handlePixPlusEduCertificationsScoring.eventTypes = eventTypes;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handlePixPlusEduCertificationsScoring;
