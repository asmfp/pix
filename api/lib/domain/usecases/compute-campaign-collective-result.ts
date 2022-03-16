// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function computeCampaignCollectiveResult({
  userId,
  campaignId,
  campaignRepository,
  campaignCollectiveResultRepository,
  targetProfileWithLearningContentRepository,
  locale
}: any = {}) {
  const hasUserAccessToResult = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);

  if (!hasUserAccessToResult) {
    throw new UserNotAuthorizedToAccessEntityError('User does not have access to this campaign');
  }

  const targetProfileWithLearningContent = await targetProfileWithLearningContentRepository.getByCampaignId({
    campaignId,
    locale,
  });
  return campaignCollectiveResultRepository.getCampaignCollectiveResult(campaignId, targetProfileWithLearningContent);
};
