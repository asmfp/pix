// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
const ChallengeType = Object.freeze({
  QCU: 'QCU',
  QCM: 'QCM',
  QROC: 'QROC',
  QROCM_IND: 'QROCM-ind',
  QROCM_DEP: 'QROCM-dep',
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeF... Remove this comment to see the full error message
class ChallengeForPixAutoAnswer {
  autoReply: any;
  id: any;
  solution: any;
  type: any;
  /**
   * Constructeur d'épreuve pour le bouton magique (pix-auto-answer)
   *
   * @param id
   * @param solution
   * @param type
   * @param autoReply
   */
  constructor({
    id,
    solution,
    type,
    autoReply
  }: any = {}) {
    this.id = id;
    this.solution = solution;
    this.type = type;
    this.autoReply = autoReply;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'Type' does not exist on type 'typeof Cha... Remove this comment to see the full error message
ChallengeForPixAutoAnswer.Type = ChallengeType;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ChallengeForPixAutoAnswer;
