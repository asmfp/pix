/**
 * Traduction: Correction
 * Context:    Objet existant dans le cadre de la correction d'une réponse pendant le fonctionnement
 *             interne de l'algorithme.
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Solution'.
class Solution {
  id: any;
  isT1Enabled: any;
  isT2Enabled: any;
  isT3Enabled: any;
  qrocBlocksTypes: any;
  scoring: any;
  type: any;
  value: any;
  /**
   *
   * @param id: id de la ligne Épreuve du référentiel dont est extraite l'information de la Solution
   * @param isT1Enabled: T1 - Espaces, casse & accents
   * @param isT2Enabled: T2 - Ponctuation
   * @param isT3Enabled: T3 - Distance d'édition
   * @param scoring: ??
   * @param type: type de l'épreuve
   * @param value: Bonne réponse attendue.
   *
   * Les traitements T1, T2 et T3 sont les traitements qu'il est possible d'utiliser pour valider une réponse.
   * Pour plus d'informations, ne pas hésiter à se reporter aux explications présentes dans pix-editor.
   */
  constructor({
    id,
    isT1Enabled = false,
    isT2Enabled = false,
    isT3Enabled = false,
    scoring,
    type,
    value,
    qrocBlocksTypes
  }: any = {}) {
    this.id = id;
    this.isT1Enabled = isT1Enabled;
    this.isT2Enabled = isT2Enabled;
    this.isT3Enabled = isT3Enabled;
    this.scoring = scoring;
    this.type = type;
    this.value = value;
    this.qrocBlocksTypes = qrocBlocksTypes;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get enabledTreatments() {
    const enabledTreatments = [];
    if (this.isT1Enabled) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      enabledTreatments.push('t1');
    }
    if (this.isT2Enabled) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      enabledTreatments.push('t2');
    }
    if (this.isT3Enabled) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      enabledTreatments.push('t3');
    }
    return enabledTreatments;
  }

  // TODO: delete when deactivation object is correctly deleted everywhere
  /**
   * @deprecated use the enabledTreatments property
   */
  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get deactivations() {
    return {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      t1: !this.enabledTreatments.includes('t1'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      t2: !this.enabledTreatments.includes('t2'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      t3: !this.enabledTreatments.includes('t3'),
    };
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Solution;
