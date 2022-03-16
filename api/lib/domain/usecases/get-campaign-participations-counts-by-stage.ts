// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError, NoStagesForCampaign } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCampaignParticipationsCountByStage({
  userId,
  campaignId,
  campaignRepository,
  campaignParticipationRepository,
  targetProfileWithLearningContentRepository
}: any) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to the organization that owns the campaign');
  }

  const targetProfile = await targetProfileWithLearningContentRepository.getByCampaignId({ campaignId });
  if (!targetProfile.hasReachableStages()) {
    throw new NoStagesForCampaign();
  }

  const stagesBoundaries = targetProfile.getStageThresholdBoundaries();
  const data = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

  return targetProfile.stages.map((stage: any) => ({
    id: stage.id,
    value: data[stage.id] || 0,
    title: stage.prescriberTitle,
    description: stage.prescriberDescription
  }));
};
