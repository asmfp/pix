// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'config'.
const config = require('../../../config');

const DEFAULT_ESTIMATED_LEVEL = 0;
const START_OF_SAMPLES = -9;
const STEP_OF_SAMPLES = 18 / 80;
const END_OF_SAMPLES = 9 + STEP_OF_SAMPLES;
const samples = _.range(START_OF_SAMPLES, END_OF_SAMPLES, STEP_OF_SAMPLES);
const DEFAULT_PROBABILITY_TO_ANSWER = 1;
const DEFAULT_ERROR_RATE = 5;
const ERROR_RATE_CLASS_INTERVAL = 9 / 80;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getPossibleNextChallenges,
  getEstimatedLevelAndErrorRate,
  getNonAnsweredChallenges,
};

function getPossibleNextChallenges({
  allAnswers,
  challenges,
  estimatedLevel = DEFAULT_ESTIMATED_LEVEL
}: any = {}) {
  const nonAnsweredChallenges = getNonAnsweredChallenges({ allAnswers, challenges });

  if (nonAnsweredChallenges?.length === 0 || allAnswers.length >= config.features.numberOfChallengesForFlashMethod) {
    return {
      hasAssessmentEnded: true,
      possibleChallenges: [],
    };
  }

  const challengesWithReward = nonAnsweredChallenges.map((challenge: any) => {
    return {
      challenge,
      reward: _getReward({ estimatedLevel, discriminant: challenge.discriminant, difficulty: challenge.difficulty }),
    };
  });

  let maxReward = 0;
  const possibleChallenges = challengesWithReward.reduce((acc: any, challengesWithReward: any) => {
    if (challengesWithReward.reward > maxReward) {
      acc = [challengesWithReward.challenge];
      maxReward = challengesWithReward.reward;
    } else if (challengesWithReward.reward === maxReward) {
      acc.push(challengesWithReward.challenge);
    }
    return acc;
  }, []);

  return {
    hasAssessmentEnded: false,
    possibleChallenges,
  };
}

function getEstimatedLevelAndErrorRate({
  allAnswers,
  challenges
}: any) {
  if (allAnswers.length === 0) {
    return { estimatedLevel: DEFAULT_ESTIMATED_LEVEL, errorRate: DEFAULT_ERROR_RATE };
  }

  let latestEstimatedLevel = DEFAULT_ESTIMATED_LEVEL;

  const samplesWithResults = samples.map((sample: any) => ({
    sample,
    // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'gaussian' implicitly ha... Remove this comment to see the full error message
    gaussian: null,
    probabilityToAnswer: DEFAULT_PROBABILITY_TO_ANSWER,
    // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'probability' implicitly... Remove this comment to see the full error message
    probability: null
  }));

  for (const answer of allAnswers) {
    const answeredChallenge = _.find(challenges, ['id', answer.challengeId]);

    for (const sampleWithResults of samplesWithResults) {
      sampleWithResults.gaussian = _getGaussianValue({
        gaussianMean: latestEstimatedLevel,
        value: sampleWithResults.sample,
      });

      let probability = _getProbability({
        estimatedLevel: sampleWithResults.sample,
        discriminant: answeredChallenge.discriminant,
        difficulty: answeredChallenge.difficulty,
      });
      probability = answer.isOk() ? probability : 1 - probability;
      sampleWithResults.probabilityToAnswer *= probability;
    }

    _normalizeFieldDistribution(samplesWithResults, 'gaussian');

    for (const sampleWithResults of samplesWithResults) {
      sampleWithResults.probability = sampleWithResults.probabilityToAnswer * sampleWithResults.gaussian;
    }

    _normalizeFieldDistribution(samplesWithResults, 'probability');

    latestEstimatedLevel = samplesWithResults.reduce(
      (estimatedLevel: any, {
        sample,
        probability
      }: any) => estimatedLevel + sample * probability,
      0
    );
  }

  const rawErrorRate = samplesWithResults.reduce(
    (acc: any, {
      sample,
      probability
    }: any) => acc + probability * (sample - latestEstimatedLevel) ** 2,
    0
  );

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  const correctedErrorRate = Math.sqrt(rawErrorRate - (ERROR_RATE_CLASS_INTERVAL ** 2) / 12.0); // prettier-ignore

  return { estimatedLevel: latestEstimatedLevel, errorRate: correctedErrorRate };
}

function getNonAnsweredChallenges({
  allAnswers,
  challenges
}: any) {
  const getAnswerSkill = (answer: any) => challenges.find((challenge: any) => challenge.id === answer.challengeId).skill;
  const alreadyAnsweredSkillsIds = allAnswers.map(getAnswerSkill).map((skill: any) => skill.id);

  const isSkillAlreadyAnswered = (skill: any) => alreadyAnsweredSkillsIds.includes(skill.id);
  const filterNonAnsweredChallenge = (challenge: any) => !isSkillAlreadyAnswered(challenge.skill);
  const nonAnsweredChallenges = _.filter(challenges, filterNonAnsweredChallenge);

  return nonAnsweredChallenges;
}

function _getReward({
  estimatedLevel,
  discriminant,
  difficulty
}: any) {
  const probability = _getProbability({ estimatedLevel, discriminant, difficulty });
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return probability * (1 - probability) * Math.pow(discriminant, 2);
}

function _getProbability({
  estimatedLevel,
  discriminant,
  difficulty
}: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return 1 / (1 + Math.exp(discriminant * (difficulty - estimatedLevel)));
}

function _getGaussianValue({
  gaussianMean,
  value
}: any) {
  const variance = 1.5;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  return Math.exp(Math.pow(value - gaussianMean, 2) / (-2 * variance)) / (Math.sqrt(variance) * Math.sqrt(2 * Math.PI));
}

function _normalizeFieldDistribution(data: any, field: any) {
  const sum = _.sumBy(data, field);
  for (const item of data) {
    item[field] /= sum;
  }
}
