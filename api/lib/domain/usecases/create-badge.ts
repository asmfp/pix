// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingBad... Remove this comment to see the full error message
const { MissingBadgeCriterionError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createBadge({
  targetProfileId,
  badgeCreation,
  badgeRepository,
  badgeCriteriaRepository,
  targetProfileRepository,
  skillSetRepository
}: any) {
  const { campaignThreshold, skillSetThreshold, skillSetName, skillSetSkillsIds, ...badge } = badgeCreation;

  return DomainTransaction.execute(async (domainTransaction: any) => {
    await targetProfileRepository.get(targetProfileId, domainTransaction);
    await badgeRepository.isKeyAvailable(badge.key, domainTransaction);

    const isCampaignThresholdValid = campaignThreshold || campaignThreshold === 0;

    if (!isCampaignThresholdValid && !skillSetThreshold) {
      throw new MissingBadgeCriterionError();
    }

    const savedBadge = await badgeRepository.save({ ...badge, targetProfileId }, domainTransaction);

    if (isCampaignThresholdValid) {
      await badgeCriteriaRepository.save(
        {
          badgeCriterion: {
            badgeId: savedBadge.id,
            threshold: campaignThreshold,
            scope: 'CampaignParticipation',
          },
        },
        domainTransaction
      );
    }

    if (skillSetThreshold) {
      await targetProfileRepository.hasSkills({ targetProfileId, skillIds: skillSetSkillsIds }, domainTransaction);

      const { id: skillSetId } = await skillSetRepository.save(
        {
          skillSet: {
            badgeId: savedBadge.id,
            name: skillSetName,
            skillIds: skillSetSkillsIds,
          },
        },
        domainTransaction
      );

      await badgeCriteriaRepository.save(
        {
          badgeCriterion: {
            badgeId: savedBadge.id,
            threshold: skillSetThreshold,
            scope: 'SkillSet',
            skillSetIds: [skillSetId],
          },
        },
        domainTransaction
      );
    }

    return savedBadge;
  });
};
