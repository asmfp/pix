// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SharedProf... Remove this comment to see the full error message
class SharedProfileForCampaign {
  canRetry: any;
  id: any;
  pixScore: any;
  scorecards: any;
  sharedAt: any;
  constructor({
    id,
    sharedAt,
    pixScore,
    campaignAllowsRetry,
    isRegistrationActive,
    scorecards = []
  }: any) {
    this.id = id;
    this.sharedAt = sharedAt;
    this.scorecards = scorecards;
    this.pixScore = pixScore || 0;
    this.canRetry = this._computeCanRetry(campaignAllowsRetry, sharedAt, isRegistrationActive);
  }

  _computeCanRetry(campaignAllowsRetry: any, sharedAt: any, isRegistrationActive: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return campaignAllowsRetry && Boolean(sharedAt) && isRegistrationActive;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SharedProfileForCampaign;
