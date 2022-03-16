// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hashInt'.
const hashInt = require('hash-int');
// @ts-expect-error ts-migrate(7005) FIXME: Variable 'NON_EXISTING_ITEM' implicitly has an 'an... Remove this comment to see the full error message
const NON_EXISTING_ITEM = null;
const VALIDATED_STATUS = 'validé';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  pickChallenge({
    skills,
    randomSeed,
    locale
  }: any) {
    if (skills.length === 0) {
      return NON_EXISTING_ITEM;
    }
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    const keyForSkill = Math.abs(hashInt(randomSeed));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    const keyForChallenge = Math.abs(hashInt(randomSeed + 1));
    const chosenSkill = skills[keyForSkill % skills.length];

    return _pickLocaleChallengeAtIndex(chosenSkill.challenges, locale, keyForChallenge);
  },
};

function _pickLocaleChallengeAtIndex(challenges: any, locale: any, index: any) {
  const localeChallenges = _.filter(challenges, (challenge: any) => _.includes(challenge.locales, locale));
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
  const possibleChallenges = _findPreferablyValidatedChallenges(localeChallenges, locale);
  return _.isEmpty(possibleChallenges) ? null : _pickChallengeAtIndex(possibleChallenges, index);
}

function _pickChallengeAtIndex(challenges: any, index: any) {
  return challenges[index % challenges.length];
}

function _findPreferablyValidatedChallenges(localeChallenges: any) {
  const validatedChallenges = _.filter(localeChallenges, (challenge: any) => challenge.status === VALIDATED_STATUS);
  return validatedChallenges.length > 0 ? validatedChallenges : localeChallenges;
}
