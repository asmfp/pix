// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
class UserSavedTutorialWithTutorial {
  id: any;
  skillId: any;
  tutorial: any;
  userId: any;
  constructor({
    id,
    userId,
    tutorial,
    skillId
  }: any = {}) {
    this.id = id;
    this.userId = userId;
    this.tutorial = tutorial;
    this.skillId = skillId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserSavedTutorialWithTutorial;
