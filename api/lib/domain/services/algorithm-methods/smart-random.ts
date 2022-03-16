// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const catAlgorithm = require('./cat-algorithm');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getFiltere... Remove this comment to see the full error message
const { getFilteredSkillsForNextChallenge, getFilteredSkillsForFirstChallenge } = require('./skills-filter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'computeTub... Remove this comment to see the full error message
const { computeTubesFromSkills } = require('./../tube-service');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { getPossibleSkillsForNextChallenge };

function getPossibleSkillsForNextChallenge({
  knowledgeElements,
  challenges,
  targetSkills,
  lastAnswer,
  allAnswers,
  locale
}: any = {}) {
  const isUserStartingTheTest = !lastAnswer;
  const isLastChallengeTimed = _wasLastChallengeTimed(lastAnswer);
  const tubes = _findTubes(targetSkills, challenges);
  const knowledgeElementsOfTargetSkills = knowledgeElements.filter((ke: any) => {
    return targetSkills.find((skill: any) => skill.id === ke.skillId);
  });
  const filteredChallenges = _removeChallengesWithAnswer({ challenges, allAnswers });
  targetSkills = _getSkillsWithAddedInformations({ targetSkills, filteredChallenges, locale });

  // First challenge has specific rules
  const { possibleSkillsForNextChallenge, levelEstimated } = isUserStartingTheTest
    ? _findFirstChallenge({ knowledgeElements: knowledgeElementsOfTargetSkills, targetSkills, tubes })
    : _findAnyChallenge({
        knowledgeElements: knowledgeElementsOfTargetSkills,
        targetSkills,
        tubes,
        isLastChallengeTimed,
      });

  // Test is considered finished when no challenges are returned but we don't expose this detail
  return possibleSkillsForNextChallenge.length > 0
    ? { hasAssessmentEnded: false, possibleSkillsForNextChallenge, levelEstimated }
    : { hasAssessmentEnded: true, possibleSkillsForNextChallenge, levelEstimated };
}

function _wasLastChallengeTimed(lastAnswer: any) {
  return _.get(lastAnswer, 'timeout') === null ? false : true;
}

function _findTubes(skills: any, challenges: any) {
  const listSkillsWithChallenges = _filterSkillsByChallenges(skills, challenges);
  return computeTubesFromSkills(listSkillsWithChallenges);
}

function _filterSkillsByChallenges(skills: any, challenges: any) {
  const skillsWithChallenges = skills.filter((skill: any) => {
    return challenges.find((challenge: any) => challenge.skill.name === skill.name);
  });
  return skillsWithChallenges;
}

function _findAnyChallenge({
  knowledgeElements,
  targetSkills,
  tubes,
  isLastChallengeTimed
}: any) {
  const predictedLevel = catAlgorithm.getPredictedLevel(knowledgeElements, targetSkills);
  const availableSkills = getFilteredSkillsForNextChallenge({
    knowledgeElements,
    tubes,
    predictedLevel,
    isLastChallengeTimed,
    targetSkills,
  });
  const maxRewardingSkills = catAlgorithm.findMaxRewardingSkills({
    availableSkills,
    predictedLevel,
    tubes,
    knowledgeElements,
  });
  return { possibleSkillsForNextChallenge: maxRewardingSkills, levelEstimated: predictedLevel };
}

function _findFirstChallenge({
  knowledgeElements,
  targetSkills,
  tubes
}: any) {
  const filteredSkillsForFirstChallenge = getFilteredSkillsForFirstChallenge({
    knowledgeElements,
    tubes,
    targetSkills,
  });
  return { possibleSkillsForNextChallenge: filteredSkillsForFirstChallenge, levelEstimated: 2 };
}

function _getSkillsWithAddedInformations({
  targetSkills,
  filteredChallenges,
  locale
}: any) {
  return _.map(targetSkills, (skill: any) => {
    const challenges = _.filter(
      filteredChallenges,
      (challenge: any) => challenge.skill.id === skill.id && challenge.locales.includes(locale)
    );
    const [firstChallenge] = challenges;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const skillCopy = Object.create(skill);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    return Object.assign(skillCopy, {
      challenges,
      linkedSkills: firstChallenge ? _.reject(firstChallenge.skills, { id: skill.id }) : [],
      timed: firstChallenge ? firstChallenge.isTimed() : false,
      isPlayable: !!firstChallenge,
    });
  });
}

function _removeChallengesWithAnswer({
  challenges,
  allAnswers
}: any) {
  const challengeIdsWithAnswer = allAnswers.map((answer: any) => answer.challengeId);
  return challenges.filter((challenge: any) => !_.includes(challengeIdsWithAnswer, challenge.id));
}
