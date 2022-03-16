// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsYaml'.
const jsYaml = require('js-yaml');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'levenshtei... Remove this comment to see the full error message
const levenshtein = require('fast-levenshtein');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'applyPreTr... Remove this comment to see the full error message
const { applyPreTreatments, applyTreatments } = require('./validation-treatments');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'YamlParsin... Remove this comment to see the full error message
const { YamlParsingError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../models/AnswerStatus');

function _applyTreatmentsToSolutions(solutions: any, enabledTreatments: any, qrocBlocksTypes = {}) {
  return _.forEach(solutions, (solution: any, solutionKey: any) => {
    solution.forEach((variant: any, variantIndex: any) => {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (qrocBlocksTypes[solutionKey] === 'select') {
        solutions[solutionKey][variantIndex] = applyTreatments(variant, []);
      } else {
        solutions[solutionKey][variantIndex] = applyTreatments(variant, enabledTreatments);
      }
    });
  });
}

function _applyTreatmentsToAnswers(answers: any, enabledTreatments: any, qrocBlocksTypes = {}) {
  return _.forEach(answers, (answer: any, answerKey: any) => {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (qrocBlocksTypes[answerKey] === 'select') {
      answers[answerKey] = applyTreatments(answer, []);
    } else {
      answers[answerKey] = applyTreatments(answer, enabledTreatments);
    }
  });
}

function _areApproximatelyEqualAccordingToLevenshteinDistanceRatio(answer: any, solutionVariants: any) {
  let smallestLevenshteinDistance = answer.length;
  solutionVariants.forEach((variant: any) => {
    const levenshteinDistance = levenshtein.get(answer, variant);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    smallestLevenshteinDistance = Math.min(smallestLevenshteinDistance, levenshteinDistance);
  });
  const ratio = smallestLevenshteinDistance / answer.length;
  return ratio <= 0.25;
}

function _compareAnswersAndSolutions(answers: any, solutions: any, enabledTreatments: any, qrocBlocksTypes = {}) {
  const results = {};
  _.map(answers, (answer: any, answerKey: any) => {
    const solutionVariants = solutions[answerKey];
    if (!solutionVariants) {
      logger.warn(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        `[ERREUR CLE ANSWER] La clé ${answerKey} n'existe pas. Première clé de l'épreuve : ${Object.keys(solutions)[0]}`
      );
      throw new YamlParsingError();
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (enabledTreatments.includes('t3') && qrocBlocksTypes[answerKey] != 'select') {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      results[answerKey] = _areApproximatelyEqualAccordingToLevenshteinDistanceRatio(answer, solutionVariants);
    } else if (solutionVariants) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      results[answerKey] = solutionVariants.includes(answer);
    }
  });
  return results;
}

function _formatResult(resultDetails: any) {
  let result = AnswerStatus.OK;
  _.forEach(resultDetails, (resultDetail: any) => {
    if (!resultDetail) {
      result = AnswerStatus.KO;
    }
  });
  return result;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  _applyTreatmentsToSolutions,
  _applyTreatmentsToAnswers,
  _compareAnswersAndSolutions,
  _formatResult,

  match({
    answerValue,
    solution
  }: any) {
    const yamlSolution = solution.value;
    const enabledTreatments = solution.enabledTreatments;
    const qrocBlocksTypes = solution.qrocBlocksTypes || {};

    // Input checking
    if (!_.isString(answerValue) || _.isEmpty(yamlSolution) || !_.includes(yamlSolution, '\n')) {
      return { result: AnswerStatus.KO };
    }

    // Pre-treatments
    const preTreatedAnswers = applyPreTreatments(answerValue);
    const preTreatedSolutions = applyPreTreatments(yamlSolution);

    // Convert YAML to JSObject
    let answers, solutions;

    try {
      answers = jsYaml.load(preTreatedAnswers, { schema: jsYaml.FAILSAFE_SCHEMA });
      solutions = jsYaml.load(preTreatedSolutions, { schema: jsYaml.FAILSAFE_SCHEMA });
    } catch (error) {
      throw new YamlParsingError();
    }

    // Treatments
    const treatedSolutions = _applyTreatmentsToSolutions(solutions, enabledTreatments, qrocBlocksTypes);
    const treatedAnswers = _applyTreatmentsToAnswers(answers, enabledTreatments, qrocBlocksTypes);

    // Comparison
    const resultDetails = _compareAnswersAndSolutions(
      treatedAnswers,
      treatedSolutions,
      enabledTreatments,
      qrocBlocksTypes
    );

    // Restitution
    return {
      result: _formatResult(resultDetails),
      resultDetails: resultDetails,
    };
  },
};
