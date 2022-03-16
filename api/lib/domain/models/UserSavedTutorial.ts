// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
class UserSavedTutorial {
  id: any;
  skillId: any;
  tutorialId: any;
  userId: any;
  constructor({
    id,
    userId,
    tutorialId,
    skillId
  }: any = {}) {
    this.id = id;
    this.userId = userId;
    this.tutorialId = tutorialId;
    this.skillId = skillId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserSavedTutorial;
