// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('./Badge.js');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationBadge extends Badge {
  isAcquired: any;
  skillSetResults: any;
  constructor({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isAcquired,
    isCertifiable = false,
    badgeCriteria = [],
    skillSets = [],
    skillSetResults = [],
    targetProfileId
  }: any = {}) {
    super({
      id,
      key,
      altMessage,
      imageUrl,
      message,
      title,
      isCertifiable,
      badgeCriteria,
      skillSets,
      targetProfileId,
    });
    this.skillSetResults = skillSetResults;
    this.isAcquired = isAcquired;
  }

  static buildFrom({
    badge,
    skillSetResults,
    isAcquired
  }: any) {
    return new CampaignParticipationBadge({
      ...badge,
      skillSetResults,
      isAcquired,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationBadge;
