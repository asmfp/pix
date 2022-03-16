// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkEvent... Remove this comment to see the full error message
const { checkEventTypes } = require('./check-event-types');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('./CertificationScoringCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('./CertificationRescoringCompleted');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'featureTog... Remove this comment to see the full error message
const { featureToggles } = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA } = require('../models/ComplementaryCertification');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'eventTypes... Remove this comment to see the full error message
const eventTypes = [CertificationScoringCompleted, CertificationRescoringCompleted];

async function handleCleaCertificationScoring({
  event,
  partnerCertificationScoringRepository,
  badgeRepository,
  certificationCourseRepository,
  cleaCertificationResultRepository,
  certificationCenterRepository,
  knowledgeElementRepository,
  targetProfileRepository,
  badgeCriteriaService,
  complementaryCertificationCourseRepository
}: any) {
  checkEventTypes(event, eventTypes);
  const { certificationCourseId, userId, reproducibilityRate } = event;

  if (featureToggles.isComplementaryCertificationSubscriptionEnabled) {
    return _handleScoringAndRescoringWithToggleEnabled(
      complementaryCertificationCourseRepository,
      certificationCourseId,
      partnerCertificationScoringRepository,
      userId,
      reproducibilityRate
    );
  }

  const certificationCenter = await certificationCenterRepository.getByCertificationCourseId(certificationCourseId);
  if (!certificationCenter.isHabilitatedClea) {
    return;
  }

  if (event instanceof CertificationRescoringCompleted) {
    return _handleRescoringWithToggleDisabled(
      event,
      certificationCenterRepository,
      cleaCertificationResultRepository,
      partnerCertificationScoringRepository
    );
  }

  await _handleScoringWithToggleDisabled(
    partnerCertificationScoringRepository,
    certificationCourseId,
    userId,
    reproducibilityRate,
    certificationCourseRepository,
    event,
    badgeRepository,
    targetProfileRepository,
    knowledgeElementRepository,
    badgeCriteriaService
  );
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _verifyBadgeValidity(
  certificationCourseRepository: any,
  event: any,
  badgeRepository: any,
  cleaCertificationScoring: any,
  targetProfileRepository: any,
  knowledgeElementRepository: any,
  badgeCriteriaService: any
) {
  const beginningCertificationDate = await certificationCourseRepository.getCreationDate(event.certificationCourseId);

  const badge = await badgeRepository.getByKey(cleaCertificationScoring.partnerKey);
  const targetProfile = await targetProfileRepository.get(badge.targetProfileId);

  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({
    userId: event.userId,
    limitDate: beginningCertificationDate,
  });

  cleaCertificationScoring.setBadgeAcquisitionStillValid(
    badgeCriteriaService.areBadgeCriteriaFulfilled({
      knowledgeElements,
      targetProfile,
      badge,
    })
  );
}

async function _handleScoringAndRescoringWithToggleEnabled(
  complementaryCertificationCourseRepository: any,
  certificationCourseId: any,
  partnerCertificationScoringRepository: any,
  userId: any,
  reproducibilityRate: any
) {
  const hasRunCleA = await complementaryCertificationCourseRepository.hasComplementaryCertification({
    certificationCourseId,
    complementaryCertificationName: CLEA,
  });
  if (!hasRunCleA) {
    return;
  }

  const cleaCertificationScoring = await partnerCertificationScoringRepository.buildCleaCertificationScoring({
    certificationCourseId,
    userId,
    reproducibilityRate,
  });

  return partnerCertificationScoringRepository.save({ partnerCertificationScoring: cleaCertificationScoring });
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _handleRescoringWithToggleDisabled(
  event: any,
  certificationCenterRepository: any,
  cleaCertificationResultRepository: any,
  partnerCertificationScoringRepository: any
) {
  const { certificationCourseId } = event;

  const certificationCenter = await certificationCenterRepository.getByCertificationCourseId(certificationCourseId);
  if (!certificationCenter.isHabilitatedClea) {
    return;
  }
  const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });
  if (!cleaCertificationResult.isTaken()) {
    return;
  }

  const cleaCertificationScoring = await partnerCertificationScoringRepository.buildCleaCertificationScoring({
    certificationCourseId,
    userId: event.userId,
    reproducibilityRate: event.reproducibilityRate,
  });

  await partnerCertificationScoringRepository.save({ partnerCertificationScoring: cleaCertificationScoring });

  return;
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _handleScoringWithToggleDisabled(
  partnerCertificationScoringRepository: any,
  certificationCourseId: any,
  userId: any,
  reproducibilityRate: any,
  certificationCourseRepository: any,
  event: any,
  badgeRepository: any,
  targetProfileRepository: any,
  knowledgeElementRepository: any,
  badgeCriteriaService: any
) {
  const cleaCertificationScoring = await partnerCertificationScoringRepository.buildCleaCertificationScoring({
    certificationCourseId,
    userId,
    reproducibilityRate,
  });

  if (cleaCertificationScoring.hasAcquiredBadge) {
    await _verifyBadgeValidity(
      certificationCourseRepository,
      event,
      badgeRepository,
      cleaCertificationScoring,
      targetProfileRepository,
      knowledgeElementRepository,
      badgeCriteriaService
    );
  }

  if (cleaCertificationScoring.isEligible()) {
    await partnerCertificationScoringRepository.save({ partnerCertificationScoring: cleaCertificationScoring });
  }
}

handleCleaCertificationScoring.eventTypes = eventTypes;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = handleCleaCertificationScoring;
