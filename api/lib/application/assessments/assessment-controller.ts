// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = require('../../domain/events');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const assessmentSerializer = require('../../infrastructure/serializers/jsonapi/assessment-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'challengeS... Remove this comment to see the full error message
const challengeSerializer = require('../../infrastructure/serializers/jsonapi/challenge-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const competenceEvaluationSerializer = require('../../infrastructure/serializers/jsonapi/competence-evaluation-serializer');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
  extractLocaleFromRequest,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
  extractUserIdFromRequest,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: any, h: any) {
    const assessment = assessmentSerializer.deserialize(request.payload);
    assessment.userId = extractUserIdFromRequest(request);
    assessment.state = 'started';
    const createdAssessment = await assessmentRepository.save({ assessment });
    return h.response(assessmentSerializer.serialize(createdAssessment)).created();
  },

  async get(request: any) {
    const assessmentId = request.params.id;
    const locale = extractLocaleFromRequest(request);

    const assessment = await usecases.getAssessment({ assessmentId, locale });

    return assessmentSerializer.serialize(assessment);
  },

  async getLastChallengeId(request: any, h: any) {
    const assessmentId = request.params.id;

    const lastChallengeId = await usecases.getLastChallengeIdFromAssessmentId({ assessmentId });

    return h.response(lastChallengeId).code(200);
  },

  async getChallengeForPixAutoAnswer(request: any, h: any) {
    const assessmentId = request.params.id;

    const challenge = await usecases.getChallengeForPixAutoAnswer({ assessmentId });

    return h.response(challenge).code(200);
  },

  async getNextChallenge(request: any) {
    const assessmentId = request.params.id;

    const logContext = {
      zone: 'assessmentController.getNextChallenge',
      type: 'controller',
      assessmentId,
    };
    logger.trace(logContext, 'tracing assessmentController.getNextChallenge()');

    try {
      const assessment = await assessmentRepository.get(assessmentId);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'assessmentType' does not exist on type '... Remove this comment to see the full error message
      logContext.assessmentType = assessment.type;
      logger.trace(logContext, 'assessment loaded');

      const challenge = await _getChallenge(assessment, request);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'challenge' does not exist on type '{ zon... Remove this comment to see the full error message
      logContext.challenge = challenge;
      logger.trace(logContext, 'replying with challenge');

      return challengeSerializer.serialize(challenge);
    } catch (error) {
      if (error instanceof AssessmentEndedError) {
        const object = new JSONAPISerializer('', {});
        return object.serialize(null);
      }
      throw error;
    }
  },

  // @ts-expect-error ts-migrate(7010) FIXME: 'completeAssessment', which lacks return-type anno... Remove this comment to see the full error message
  async completeAssessment(request: any) {
    const assessmentId = request.params.id;

    let event;
    // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
    await DomainTransaction.execute(async (domainTransaction: any) => {
      event = await usecases.completeAssessment({ assessmentId, domainTransaction });
    });

    await events.eventDispatcher.dispatch(event);

    return null;
  },

  // @ts-expect-error ts-migrate(7010) FIXME: 'updateLastChallengeState', which lacks return-typ... Remove this comment to see the full error message
  async updateLastChallengeState(request: any) {
    const assessmentId = request.params.id;
    const lastQuestionState = request.params.state;
    await assessmentRepository.updateLastQuestionState({
      id: assessmentId,
      lastQuestionState,
    });
    return null;
  },

  async findCompetenceEvaluations(request: any) {
    const userId = request.auth.credentials.userId;
    const assessmentId = request.params.id;

    const competenceEvaluations = await usecases.findCompetenceEvaluationsByAssessment({ userId, assessmentId });

    return competenceEvaluationSerializer.serialize(competenceEvaluations);
  },
};

async function _getChallenge(assessment: any, request: any) {
  if (assessment.isStarted()) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    await assessmentRepository.updateLastQuestionDate({ id: assessment.id, lastQuestionDate: new Date() });
  }
  const challenge = await _getChallengeByAssessmentType({ assessment, request });

  if (challenge) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'unknown'.
    if (challenge.id !== assessment.lastChallengeId) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'unknown'.
      await assessmentRepository.updateWhenNewChallengeIsAsked({ id: assessment.id, lastChallengeId: challenge.id });
    }
  }

  return challenge;
}

async function _getChallengeByAssessmentType({
  assessment,
  request
}: any) {
  const locale = extractLocaleFromRequest(request);

  if (assessment.isPreview()) {
    return usecases.getNextChallengeForPreview({});
  }

  if (assessment.isCertification()) {
    return usecases.getNextChallengeForCertification({ assessment });
  }

  if (assessment.isDemo()) {
    return usecases.getNextChallengeForDemo({ assessment });
  }

  if (assessment.isForCampaign()) {
    return usecases.getNextChallengeForCampaignAssessment({ assessment, locale });
  }

  if (assessment.isCompetenceEvaluation()) {
    const userId = extractUserIdFromRequest(request);
    return usecases.getNextChallengeForCompetenceEvaluation({ assessment, userId, locale });
  }

  return null;
}
