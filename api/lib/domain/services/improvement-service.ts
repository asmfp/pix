// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

function _keepKnowledgeElementsRecentOrValidated({
  currentUserKnowledgeElements,
  assessment,
  minimumDelayInDays
}: any) {
  const startedDateOfAssessment = assessment.createdAt;

  return currentUserKnowledgeElements.filter((knowledgeElement: any) => {
    const isNotOldEnoughToBeImproved =
      moment(startedDateOfAssessment).diff(knowledgeElement.createdAt, 'days', true) < minimumDelayInDays;
    return knowledgeElement.isValidated || isNotOldEnoughToBeImproved;
  });
}

function filterKnowledgeElementsIfImproving({
  knowledgeElements,
  assessment,
  isRetrying = false
}: any) {
  const minimumDelayInDays = isRetrying
    ? constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING
    : constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING;

  if (assessment.isImproving) {
    return _keepKnowledgeElementsRecentOrValidated({
      currentUserKnowledgeElements: knowledgeElements,
      assessment,
      minimumDelayInDays,
    });
  }
  return knowledgeElements;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  filterKnowledgeElementsIfImproving,
};
