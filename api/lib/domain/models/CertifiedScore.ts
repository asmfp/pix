// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const { PIX_COUNT_BY_LEVEL } = require('../constants');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
class CertifiedScore {
  value: any;
  constructor(value: any) {
    this.value = value;
  }
  static from({
    certifiedLevel,
    estimatedScore
  }: any) {
    if (certifiedLevel.isUncertified()) {
      return new CertifiedScore(0);
    }
    if (certifiedLevel.isDowngraded()) {
      return new CertifiedScore(estimatedScore - PIX_COUNT_BY_LEVEL);
    }
    return new CertifiedScore(estimatedScore);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CertifiedScore,
};
