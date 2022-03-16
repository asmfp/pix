// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findCompetenceEvaluationsByAssessment({
  userId,
  assessmentId,
  assessmentRepository,
  competenceEvaluationRepository
}: any) {
  if (!(await assessmentRepository.ownedByUser({ id: assessmentId, userId }))) {
    throw new UserNotAuthorizedToAccessEntityError('User does not have an access to this competence evaluation');
  }

  return competenceEvaluationRepository.findByAssessmentId(assessmentId);
};
