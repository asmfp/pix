// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationResultsShared = require('../events/CampaignParticipationResultsShared');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function shareCampaignResult({
  userId,
  campaignParticipationId,
  campaignParticipationRepository,
  domainTransaction
}: any) {
  const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId, domainTransaction);

  _checkUserIsOwnerOfCampaignParticipation(campaignParticipation, userId);

  campaignParticipation.share();
  await campaignParticipationRepository.updateWithSnapshot(campaignParticipation, domainTransaction);

  return new CampaignParticipationResultsShared({
    campaignParticipationId: campaignParticipation.id,
  });
};

function _checkUserIsOwnerOfCampaignParticipation(campaignParticipation: any, userId: any) {
  if (campaignParticipation.userId !== userId) {
    throw new UserNotAuthorizedToAccessEntityError('User does not have an access to this campaign participation');
  }
}
