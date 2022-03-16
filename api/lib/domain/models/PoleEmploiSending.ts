const TYPES = {
  CAMPAIGN_PARTICIPATION_START: 'CAMPAIGN_PARTICIPATION_START',
  CAMPAIGN_PARTICIPATION_COMPLETION: 'CAMPAIGN_PARTICIPATION_COMPLETION',
  CAMPAIGN_PARTICIPATION_SHARING: 'CAMPAIGN_PARTICIPATION_SHARING',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
class PoleEmploiSending {
  campaignParticipationId: any;
  isSuccessful: any;
  payload: any;
  responseCode: any;
  type: any;
  constructor({
    campaignParticipationId,
    type,
    payload,
    isSuccessful,
    responseCode
  }: any) {
    this.campaignParticipationId = campaignParticipationId;
    this.type = type;
    this.isSuccessful = isSuccessful;
    this.responseCode = responseCode;
    this.payload = payload;
  }

  static buildForParticipationStarted({
    campaignParticipationId,
    payload,
    isSuccessful,
    responseCode
  }: any) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_START,
      payload,
      isSuccessful,
      responseCode,
    });
  }

  static buildForParticipationFinished({
    campaignParticipationId,
    payload,
    isSuccessful,
    responseCode
  }: any) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_COMPLETION,
      payload,
      isSuccessful,
      responseCode,
    });
  }

  static buildForParticipationShared({
    campaignParticipationId,
    payload,
    isSuccessful,
    responseCode
  }: any) {
    return new PoleEmploiSending({
      campaignParticipationId,
      type: TYPES.CAMPAIGN_PARTICIPATION_SHARING,
      payload,
      isSuccessful,
      responseCode,
    });
  }
}

PoleEmploiSending.TYPES = TYPES;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PoleEmploiSending;
