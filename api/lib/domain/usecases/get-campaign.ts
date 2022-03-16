// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, UserNotAuthorizedToAccessEntityError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCampaign({
  campaignId,
  userId,
  badgeRepository,
  campaignRepository,
  campaignReportRepository,
  stageRepository
}: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const integerCampaignId = parseInt(campaignId);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
  if (!Number.isFinite(integerCampaignId)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Campaign not found for ID ${campaignId}`);
  }

  const userHasAccessToCampaign = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(
    campaignId,
    userId
  );
  if (!userHasAccessToCampaign) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to the organization that owns the campaign');
  }

  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [campaignReport, badges, stages, masteryRates] = await Promise.all([
    campaignReportRepository.get(integerCampaignId),
    badgeRepository.findByCampaignId(integerCampaignId),
    stageRepository.findByCampaignId(integerCampaignId),
    campaignReportRepository.findMasteryRates(integerCampaignId),
  ]);

  campaignReport.badges = badges;
  campaignReport.stages = stages;
  if (campaignReport.isAssessment) {
    campaignReport.computeAverageResult(masteryRates);
  }
  return campaignReport;
};
