// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const PROGRESSION_ID_PREFIX = 'progression-';

const ONE_HUNDRED_PERCENT = 1;

/*
 * Traduction : Profil d'avancement
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Progressio... Remove this comment to see the full error message
class Progression {
  id: any;
  isProfileCompleted: any;
  knowledgeElements: any;
  targetedKnowledgeElements: any;
  targetedSkills: any;
  targetedSkillsIds: any;
  constructor({
    id,
    targetedSkills = [],
    knowledgeElements = [],
    isProfileCompleted = false
  }: any) {
    this.id = id;
    this.knowledgeElements = knowledgeElements;
    this.targetedSkills = targetedSkills;
    this.targetedSkillsIds = _.map(targetedSkills, 'id');
    this.targetedKnowledgeElements = _.filter(knowledgeElements, (ke: any) => _.includes(this.targetedSkillsIds, ke.skillId)
    );
    this.isProfileCompleted = isProfileCompleted;
  }

  _getTargetedSkillsAlreadyTestedCount() {
    return this.targetedKnowledgeElements.length;
  }

  _getTargetedSkillsCount() {
    return this.targetedSkillsIds.length;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get completionRate() {
    return this.isProfileCompleted
      ? ONE_HUNDRED_PERCENT
      : this._getTargetedSkillsAlreadyTestedCount() / this._getTargetedSkillsCount();
  }

  static generateIdFromAssessmentId(assessmentId: any) {
    return `${PROGRESSION_ID_PREFIX}${assessmentId}`;
  }

  static getAssessmentIdFromId(progressionId: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    return parseInt(progressionId.replace(PROGRESSION_ID_PREFIX, ''), 10);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Progression;
