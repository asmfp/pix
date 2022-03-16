// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
const { ChallengeToBeNeutralizedNotFoundError, ChallengeToBeDeneutralizedNotFoundError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('./AnswerStatus');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const NeutralizationAttempt = require('./NeutralizationAttempt');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'states'.
const states = {
  COMPLETED: 'completed',
  STARTED: 'started',
  ENDED_BY_SUPERVISOR: 'endedBySupervisor',
};

const certificationAssessmentSchema = Joi.object({
  id: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  certificationCourseId: Joi.number().integer().required(),
  createdAt: Joi.date().required(),
  completedAt: Joi.date().allow(null),
  state: Joi.string().valid(states.COMPLETED, states.STARTED, states.ENDED_BY_SUPERVISOR).required(),
  isV2Certification: Joi.boolean().required(),
  certificationChallenges: Joi.array().min(1).required(),
  certificationAnswersByDate: Joi.array().min(0).required(),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationAssessment {
  certificationAnswersByDate: any;
  certificationChallenges: any;
  certificationCourseId: any;
  completedAt: any;
  createdAt: any;
  id: any;
  isV2Certification: any;
  state: any;
  userId: any;
  constructor({
    id,
    userId,
    certificationCourseId,
    createdAt,
    completedAt,
    state,
    isV2Certification,
    certificationChallenges,
    certificationAnswersByDate
  }: any = {}) {
    this.id = id;
    this.userId = userId;
    this.certificationCourseId = certificationCourseId;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.state = state;
    this.isV2Certification = isV2Certification;
    this.certificationChallenges = certificationChallenges;
    this.certificationAnswersByDate = certificationAnswersByDate;

    validateEntity(certificationAssessmentSchema, this);
  }

  getCertificationChallenge(challengeId: any) {
    return _.find(this.certificationChallenges, { challengeId }) || null;
  }

  neutralizeChallengeByRecId(recId: any) {
    const challengeToBeNeutralized = _.find(this.certificationChallenges, { challengeId: recId });
    if (challengeToBeNeutralized) {
      challengeToBeNeutralized.neutralize();
    } else {
      throw new ChallengeToBeNeutralizedNotFoundError();
    }
  }

  neutralizeChallengeByNumberIfKoOrSkippedOrPartially(questionNumber: any) {
    const toBeNeutralizedChallengeAnswer = this.certificationAnswersByDate[questionNumber - 1];
    if (!toBeNeutralizedChallengeAnswer) {
      return NeutralizationAttempt.failure(questionNumber);
    }

    if (_isAnswerKoOrSkippedOrPartially(toBeNeutralizedChallengeAnswer.result.status)) {
      const challengeToBeNeutralized = _.find(this.certificationChallenges, {
        challengeId: toBeNeutralizedChallengeAnswer.challengeId,
      });
      challengeToBeNeutralized.neutralize();
      return NeutralizationAttempt.neutralized(questionNumber);
    }

    return NeutralizationAttempt.skipped(questionNumber);
  }

  deneutralizeChallengeByRecId(recId: any) {
    const challengeToBeDeneutralized = _.find(this.certificationChallenges, { challengeId: recId });
    if (challengeToBeDeneutralized) {
      challengeToBeDeneutralized.deneutralize();
    } else {
      throw new ChallengeToBeDeneutralizedNotFoundError();
    }
  }

  listCertifiableBadgePixPlusKeysTaken() {
    return _(this.certificationChallenges)
      .filter((certificationChallenge: any) => certificationChallenge.isPixPlus())
      .uniqBy('certifiableBadgeKey')
      .map('certifiableBadgeKey')
      .value();
  }

  findAnswersAndChallengesForCertifiableBadgeKey(certifiableBadgeKey: any) {
    const certificationChallengesForBadge = _.filter(this.certificationChallenges, { certifiableBadgeKey });
    const challengeIds = _.map(certificationChallengesForBadge, 'challengeId');
    const answersForBadge = _.filter(this.certificationAnswersByDate, ({
      challengeId
    }: any) =>
      _.includes(challengeIds, challengeId)
    );
    return {
      certificationChallenges: certificationChallengesForBadge,
      certificationAnswers: answersForBadge,
    };
  }

  isCompleted() {
    return this.state === states.COMPLETED;
  }

  getChallengeRecIdByQuestionNumber(questionNumber: any) {
    return this.certificationAnswersByDate[questionNumber - 1]?.challengeId || null;
  }

  skipUnansweredChallenges() {
    this.certificationChallenges.forEach((certificationChallenge: any) => {
      if (
        !this.certificationAnswersByDate.some(
          (certificationAnswer: any) => certificationChallenge.challengeId === certificationAnswer.challengeId
        )
      ) {
        certificationChallenge.skipAutomatically();
      }
    });
  }

  neutralizeUnansweredChallenges() {
    this.certificationChallenges.map((certificationChallenge: any) => {
      if (
        !this.certificationAnswersByDate.some(
          (certificationAnswer: any) => certificationChallenge.challengeId === certificationAnswer.challengeId
        )
      ) {
        certificationChallenge.neutralize();
      }
    });
  }
}

function _isAnswerKoOrSkippedOrPartially(answerStatus: any) {
  const isKo = AnswerStatus.isKO(answerStatus);
  const isSkipped = AnswerStatus.isSKIPPED(answerStatus);
  const isPartially = AnswerStatus.isPARTIALLY(answerStatus);
  return isKo || isSkipped || isPartially;
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof C... Remove this comment to see the full error message
CertificationAssessment.states = states;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationAssessment;
