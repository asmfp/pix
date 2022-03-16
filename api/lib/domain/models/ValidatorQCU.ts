// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const solutionServiceQCU = require('../services/solution-service-qcu');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
const Validation = require('./Validation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('./Validator');

/**
 * Traduction: Vérificateur de réponse pour un QCU
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
class ValidatorQCU extends Validator {
  solution: any;
  constructor({
    solution
  }: any = {}) {
    super({ solution });
  }

  assess({
    answer
  }: any) {
    const result = solutionServiceQCU.match(answer.value, this.solution.value);

    return new Validation({
      result,
      resultDetails: null,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ValidatorQCU;
