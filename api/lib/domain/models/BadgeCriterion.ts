// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
class BadgeCriterion {
  badgeId: any;
  id: any;
  scope: any;
  skillSetIds: any;
  threshold: any;
  constructor({
    id,
    scope,
    threshold,
    skillSetIds,
    badgeId
  }: any = {}) {
    this.id = id;
    this.scope = scope;
    this.threshold = threshold;
    this.skillSetIds = skillSetIds;
    this.badgeId = badgeId;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'SCOPES' does not exist on type 'typeof B... Remove this comment to see the full error message
BadgeCriterion.SCOPES = {
  CAMPAIGN_PARTICIPATION: 'CampaignParticipation',
  SKILL_SET: 'SkillSet',
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = BadgeCriterion;
