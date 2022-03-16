// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findPaginatedCampaignParticipantsActivities({
  userId,
  campaignId,
  page,
  filters,
  campaignRepository,
  campaignParticipantActivityRepository
}: any) {
  await _checkUserAccessToCampaign(campaignId, userId, campaignRepository);

  return campaignParticipantActivityRepository.findPaginatedByCampaignId({ page, campaignId, filters });
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkUserAccessToCampaign(campaignId: any, userId: any, campaignRepository: any) {
  const hasAccess = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);
  if (!hasAccess) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to an organization that owns the campaign');
  }
}
