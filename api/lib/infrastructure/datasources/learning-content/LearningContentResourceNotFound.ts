// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
class LearningContentResourceNotFound extends Error {
  constructor() {
    super();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = LearningContentResourceNotFound;
