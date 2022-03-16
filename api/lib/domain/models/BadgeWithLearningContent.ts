// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeWithL... Remove this comment to see the full error message
class BadgeWithLearningContent {
  badge: any;
  skills: any;
  tubes: any;
  constructor({
    badge,
    skills,
    tubes
  }: any = {}) {
    this.badge = badge;
    this.skills = skills;
    this.tubes = tubes;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = BadgeWithLearningContent;
