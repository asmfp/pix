// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAnswer({
  answerId,
  userId,
  answerRepository,
  assessmentRepository
}: any = {}) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const integerAnswerId = parseInt(answerId);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
  if (!Number.isFinite(integerAnswerId)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Not found answer for ID ${answerId}`);
  }
  const answer = await answerRepository.get(integerAnswerId);
  const ownedByUser = await assessmentRepository.ownedByUser({ id: answer.assessmentId, userId });
  if (!ownedByUser) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Not found answer for ID ${integerAnswerId}`);
  }
  return answer;
};
