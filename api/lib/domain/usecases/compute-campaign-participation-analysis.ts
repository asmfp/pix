// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function computeCampaignParticipationAnalysis({
  userId,
  campaignParticipationId,
  campaignParticipationRepository,
  campaignRepository,
  campaignAnalysisRepository,
  targetProfileWithLearningContentRepository,
  tutorialRepository,
  locale
}: any = {}) {
  const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);
  const campaignId = campaignParticipation.campaignId;
  const hasUserAccessToResult = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);

  if (!hasUserAccessToResult) {
    throw new UserNotAuthorizedToAccessEntityError('User does not have access to this campaign');
  }

  if (!campaignParticipation.isShared) {
    return null;
  }

  const targetProfileWithLearningContent = await targetProfileWithLearningContentRepository.getByCampaignId({
    campaignId,
    locale,
  });
  const tutorials = await tutorialRepository.list({ locale });

  return campaignAnalysisRepository.getCampaignParticipationAnalysis(
    campaignId,
    campaignParticipation,
    targetProfileWithLearningContent,
    tutorials
  );
};
