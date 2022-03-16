/**
 * Traduction: Élément de correction portant sur la conformité d'une réponse
 * Context:    Objet existant dans le cadre de la correction d'une réponse pendant le fonctionnement
 *             interne de l'algorithme.
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Validation... Remove this comment to see the full error message
class Validation {
  result: any;
  resultDetails: any;
  constructor({
    result,
    resultDetails
  }: any = {}) {
    this.result = result;
    this.resultDetails = resultDetails;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Validation;
