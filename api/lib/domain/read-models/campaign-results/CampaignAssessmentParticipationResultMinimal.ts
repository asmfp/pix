// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipationResultMinimal {
  badges: any;
  campaignParticipationId: any;
  firstName: any;
  lastName: any;
  masteryRate: any;
  participantExternalId: any;
  constructor({
    campaignParticipationId,
    firstName,
    lastName,
    participantExternalId,
    masteryRate,
    badges = []
  }: any = {}) {
    this.campaignParticipationId = campaignParticipationId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantExternalId = participantExternalId;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;
    this.badges = badges;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipationResultMinimal;
