// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdateCampaignError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function archiveCampaign({
  // Parameters
  campaignId,

  userId,

  // Repositories
  campaignRepository
}: any) {
  const isUserCampaignAdmin = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);
  if (!isUserCampaignAdmin) {
    throw new UserNotAuthorizedToUpdateCampaignError();
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  return campaignRepository.update({ id: campaignId, archivedAt: new Date() });
};
