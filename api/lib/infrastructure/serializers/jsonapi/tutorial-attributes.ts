// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationAttributes = require('./tutorial-evaluation-attributes');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialAttributes = require('./user-tutorial-attributes');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  ref: 'id',
  includes: true,
  attributes: ['id', 'duration', 'format', 'link', 'source', 'title', 'tutorialEvaluation', 'userTutorial'],
  tutorialEvaluation: tutorialEvaluationAttributes,
  userTutorial: userTutorialAttributes,
};
