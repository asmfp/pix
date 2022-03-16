// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const REACH_LEVEL_POINTS = 40;
const DIFFICULTY_POINTS = 30;
const PROGRESS_POINTS = 20;
const NEXT_STEP_POINTS = 10;
const DEFAULT_REACHED_LEVEL = 0;

function _getSkillOfMaxDifficulty(skills: any) {
  return _.maxBy(skills, 'difficulty');
}

function computeRecommendationScore(skillsOfTube: any, maxSkillLevelInTargetProfile: any, validatedKnowledgeElements: any) {
  const skillOfMaxDifficulty = _getSkillOfMaxDifficulty(skillsOfTube);
  const reachedLevelInTube = _getReachedLevelInTube(validatedKnowledgeElements, skillsOfTube);

  const reachedLevelScore = _computeReachedLevelScore(skillOfMaxDifficulty, reachedLevelInTube);
  const difficultyScore = _computeDifficultyScore(maxSkillLevelInTargetProfile, skillOfMaxDifficulty);
  const progressScore = _computeProgressScore(skillsOfTube, validatedKnowledgeElements);
  const nextStepScore = _computeNextStepScore(skillsOfTube, validatedKnowledgeElements, reachedLevelInTube);

  return reachedLevelScore + difficultyScore + progressScore + nextStepScore;
}

function _computeReachedLevelScore(skill: any, reachedLevelInTube: any) {
  return (REACH_LEVEL_POINTS / skill.difficulty) * reachedLevelInTube;
}

function _computeProgressScore(skillsOfTube: any, validatedKnowledgeElements: any) {
  return (PROGRESS_POINTS / skillsOfTube.length) * validatedKnowledgeElements.length;
}

function _computeNextStepScore(skillsOfTube: any, validatedKnowledgeElements: any, reachedLevelInTube: any) {
  if (_.isEmpty(validatedKnowledgeElements)) {
    return 0;
  }

  const nextLevelToReach = _getNextLevelToReach(skillsOfTube, validatedKnowledgeElements);
  return (NEXT_STEP_POINTS / nextLevelToReach) * reachedLevelInTube;
}

function _computeDifficultyScore(maxSkillLevelInTargetProfile: any, skill: any) {
  return (DIFFICULTY_POINTS / maxSkillLevelInTargetProfile) * skill.difficulty;
}

function _getNextLevelToReach(skillsOfTube: any, validatedKnowledgeElements: any) {
  const nextSkillToAcquire = _(skillsOfTube).reject(_isSkillValidated(validatedKnowledgeElements)).minBy('difficulty');

  if (!nextSkillToAcquire) {
    return _getSkillOfMaxDifficulty(skillsOfTube).difficulty;
  }

  return nextSkillToAcquire.difficulty;
}

function _getReachedLevelInTube(validatedKnowledgeElements: any, skillsOfTube: any) {
  const skillsOfTubeWithKnowledgeElement = skillsOfTube.filter(({
    id
  }: any) =>
    _.find(validatedKnowledgeElements, { skillId: id })
  );
  const reachSkill = _getSkillOfMaxDifficulty(skillsOfTubeWithKnowledgeElement);

  return reachSkill ? reachSkill.difficulty : DEFAULT_REACHED_LEVEL;
}

function _isSkillValidated(validatedKnowledgeElements: any) {
  return (skill: any) => _.map(validatedKnowledgeElements, 'skillId').includes(skill.id);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  computeRecommendationScore,
};
