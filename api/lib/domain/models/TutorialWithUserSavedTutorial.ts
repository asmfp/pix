// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tutorial'.
const Tutorial = require('./Tutorial');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TutorialWi... Remove this comment to see the full error message
class TutorialWithUserSavedTutorial extends Tutorial {
  userTutorial: any;
  constructor({
    userTutorial,
    ...tutorial
  }: any) {
    super(tutorial);
    this.userTutorial = userTutorial;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TutorialWithUserSavedTutorial;
