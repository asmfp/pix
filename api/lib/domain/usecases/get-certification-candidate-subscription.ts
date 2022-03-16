// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CertificationCandidateSubscription = require('../read-models/CertificationCandidateSubscription');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../models/Badge');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function _hasStillValidPixPlusDroit(badgeAcquisitions: any) {
  return badgeAcquisitions.some(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'keys' does not exist on type 'typeof Bad... Remove this comment to see the full error message
    (badgeAcquisition: any) => badgeAcquisition.badgeKey === Badge.keys.PIX_DROIT_MAITRE_CERTIF ||
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'keys' does not exist on type 'typeof Bad... Remove this comment to see the full error message
    badgeAcquisition.badgeKey === Badge.keys.PIX_DROIT_EXPERT_CERTIF
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCertificationCandidateSubscription({
  certificationCandidateId,
  certificationBadgesService,
  certificationCandidateRepository
}: any) {
  const certificationCandidate = await certificationCandidateRepository.getWithComplementaryCertifications(
    certificationCandidateId
  );

  if (_.isEmpty(certificationCandidate.complementaryCertifications)) {
    return new CertificationCandidateSubscription({
      id: certificationCandidateId,
      sessionId: certificationCandidate.sessionId,
      eligibleSubscriptions: [],
      nonEligibleSubscriptions: [],
    });
  }

  const eligibleSubscriptions = [];
  const nonEligibleSubscriptions = [];
  for (const complementaryCertification of certificationCandidate.complementaryCertifications) {
    if (complementaryCertification.isPixPlusDroit()) {
      const stillValidCertifiableBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
        userId: certificationCandidate.userId,
      });
      if (_hasStillValidPixPlusDroit(stillValidCertifiableBadgeAcquisitions)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        eligibleSubscriptions.push(complementaryCertification);
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        nonEligibleSubscriptions.push(complementaryCertification);
      }
    }
    if (complementaryCertification.isClea()) {
      const hasStillValidCleaBadge = await certificationBadgesService.hasStillValidCleaBadgeAcquisition({
        userId: certificationCandidate.userId,
      });
      if (hasStillValidCleaBadge) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        eligibleSubscriptions.push(complementaryCertification);
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
        nonEligibleSubscriptions.push(complementaryCertification);
      }
    }
  }

  return new CertificationCandidateSubscription({
    id: certificationCandidateId,
    sessionId: certificationCandidate.sessionId,
    eligibleSubscriptions,
    nonEligibleSubscriptions,
  });
};
