// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'pipe'.
const { pipe } = require('lodash/fp');

// This file implements methods useful for a CAT algorithm
// https://en.wikipedia.org/wiki/Computerized_adaptive_testing
// https://en.wikipedia.org/wiki/Item_response_theory

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findMaxRewardingSkills,
  getPredictedLevel,
};

function getPredictedLevel(knowledgeElements: any, skills: any) {
  return _.maxBy(_enumerateCatLevels(), (level: any) => _probabilityThatUserHasSpecificLevel(level, knowledgeElements, skills)
  );
}

function _enumerateCatLevels() {
  const firstLevel = 0.5;
  const lastLevel = 8; // The upper boundary is not included in the range
  const levelStep = 0.5;
  return _.range(firstLevel, lastLevel, levelStep);
}

function _probabilityThatUserHasSpecificLevel(level: any, knowledgeElements: any, skills: any) {
  const directKnowledgeElements = _.filter(knowledgeElements, (ke: any) => ke.source === 'direct');
  const extraAnswers = directKnowledgeElements.map((ke: any) => {
    const skill = skills.find((skill: any) => skill.id === ke.skillId);
    const maxDifficulty = skill.difficulty || 2;
    const binaryOutcome = ke.status === KnowledgeElement.StatusType.VALIDATED ? 1 : 0;
    return { binaryOutcome, maxDifficulty };
  });

  const answerThatAnyoneCanSolve = { maxDifficulty: 0, binaryOutcome: 1 };
  const answerThatNobodyCanSolve = { maxDifficulty: 7, binaryOutcome: 0 };
  extraAnswers.push(answerThatAnyoneCanSolve, answerThatNobodyCanSolve);

  const diffBetweenResultAndProbaToResolve = extraAnswers.map(
    (answer: any) => answer.binaryOutcome - _probaOfCorrectAnswer(level, answer.maxDifficulty)
  );

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return -Math.abs(diffBetweenResultAndProbaToResolve.reduce((a: any, b: any) => a + b));
}

function findMaxRewardingSkills(...args: any[]) {
  return pipe(_getMaxRewardingSkills, _clearSkillsIfNotRewarding)(...args);
}

function _getMaxRewardingSkills({
  availableSkills,
  predictedLevel,
  tubes,
  knowledgeElements
}: any) {
  return _.reduce(
    availableSkills,
    (acc: any, skill: any) => {
      const skillReward = _computeReward({ skill, predictedLevel, tubes, knowledgeElements });
      if (skillReward > acc.maxReward) {
        acc.maxReward = skillReward;
        acc.maxRewardingSkills = [skill];
      } else if (skillReward === acc.maxReward) {
        acc.maxRewardingSkills.push(skill);
      }
      return acc;
    },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Infinity'.
    { maxRewardingSkills: [], maxReward: -Infinity }
  ).maxRewardingSkills;
}

// Skills that won't bring anymore information on the user is a termination condition of the CAT algorithm
function _clearSkillsIfNotRewarding(skills: any) {
  return _.filter(skills, (skill: any) => skill.reward !== 0);
}

function _computeReward({
  skill,
  predictedLevel,
  tubes,
  knowledgeElements
}: any) {
  const proba = _probaOfCorrectAnswer(predictedLevel, skill.difficulty);
  const extraSkillsIfSolvedCount = _getNewSkillsInfoIfSkillSolved(skill, tubes, knowledgeElements).length;
  const failedSkillsIfUnsolvedCount = _getNewSkillsInfoIfSkillUnsolved(skill, tubes, knowledgeElements).length;

  return proba * extraSkillsIfSolvedCount + (1 - proba) * failedSkillsIfUnsolvedCount;
}

// The probability P(gap) of giving the correct answer is given by the "logistic function"
// https://en.wikipedia.org/wiki/Logistic_function
function _probaOfCorrectAnswer(userEstimatedLevel: any, challengeDifficulty: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return 1 / (1 + Math.exp(-(userEstimatedLevel - challengeDifficulty)));
}

function _getNewSkillsInfoIfSkillSolved(skillTested: any, tubes: any, knowledgeElements: any) {
  let extraValidatedSkills = _findTubeByName(tubes, skillTested.tubeNameWithoutPrefix)
    .getEasierThan(skillTested)
    .filter(_skillNotTestedYet(knowledgeElements));

  if (!_.isEmpty(skillTested.linkedSkills)) {
    extraValidatedSkills = _.concat(extraValidatedSkills, skillTested.linkedSkills);
  }
  return _.uniqBy(extraValidatedSkills, 'id');
}

function _getNewSkillsInfoIfSkillUnsolved(skillTested: any, tubes: any, knowledgeElements: any) {
  let extraFailedSkills = _findTubeByName(tubes, skillTested.tubeNameWithoutPrefix)
    .getHarderThan(skillTested)
    .filter(_skillNotTestedYet(knowledgeElements));

  if (!_.isEmpty(skillTested.linkedSkills)) {
    extraFailedSkills = _.concat(extraFailedSkills, skillTested.linkedSkills);
  }
  return _.uniqBy(extraFailedSkills, 'id');
}

function _findTubeByName(tubes: any, tubeName: any) {
  return tubes.find((tube: any) => tube.name === tubeName);
}

function _skillNotTestedYet(knowledgeElements: any) {
  return (skill: any) => {
    const skillsAlreadyTested = _.map(knowledgeElements, 'skillId');
    return !skillsAlreadyTested.includes(skill.id);
  };
}
