// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'pipe'.
const { pipe } = require('lodash/fp');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../constants');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getFilteredSkillsForFirstChallenge,
  getFilteredSkillsForNextChallenge,
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getFiltere... Remove this comment to see the full error message
function getFilteredSkillsForFirstChallenge({
  knowledgeElements,
  tubes,
  targetSkills
}: any) {
  return pipe(
    _getPlayableSkill,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(knowledge... Remove this comment to see the full error message
    _getUntestedSkills.bind(null, knowledgeElements),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(tubes: an... Remove this comment to see the full error message
    _keepSkillsFromEasyTubes.bind(null, tubes),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(isLastCha... Remove this comment to see the full error message
    _removeTimedSkillsIfNeeded.bind(null, true),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(targetSki... Remove this comment to see the full error message
    _focusOnDefaultLevel.bind(null)
  )(targetSkills);
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getFiltere... Remove this comment to see the full error message
function getFilteredSkillsForNextChallenge({
  knowledgeElements,
  tubes,
  predictedLevel,
  isLastChallengeTimed,
  targetSkills
}: any) {
  return pipe(
    _getPlayableSkill,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(knowledge... Remove this comment to see the full error message
    _getUntestedSkills.bind(null, knowledgeElements),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(tubes: an... Remove this comment to see the full error message
    _keepSkillsFromEasyTubes.bind(null, tubes),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(isLastCha... Remove this comment to see the full error message
    _removeTimedSkillsIfNeeded.bind(null, isLastChallengeTimed),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'bind' does not exist on type '(predicted... Remove this comment to see the full error message
    _removeTooDifficultSkills.bind(null, predictedLevel)
  )(targetSkills);
}

function _getUntestedSkills(knowledgeElements: any, skills: any) {
  return _.filter(skills, _skillNotAlreadyTested(knowledgeElements));
}

function _getPlayableSkill(skills: any) {
  return _.filter(skills, (skill: any) => skill.isPlayable);
}

function _getPrioritySkills(tubes: any) {
  return pipe(_getEasyTubes, _getSkillsFromTubes)(tubes);
}

function _keepSkillsFromEasyTubes(tubes: any, targetSkills: any) {
  const skillsFromEasyTubes = _getPrioritySkills(tubes);
  const availableSkillsFromEasyTubes = _.intersectionBy(targetSkills, skillsFromEasyTubes, 'id');
  if (!_.isEmpty(availableSkillsFromEasyTubes)) {
    return availableSkillsFromEasyTubes;
  }
  return targetSkills;
}

function _getEasyTubes(tubes: any) {
  return _.filter(tubes, (tube: any) => tube.getHardestSkill().difficulty <= constants.MAX_LEVEL_TO_BE_AN_EASY_TUBE);
}

function _getSkillsFromTubes(tubes: any) {
  return _.flatMap(tubes, (tube: any) => tube.skills);
}

function _skillNotAlreadyTested(knowledgeElements: any) {
  return (skill: any) => {
    const alreadyTestedSkillIds = _.map(knowledgeElements, 'skillId');
    return !alreadyTestedSkillIds.includes(skill.id);
  };
}

function _removeTimedSkillsIfNeeded(isLastChallengeTimed: any, targetSkills: any) {
  if (isLastChallengeTimed) {
    const skillsWithoutTimedChallenges = _.filter(targetSkills, (skill: any) => !skill.timed);
    return skillsWithoutTimedChallenges.length > 0 ? skillsWithoutTimedChallenges : targetSkills;
  }
  return targetSkills;
}

function _focusOnDefaultLevel(targetSkills: any) {
  if (_.isEmpty(targetSkills)) {
    return targetSkills;
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
  const remapDifficulty = (difficulty: any) => difficulty == constants.DEFAULT_LEVEL_FOR_FIRST_CHALLENGE ? Number.MIN_VALUE : difficulty;
  const [, potentialFirstSkills] = _(targetSkills)
    .groupBy('difficulty')
    .entries()
    // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'difficulty' implicitly has an 'an... Remove this comment to see the full error message
    .minBy(([difficulty, _targetSkills]) => remapDifficulty(parseFloat(difficulty)));

  return potentialFirstSkills;
}

function _removeTooDifficultSkills(predictedLevel: any, targetSkills: any) {
  return _.filter(targetSkills, (skill: any) => !_isSkillTooHard(skill, predictedLevel));
}

function _isSkillTooHard(skill: any, predictedLevel: any) {
  return skill.difficulty - predictedLevel > constants.MAX_DIFF_BETWEEN_USER_LEVEL_AND_SKILL_LEVEL;
}
