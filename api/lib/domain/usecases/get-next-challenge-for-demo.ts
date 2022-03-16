// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function getNextChallengeForDemo({
  assessment,
  answerRepository,
  challengeRepository,
  courseRepository
}: any) {
  const courseId = assessment.courseId;

  const logContext = {
    zone: 'usecase.getNextChallengeForDemo',
    type: 'usecase',
    assessmentId: assessment.id,
    courseId,
  };
  logger.trace(logContext, 'looking for next challenge in DEMO assessment');

  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return Promise.all([courseRepository.get(courseId), answerRepository.findByAssessment(assessment.id)])
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'course' implicitly has an 'any' t... Remove this comment to see the full error message
    .then(([course, answers]) => {
      logContext.courseId = course.id;
      logger.trace(logContext, 'found course, selecting challenge');
      return _selectNextChallengeId(course, answers);
    })
    .then((nextChallengeId: any) => {
      if (nextChallengeId) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'nextChallengeId' does not exist on type ... Remove this comment to see the full error message
        logContext.nextChallengeId = nextChallengeId;
        logger.trace(logContext, 'found next challenge');
        return nextChallengeId;
      }

      logger.trace(logContext, 'no next challenge. Assessment ended');
      throw new AssessmentEndedError();
    })
    .then(challengeRepository.get);
};

function _selectNextChallengeId(course: any, answers: any) {
  const courseChallengeIds = course.challenges;
  const answeredChallengeIds = _.map(answers, 'challengeId');

  return _(courseChallengeIds).difference(answeredChallengeIds).first();
}
