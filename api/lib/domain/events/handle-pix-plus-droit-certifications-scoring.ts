// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
const PixPlusDroitCertificationScoring = require('../models/PixPlusDroitCertificationScoring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../models/ReproducibilityRate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerColl... Remove this comment to see the full error message
const AnswerCollectionForScoring = require('../models/AnswerCollectionForScoring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const { PIX_PLUS_DROIT } = require('../models/ComplementaryCertification');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'featureTog... Remove this comment to see the full error message
const { featureToggles } = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF } = require('../models/Badge').keys;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [CertificationScoringCompleted, CertificationRescoringCompleted];

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _isAllowedToBeScored({
  certifiableBadgeKey,
  certificationCourseId,
  complementaryCertificationCourseRepository
}: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  if (![PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF].includes(certifiableBadgeKey)) {
    return false;
  }

  if (featureToggles.isComplementaryCertificationSubscriptionEnabled) {
    return await complementaryCertificationCourseRepository.hasComplementaryCertification({
      certificationCourseId,
      complementaryCertificationName: PIX_PLUS_DROIT,
    });
  }

  return true;
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _allowedToBeScoredBadgeKeys({
  certifiableBadgeKeys,
  certificationCourseId,
  complementaryCertificationCourseRepository
}: any) {
  return bluebird.filter(certifiableBadgeKeys, async (certifiableBadgeKey: any) => _isAllowedToBeScored({
    certifiableBadgeKey,
    certificationCourseId,
    complementaryCertificationCourseRepository,
  })
  );
}

async function handlePixPlusDroitCertificationsScoring({
  event,
  assessmentResultRepository,
  certificationAssessmentRepository,
  partnerCertificationScoringRepository,
  complementaryCertificationCourseRepository
}: any) {
  checkEventTypes(event, eventTypes);
  const certificationCourseId = event.certificationCourseId;
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });
  const certifiableBadgeKeys = certificationAssessment.listCertifiableBadgePixPlusKeysTaken();
  const allowedToBeScoredBadgeKeys = await _allowedToBeScoredBadgeKeys({
    certifiableBadgeKeys,
    certificationCourseId,
    complementaryCertificationCourseRepository,
  });
  for (const certifiableBadgeKey of allowedToBeScoredBadgeKeys) {
    const { certificationChallenges: pixPlusChallenges, certificationAnswers: pixPlusAnswers } =
      certificationAssessment.findAnswersAndChallengesForCertifiableBadgeKey(certifiableBadgeKey);
    const assessmentResult = await assessmentResultRepository.getByCertificationCourseId({ certificationCourseId });
    const pixPlusDroitCertificationScoring = _buildPixPlusDroitCertificationScoring(
      certificationCourseId,
      pixPlusChallenges,
      pixPlusAnswers,
      certifiableBadgeKey,
      assessmentResult
    );
    await partnerCertificationScoringRepository.save({ partnerCertificationScoring: pixPlusDroitCertificationScoring });
  }
}

function _buildPixPlusDroitCertificationScoring(
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

  return new PixPlusDroitCertificationScoring({
    certificationCourseId,
    reproducibilityRate,
    certifiableBadgeKey,
    hasAcquiredPixCertification: assessmentResult.isValidated(),
  });
}

handlePixPlusDroitCertificationsScoring.eventTypes = eventTypes;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handlePixPlusDroitCertificationsScoring;
