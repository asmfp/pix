// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationResultsShared {
  campaignParticipationId: any;
  constructor({
    campaignParticipationId
  }: any = {}) {
    this.campaignParticipationId = campaignParticipationId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationResultsShared;
