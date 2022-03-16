// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const solutionServiceQROCMInd = require('../services/solution-service-qrocm-ind');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('./Validation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('./Validator');

/**
 * Traduction: Vérificateur de réponse pour un QROCM Ind
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
class ValidatorQROCMInd extends Validator {
  solution: any;
  constructor({
    solution
  }: any = {}) {
    super({ solution });
  }

  assess({
    answer
  }: any) {
    const resultObject = solutionServiceQROCMInd.match({ answerValue: answer.value, solution: this.solution });

    return new Validation({
      result: resultObject.result,
      resultDetails: resultObject.resultDetails,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ValidatorQROCMInd;
