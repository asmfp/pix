// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MINIMUM_RE... Remove this comment to see the full error message
const { MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED } = require('../constants');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
class ReproducibilityRate {
  value: any;
  constructor(value: any) {
    this.value = value;
  }

  static from({
    numberOfNonNeutralizedChallenges,
    numberOfCorrectAnswers
  }: any) {
    if (numberOfNonNeutralizedChallenges === 0) return new ReproducibilityRate(0);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    return new ReproducibilityRate(Math.round((numberOfCorrectAnswers / numberOfNonNeutralizedChallenges) * 100));
  }

  isEnoughToBeCertified() {
    return this.value >= MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED;
  }

  isEqualOrAbove(value: any) {
    return this.value >= value;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  ReproducibilityRate,
};
