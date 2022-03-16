// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Validator'... Remove this comment to see the full error message
const Validator = require('./Validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQCM = require('./ValidatorQCM');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQCU = require('./ValidatorQCU');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROC = require('./ValidatorQROC');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROCMDep = require('./ValidatorQROCMDep');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ValidatorQ... Remove this comment to see the full error message
const ValidatorQROCMInd = require('./ValidatorQROCMInd');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
const ChallengeType = Object.freeze({
  QCU: 'QCU',
  QCM: 'QCM',
  QROC: 'QROC',
  QROCM_IND: 'QROCM-ind',
  QROCM_DEP: 'QROCM-dep',
});

/**
 * Traduction: Épreuve
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
class Challenge {
  alternativeInstruction: any;
  answer: any;
  attachments: any;
  autoReply: any;
  competenceId: any;
  difficulty: any;
  discriminant: any;
  embedHeight: any;
  embedTitle: any;
  embedUrl: any;
  focused: any;
  format: any;
  genealogy: any;
  id: any;
  illustrationAlt: any;
  illustrationUrl: any;
  instruction: any;
  locales: any;
  proposals: any;
  responsive: any;
  skill: any;
  status: any;
  timer: any;
  type: any;
  validator: any;
  /**
   * Constructeur d'épreuve
   *
   * @param id
   * @param attachments
   * @param embedHeight
   * @param embedTitle
   * @param embedUrl
   * @param illustrationUrl
   * @param instruction
   * @param proposals
   * @param status
   * @param timer
   * @param type
   * @param answer ==> Il semblerait que answer ne serve plus.
   * @param skill
   * @param validator
   * @param competenceId
   * @param format
   * @param locales
   * @param autoReply
   * @param focused
   * @param discriminant
   * @param difficulty
   * @param responsive
   * @param genealogy
   */
  constructor({
    id,
    attachments,
    embedHeight,
    embedTitle,
    embedUrl,
    format,
    illustrationAlt,
    alternativeInstruction,
    illustrationUrl,
    instruction,
    proposals,
    status,
    timer,
    type,
    locales,
    autoReply,
    answer,
    skill,
    validator,
    competenceId,
    focused,
    discriminant,
    difficulty,
    responsive,
    genealogy
  }: any = {}) {
    this.id = id;
    this.answer = answer;
    this.attachments = attachments;
    this.embedHeight = embedHeight;
    this.embedTitle = embedTitle;
    this.embedUrl = embedUrl;
    this.format = format;
    this.illustrationAlt = illustrationAlt;
    this.illustrationUrl = illustrationUrl;
    this.instruction = instruction;
    this.proposals = proposals;
    this.timer = timer;
    this.status = status;
    this.type = type;
    this.locales = locales;
    this.autoReply = autoReply;
    this.alternativeInstruction = alternativeInstruction;
    this.skill = skill;
    this.validator = validator;
    this.competenceId = competenceId;
    this.focused = focused;
    this.discriminant = discriminant;
    this.difficulty = difficulty;
    this.responsive = responsive;
    this.genealogy = genealogy;
  }

  isTimed() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    return Number.isFinite(parseFloat(this.timer));
  }

  hasIllustration() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.illustrationUrl);
  }

  hasEmbed() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.embedUrl);
  }

  hasAtLeastOneAttachment() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    return Array.isArray(this.attachments) && this.attachments.length > 0;
  }

  static createValidatorForChallengeType({
    challengeType,
    solution
  }: any) {
    switch (challengeType) {
      case ChallengeType.QCU:
        return new ValidatorQCU({ solution });

      case ChallengeType.QCM:
        return new ValidatorQCM({ solution });

      case ChallengeType.QROC:
        return new ValidatorQROC({ solution });

      case ChallengeType.QROCM_IND:
        return new ValidatorQROCMInd({ solution });

      case ChallengeType.QROCM_DEP:
        return new ValidatorQROCMDep({ solution });

      default:
        return new Validator({ solution });
    }
  }

  static findBySkill({
    challenges,
    skill
  }: any) {
    return _.filter(challenges, (challenge: any) => challenge.skill?.id === skill.id);
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'Type' does not exist on type 'typeof Cha... Remove this comment to see the full error message
Challenge.Type = ChallengeType;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Challenge;
