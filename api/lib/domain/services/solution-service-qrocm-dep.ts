// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsYaml'.
const jsYaml = require('js-yaml');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'utils'.
const utils = require('./solution-service-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'deactivati... Remove this comment to see the full error message
const deactivationsService = require('./deactivations-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'applyPreTr... Remove this comment to see the full error message
const { applyPreTreatments, applyTreatments } = require('./validation-treatments');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'YamlParsin... Remove this comment to see the full error message
const { YamlParsingError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../models/AnswerStatus');

function _applyTreatmentsToSolutions(solutions: any, deactivations: any) {
  return _.mapValues(solutions, (validSolutions: any) => {
    return _.map(validSolutions, (validSolution: any) => {
      const pretreatedSolution = validSolution.toString();
      const allTreatments = ['t1', 't2', 't3'];
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
      const enabledTreatments = allTreatments.filter((treatment: any) => !deactivations[treatment]);

      return applyTreatments(pretreatedSolution, enabledTreatments);
    });
  });
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _applyTreatmentsToAnswers(answers: any) {
  return _.mapValues(answers, _.toString);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _compareAnswersAndSolutions(answers: any, solutions: any) {
  const validations = {};

  _.each(answers, (answer: any, index: any) => {
    const indexation = answer + '_' + index;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const solutionKeys = Object.keys(solutions);
    _.each(solutionKeys, (solutionKey: any) => {
      const solutionVariants = solutions[solutionKey];

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (_.isUndefined(validations[indexation])) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        validations[indexation] = [];
      }

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      validations[indexation].push(utils.treatmentT1T2T3(answer, solutionVariants));
    });
  });
  return validations;
}

function _numberOfGoodAnswers(fullValidations: any, deactivations: any) {
  const allGoodAnswers = _goodAnswers(fullValidations, deactivations);
  const uniqGoodAnswers = _.uniqBy(allGoodAnswers, 'adminAnswers');
  return uniqGoodAnswers.length;
}

function _goodAnswers(fullValidations: any, deactivations: any) {
  return _.chain(fullValidations)
    .map((fullValidation: any) => {
      return _goodAnswer(fullValidation, deactivations);
    })
    .filter((e: any) => e !== null)
    .value();
}

// the lowest t1t2t3 ratio is below 0.25
function _goodAnswer(allValidations: any, deactivations: any) {
  const bestAnswerSoFar = _.minBy(allValidations, (oneValidation: any) => oneValidation.t1t2t3Ratio);
  if (deactivationsService.isDefault(deactivations)) {
    return bestAnswerSoFar.t1t2t3Ratio <= 0.25 ? bestAnswerSoFar : null;
  } else if (deactivationsService.hasOnlyT1(deactivations)) {
    return bestAnswerSoFar.t2t3Ratio <= 0.25 ? bestAnswerSoFar : null;
  } else if (deactivationsService.hasOnlyT2(deactivations)) {
    return bestAnswerSoFar.t1t3Ratio <= 0.25 ? bestAnswerSoFar : null;
  } else if (deactivationsService.hasOnlyT3(deactivations)) {
    return _.includes(bestAnswerSoFar.adminAnswers, bestAnswerSoFar.t1t2) ? bestAnswerSoFar : null;
  } else if (deactivationsService.hasOnlyT1T2(deactivations)) {
    return bestAnswerSoFar.t3Ratio <= 0.25 ? bestAnswerSoFar : null;
  } else if (deactivationsService.hasOnlyT1T3(deactivations)) {
    return _.includes(bestAnswerSoFar.adminAnswers, bestAnswerSoFar.t2) ? bestAnswerSoFar : null;
  } else if (deactivationsService.hasT1T2T3(deactivations)) {
    return _.includes(bestAnswerSoFar.adminAnswers, bestAnswerSoFar.userAnswer) ? bestAnswerSoFar : null;
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _formatResult(scoring: any, validations: any, deactivations: any) {
  let result = AnswerStatus.OK;

  const numberOfGoodAnswers = _numberOfGoodAnswers(validations, deactivations);

  if (_.isEmpty(scoring) && numberOfGoodAnswers !== _.size(validations)) {
    result = AnswerStatus.KO;
  } else if (_.isEmpty(scoring) && numberOfGoodAnswers === _.size(validations)) {
    result = AnswerStatus.OK;
  } else {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const minGrade = _.min(Object.keys(scoring));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const maxGrade = _.max(Object.keys(scoring));

    if (numberOfGoodAnswers >= maxGrade) {
      result = AnswerStatus.OK;
    } else if (numberOfGoodAnswers >= minGrade) {
      result = AnswerStatus.PARTIALLY;
    } else {
      result = AnswerStatus.KO;
    }
  }
  return result;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  match({
    answerValue,
    solution
  }: any) {
    const yamlSolution = solution.value;
    const yamlScoring = solution.scoring;
    const deactivations = solution.deactivations;

    // Input checking
    if (!_.isString(answerValue) || _.isEmpty(answerValue) || !_.includes(yamlSolution, '\n')) {
      return AnswerStatus.KO;
    }

    // Pre-Treatments
    const preTreatedAnswers = applyPreTreatments(answerValue);

    // Convert Yaml to JS objects
    let answers, solutions, scoring;
    try {
      answers = jsYaml.load(preTreatedAnswers, { schema: jsYaml.FAILSAFE_SCHEMA });
      solutions = jsYaml.load(yamlSolution, { schema: jsYaml.FAILSAFE_SCHEMA });
      scoring = jsYaml.load(yamlScoring || '', { schema: jsYaml.FAILSAFE_SCHEMA });
    } catch (error) {
      throw new YamlParsingError();
    }

    // Treatments
    const treatedSolutions = _applyTreatmentsToSolutions(solutions, deactivations);
    const treatedAnswers = _applyTreatmentsToAnswers(answers);

    // Comparisons
    const fullValidations = _compareAnswersAndSolutions(treatedAnswers, treatedSolutions);

    return _formatResult(scoring, fullValidations, deactivations);
  },
};
