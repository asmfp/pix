// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgeRepository = require('../../infrastructure/repositories/badge-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../infrastructure/repositories/target-profile-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgeCriteriaService = require('../../domain/services/badge-criteria-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF, PIX_DROIT_EXPERT_CERTIF, PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2 } =
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../../domain/models/Badge').keys;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixEduBadg... Remove this comment to see the full error message
const PixEduBadgeAcquisitionOrderer = require('../../domain/models/PixEduBadgeAcquisitionOrderer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findStillValidBadgeAcquisitions({
    userId,
    domainTransaction
  }: any) {
    const certifiableBadgeAcquisitions = await badgeAcquisitionRepository.findCertifiable({
      userId,
      domainTransaction,
    });
    const highestCertifiableBadgeAcquisitions = _keepHighestBadgeWithinPlusCertifications(certifiableBadgeAcquisitions);
    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId, domainTransaction });

    const badgeAcquisitions = await bluebird.mapSeries(
      highestCertifiableBadgeAcquisitions,
      async (badgeAcquisition: any) => {
        const badge = badgeAcquisition.badge;
        const targetProfile = await targetProfileRepository.get(badge.targetProfileId, domainTransaction);
        const isBadgeValid = badgeCriteriaService.areBadgeCriteriaFulfilled({
          knowledgeElements,
          targetProfile,
          badge,
        });
        return isBadgeValid ? badgeAcquisition : null;
      }
    );

    return _.compact(badgeAcquisitions);
  },

  async hasStillValidCleaBadgeAcquisition({
    userId
  }: any) {
    let cleaBadgeKey = PIX_EMPLOI_CLEA;
    const hasAcquiredCleaBadgeV1 = await badgeAcquisitionRepository.hasAcquiredBadge({
      badgeKey: PIX_EMPLOI_CLEA,
      userId,
    });
    if (!hasAcquiredCleaBadgeV1) {
      cleaBadgeKey = PIX_EMPLOI_CLEA_V2;
      const hasAcquiredCleaBadgeV2 = await badgeAcquisitionRepository.hasAcquiredBadge({
        badgeKey: PIX_EMPLOI_CLEA_V2,
        userId,
      });
      if (!hasAcquiredCleaBadgeV2) return false;
    }

    const badge = await badgeRepository.getByKey(cleaBadgeKey);
    const targetProfile = await targetProfileRepository.get(badge.targetProfileId);
    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId });

    return badgeCriteriaService.areBadgeCriteriaFulfilled({
      knowledgeElements,
      targetProfile,
      badge,
    });
  },
};

function _keepHighestBadgeWithinPlusCertifications(certifiableBadgeAcquisitions: any) {
  const highestBadgeWithinDroit = _keepHighestBadgeWithinDroitCertification(certifiableBadgeAcquisitions);
  return _keepHighestBadgeWithinEduCertification(highestBadgeWithinDroit);
}

function _keepHighestBadgeWithinDroitCertification(certifiableBadgeAcquisitions: any) {
  const [pixDroitBadgeAcquisitions, nonPixDroitBadgeAcquisitions] = _.partition(
    certifiableBadgeAcquisitions,
    (badgeAcquisition: any) => badgeAcquisition.isPixDroit()
  );
  if (pixDroitBadgeAcquisitions.length === 0) return nonPixDroitBadgeAcquisitions;
  const expertBadgeAcquisition = _.find(certifiableBadgeAcquisitions, { badgeKey: PIX_DROIT_EXPERT_CERTIF });
  const maitreBadgeAcquisition = _.find(certifiableBadgeAcquisitions, { badgeKey: PIX_DROIT_MAITRE_CERTIF });
  return [...nonPixDroitBadgeAcquisitions, expertBadgeAcquisition || maitreBadgeAcquisition];
}

function _keepHighestBadgeWithinEduCertification(certifiableBadgeAcquisitions: any) {
  const [pixEduBadgeAcquisitions, nonPixEduBadgeAcquisitions] = _.partition(
    certifiableBadgeAcquisitions,
    (badgeAcquisition: any) => badgeAcquisition.isPixEdu()
  );
  if (pixEduBadgeAcquisitions.length === 0) return nonPixEduBadgeAcquisitions;
  const pixEduBadgeAcquisitionOrderer = new PixEduBadgeAcquisitionOrderer({
    badgesAcquisitions: pixEduBadgeAcquisitions,
  });
  return [...nonPixEduBadgeAcquisitions, pixEduBadgeAcquisitionOrderer.getHighestBadge()];
}
