// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipation {
  badges: any;
  campaignId: any;
  campaignParticipationId: any;
  createdAt: any;
  firstName: any;
  isShared: any;
  lastName: any;
  masteryRate: any;
  participantExternalId: any;
  progression: any;
  sharedAt: any;
  userId: any;
  constructor({
    userId,
    firstName,
    lastName,
    campaignParticipationId,
    campaignId,
    participantExternalId,
    assessmentState,
    masteryRate,
    sharedAt,
    status,
    createdAt,
    targetedSkillsCount,
    testedSkillsCount,
    badges = []
  }: any) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.campaignParticipationId = campaignParticipationId;
    this.campaignId = campaignId;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.isShared = status === SHARED;
    this.createdAt = createdAt;
    this.progression = this._computeProgression(assessmentState, testedSkillsCount, targetedSkillsCount);
    this.badges = badges;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;
  }

  _computeProgression(assessmentState: any, testedSkillsCount: any, targetedSkillsCount: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    if (assessmentState === Assessment.states.COMPLETED) return 1;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    return Number((testedSkillsCount / targetedSkillsCount).toFixed(2));
  }

  setBadges(badges: any) {
    this.badges = badges;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipation;
