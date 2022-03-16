// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function ({
  campaignId,
  userId,
  campaignParticipationsStatsRepository,
  campaignRepository
}: any) {
  await _checkUserPermission(campaignId, userId, campaignRepository);
  return campaignParticipationsStatsRepository.countParticipationsByMasteryRate({ campaignId });
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkUserPermission(campaignId: any, userId: any, campaignRepository: any) {
  const hasAccess = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);

  if (!hasAccess) {
    throw new UserNotAuthorizedToAccessEntityError();
  }
}
