// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertificationScoring = require('./PartnerCertificationScoring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotEligibl... Remove this comment to see the full error message
const { NotEligibleCandidateError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MINIMUM_RE... Remove this comment to see the full error message
  MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED,
  MINIMUM_REPRODUCIBILITY_RATE_TO_BE_TRUSTED,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../constants');

function _isScoreOver75PercentOfExpectedScore(score: any, expectedScore: any) {
  return score >= _.floor(expectedScore * 0.75);
}

function _hasRequiredPixScoreForAtLeast75PercentOfCompetences({
  expectedPixByCompetenceForClea,
  cleaCompetenceMarks
}: any) {
  if (cleaCompetenceMarks.length === 0) return false;

  const countCompetencesWithRequiredPixScore = _(cleaCompetenceMarks)
    .filter(({
    score,
    competenceId
  }: any) => {
      const currentCompetenceScore = score;
      const expectedCompetenceScore = expectedPixByCompetenceForClea[competenceId];
      return _isScoreOver75PercentOfExpectedScore(currentCompetenceScore, expectedCompetenceScore);
    })
    .size();

  const minimumCompetenceCountWithRequiredScore = _.floor(cleaCompetenceMarks.length * 0.75);
  return countCompetencesWithRequiredPixScore >= minimumCompetenceCountWithRequiredScore;
}

function _hasSufficientReproducibilityRateToBeTrusted(reproducibilityRate: any) {
  return reproducibilityRate >= MINIMUM_REPRODUCIBILITY_RATE_TO_BE_TRUSTED;
}

function _hasNotMinimumReproducibilityRateToBeCertified(reproducibilityRate: any) {
  return reproducibilityRate <= MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
class CleaCertificationScoring extends PartnerCertificationScoring {
  cleaCompetenceMarks: any;
  expectedPixByCompetenceForClea: any;
  hasAcquiredBadge: any;
  isBadgeAcquisitionStillValid: any;
  reproducibilityRate: any;
  constructor({
    certificationCourseId,
    hasAcquiredBadge,
    reproducibilityRate,
    cleaCompetenceMarks,
    isBadgeAcquisitionStillValid = true,
    expectedPixByCompetenceForClea,
    cleaBadgeKey
  }: any = {}) {
    super({
      certificationCourseId,
      partnerKey: cleaBadgeKey,
    });

    this.hasAcquiredBadge = hasAcquiredBadge;
    this.isBadgeAcquisitionStillValid = isBadgeAcquisitionStillValid;
    this.reproducibilityRate = reproducibilityRate;
    this.cleaCompetenceMarks = cleaCompetenceMarks;
    this.expectedPixByCompetenceForClea = expectedPixByCompetenceForClea;

    const schema = Joi.object({
      hasAcquiredBadge: Joi.boolean().required(),
      reproducibilityRate: Joi.number().required(),
      cleaCompetenceMarks: Joi.array().required(),
      expectedPixByCompetenceForClea: Joi.object().required(),
    }).unknown();

    validateEntity(schema, this);
  }

  static buildNotEligible({
    certificationCourseId
  }: any) {
    return new CleaCertificationScoring({
      certificationCourseId,
      hasAcquiredBadge: false,
      isBadgeAcquisitionStillValid: false,
      cleaCompetenceMarks: [],
      expectedPixByCompetenceForClea: {},
      reproducibilityRate: 0,
      cleaBadgeKey: 'no_badge',
    });
  }

  isEligible() {
    return this.hasAcquiredBadge && this.isBadgeAcquisitionStillValid;
  }

  setBadgeAcquisitionStillValid(isValid: any) {
    this.isBadgeAcquisitionStillValid = isValid;
  }

  isAcquired() {
    if (!this.hasAcquiredBadge) throw new NotEligibleCandidateError();

    if (_hasNotMinimumReproducibilityRateToBeCertified(this.reproducibilityRate)) return false;

    if (_hasSufficientReproducibilityRateToBeTrusted(this.reproducibilityRate)) return true;

    return _hasRequiredPixScoreForAtLeast75PercentOfCompetences({
      cleaCompetenceMarks: this.cleaCompetenceMarks,
      expectedPixByCompetenceForClea: this.expectedPixByCompetenceForClea,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CleaCertificationScoring;
