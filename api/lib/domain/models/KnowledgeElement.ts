// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../models/Skill');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  VALIDATED: 'validated',
  INVALIDATED: 'invalidated',
  RESET: 'reset',
};

// Everytime a user answers a challenge, it gives an information about what he knows
// at a given point in time about a specific skill. This is represented by a 'direct'
// knowledge element. Depending on the success of the response, we can also infer more
// knowledge elements about him regarding other skills: these knowledge elements are thereby 'inferred'.
const sources = {
  DIRECT: 'direct',
  INFERRED: 'inferred',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
class KnowledgeElement {
  answerId: any;
  assessmentId: any;
  competenceId: any;
  createdAt: any;
  earnedPix: any;
  id: any;
  skillId: any;
  source: any;
  status: any;
  userId: any;
  constructor({
    id,
    createdAt,
    source,
    status,
    earnedPix,
    answerId,
    assessmentId,
    skillId,
    userId,
    competenceId
  }: any = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.source = source;
    this.status = status;
    this.earnedPix = earnedPix;
    this.answerId = answerId;
    this.assessmentId = assessmentId;
    this.skillId = skillId;
    this.userId = userId;
    this.competenceId = competenceId;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isValidated() {
    return this.status === statuses.VALIDATED;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isInvalidated() {
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
    return this.status === statuses.INVALIDATED;
  }

  isDirectlyValidated() {
    return this.status === statuses.VALIDATED && this.source === sources.DIRECT;
  }

  static createKnowledgeElementsForAnswer({
    answer,
    challenge,
    previouslyFailedSkills,
    previouslyValidatedSkills,
    targetSkills,
    userId
  }: any) {
    const directKnowledgeElement = _createDirectKnowledgeElement({
      answer,
      challenge,
      previouslyFailedSkills,
      previouslyValidatedSkills,
      targetSkills,
      userId,
    });

    return _enrichDirectKnowledgeElementWithInferredKnowledgeElements({
      answer,
      directKnowledgeElement,
      previouslyFailedSkills,
      previouslyValidatedSkills,
      targetSkills,
      userId,
    });
  }

  static computeDaysSinceLastKnowledgeElement(knowledgeElements: any) {
    const lastCreatedAt = _(knowledgeElements).map('createdAt').max();
    const precise = true;
    return moment().diff(lastCreatedAt, 'days', precise);
  }

  static findDirectlyValidatedFromGroups(knowledgeElementsByCompetence: any) {
    return _(knowledgeElementsByCompetence)
      .values()
      .flatten()
      .filter({ status: KnowledgeElement.StatusType.VALIDATED })
      .filter({ source: KnowledgeElement.SourceType.DIRECT })
      .value();
  }
}

KnowledgeElement.SourceType = sources;
KnowledgeElement.StatusType = statuses;

function _createDirectKnowledgeElement({
  answer,
  challenge,
  previouslyFailedSkills,
  previouslyValidatedSkills,
  targetSkills,
  userId
}: any) {
  // @ts-expect-error ts-migrate(2551) FIXME: Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
  const status = answer.isOk() ? statuses.VALIDATED : statuses.INVALIDATED;

  const filters = [
    _skillIsInTargetedSkills({ targetSkills }),
    _skillIsNotAlreadyAssessed({ previouslyFailedSkills, previouslyValidatedSkills }),
  ];
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'every' does not exist on type '{}'.
  if (filters.every((filter: any) => filter(challenge.skill))) {
    const source = sources.DIRECT;
    const skill = challenge.skill;
    return _createKnowledgeElement({ skill, source, status, answer, userId });
  }
}

function _skillIsInTargetedSkills({
  targetSkills
}: any) {
  return (skill: any) => !_(targetSkills).intersectionWith([skill], Skill.areEqualById).isEmpty();
}

function _skillIsNotAlreadyAssessed({
  previouslyFailedSkills,
  previouslyValidatedSkills
}: any) {
  const alreadyAssessedSkills = previouslyValidatedSkills.concat(previouslyFailedSkills);
  return (skill: any) => _(alreadyAssessedSkills).intersectionWith([skill], Skill.areEqualById).isEmpty();
}

function _enrichDirectKnowledgeElementWithInferredKnowledgeElements({
  answer,
  directKnowledgeElement,
  previouslyFailedSkills,
  previouslyValidatedSkills,
  targetSkills,
  userId
}: any) {
  const targetSkillsGroupedByTubeName = _.groupBy(targetSkills, (skill: any) => skill.tubeNameWithoutPrefix);
  // @ts-expect-error ts-migrate(2551) FIXME: Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
  const status = answer.isOk() ? statuses.VALIDATED : statuses.INVALIDATED;

  if (directKnowledgeElement) {
    const directSkill = _findSkillByIdFromTargetSkills(directKnowledgeElement.skillId, targetSkills);

    const newKnowledgeElements = targetSkillsGroupedByTubeName[directSkill.tubeNameWithoutPrefix]
      .filter(_skillIsNotAlreadyAssessed({ previouslyFailedSkills, previouslyValidatedSkills }))
      .flatMap((skillToInfer: any) => {
        const newKnowledgeElements = _createInferredKnowledgeElements({
          answer,
          status,
          directSkill,
          skillToInfer,
          userId,
        });
        return newKnowledgeElements;
      });
    return [directKnowledgeElement, ...newKnowledgeElements];
  }
  return [];
}

function _findSkillByIdFromTargetSkills(skillId: any, targetSkills: any) {
  const skillToCopy = targetSkills.find((skill: any) => skill.id === skillId);
  return new Skill({ id: skillToCopy.id, name: skillToCopy.name });
}

function _createInferredKnowledgeElements({
  answer,
  status,
  directSkill,
  skillToInfer,
  userId
}: any) {
  const newInferredKnowledgeElements = [];
  if (status === statuses.VALIDATED && skillToInfer.difficulty < directSkill.difficulty) {
    const newKnowledgeElement = _createKnowledgeElement({
      answer,
      skill: skillToInfer,
      userId,
      status: statuses.VALIDATED,
      source: sources.INFERRED,
    });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    newInferredKnowledgeElements.push(newKnowledgeElement);
  }
  // @ts-expect-error ts-migrate(2551) FIXME: Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
  if (status === statuses.INVALIDATED && skillToInfer.difficulty > directSkill.difficulty) {
    const newKnowledgeElement = _createKnowledgeElement({
      answer,
      skill: skillToInfer,
      userId,
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'INVALIDATED' does not exist on type '{ D... Remove this comment to see the full error message
      status: statuses.INVALIDATED,
      source: sources.INFERRED,
    });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    newInferredKnowledgeElements.push(newKnowledgeElement);
  }
  return newInferredKnowledgeElements;
}

function _createKnowledgeElement({
  answer,
  skill,
  userId,
  status,
  source
}: any) {
  const pixValue = status === statuses.VALIDATED ? skill.pixValue : 0;

  return new KnowledgeElement({
    answerId: answer.id,
    assessmentId: answer.assessmentId,
    earnedPix: pixValue,
    skillId: skill.id,
    source,
    status,
    competenceId: skill.competenceId,
    userId,
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = KnowledgeElement;
