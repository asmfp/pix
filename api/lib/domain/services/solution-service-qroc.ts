// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'utils'.
const utils = require('./solution-service-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'deactivati... Remove this comment to see the full error message
const deactivationsService = require('../../../lib/domain/services/deactivations-service');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNumeric'... Remove this comment to see the full error message
  isNumeric,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'splitIntoW... Remove this comment to see the full error message
  splitIntoWordsAndRemoveBackspaces,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cleanStrin... Remove this comment to see the full error message
  cleanStringAndParseFloat,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../lib/infrastructure/utils/string-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'every'.
const { every, includes, isEmpty, isString, map } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'applyTreat... Remove this comment to see the full error message
const { applyTreatments, applyPreTreatments } = require('./validation-treatments');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../models/AnswerStatus');

const LEVENSHTEIN_DISTANCE_MAX_RATE = 0.25;
const CHALLENGE_NUMBER_FORMAT = 'nombre';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  match({
    answer,
    challengeFormat,
    solution
  }: any) {
    const solutionValue = solution.value;
    const deactivations = solution.deactivations;
    const qrocBlocksTypes = solution.qrocBlocksTypes || {};
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const shouldApplyTreatments = qrocBlocksTypes[Object.keys(qrocBlocksTypes)[0]] === 'select' ? false : true;

    const isIncorrectAnswerFormat = !isString(answer);
    const isIncorrectSolutionFormat = !isString(solutionValue) || isEmpty(solutionValue);

    if (isIncorrectAnswerFormat || isIncorrectSolutionFormat) {
      return AnswerStatus.KO;
    }

    const solutions = splitIntoWordsAndRemoveBackspaces(solutionValue);
    const areAllNumericSolutions = every(solutions, (solution: any) => {
      return isNumeric(solution);
    });

    if (isNumeric(answer) && areAllNumericSolutions && challengeFormat === CHALLENGE_NUMBER_FORMAT) {
      return _getAnswerStatusFromNumberMatching(answer, solutions);
    }

    return _getAnswerStatusFromStringMatching(answer, solutions, deactivations, shouldApplyTreatments);
  },
};

function _getAnswerStatusFromNumberMatching(answer: any, solutions: any) {
  const treatedSolutions = solutions.map((solution: any) => cleanStringAndParseFloat(solution));
  const treatedAnswer = cleanStringAndParseFloat(answer);
  const indexOfSolution = treatedSolutions.indexOf(treatedAnswer);
  const isAnswerMatchingSolution = indexOfSolution !== -1;
  if (isAnswerMatchingSolution) {
    return AnswerStatus.OK;
  }
  return AnswerStatus.KO;
}

function _getAnswerStatusFromStringMatching(answer: any, solutions: any, deactivations: any, shouldApplyTreatments: any) {
  const treatedAnswer = applyPreTreatments(answer);
  const treatedSolutions = _applyTreatmentsToSolutions(solutions, deactivations, shouldApplyTreatments);
  const validations = utils.treatmentT1T2T3(treatedAnswer, treatedSolutions, shouldApplyTreatments);
  return _getAnswerStatusAccordingToLevenshteinDistance(validations, deactivations);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _applyTreatmentsToSolutions(solutions: any, deactivations: any, shouldApplyTreatments: any) {
  return map(solutions, (solution: any) => {
    if (shouldApplyTreatments === false) {
      return solution;
    }

    const allTreatments = ['t1', 't2', 't3'];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
    const enabledTreatments = allTreatments.filter((treatment: any) => !deactivations[treatment]);
    return applyTreatments(solution, enabledTreatments);
  });
}

function _getAnswerStatusAccordingToLevenshteinDistance(validations: any, deactivations: any) {
  if (deactivationsService.isDefault(deactivations)) {
    if (validations.t1t2t3Ratio <= LEVENSHTEIN_DISTANCE_MAX_RATE) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasOnlyT1(deactivations)) {
    if (validations.t2t3Ratio <= LEVENSHTEIN_DISTANCE_MAX_RATE) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasOnlyT2(deactivations)) {
    if (validations.t1t3Ratio <= LEVENSHTEIN_DISTANCE_MAX_RATE) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasOnlyT3(deactivations)) {
    if (includes(validations.adminAnswers, validations.t1t2)) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasOnlyT1T2(deactivations)) {
    if (validations.t3Ratio <= LEVENSHTEIN_DISTANCE_MAX_RATE) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasOnlyT1T3(deactivations)) {
    if (includes(validations.adminAnswers, validations.t2)) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasOnlyT2T3(deactivations)) {
    if (includes(validations.adminAnswers, validations.t1)) {
      return AnswerStatus.OK;
    }
  } else if (deactivationsService.hasT1T2T3(deactivations)) {
    if (includes(validations.adminAnswers, validations.userAnswer)) {
      return AnswerStatus.OK;
    }
  }
  return AnswerStatus.KO;
}
