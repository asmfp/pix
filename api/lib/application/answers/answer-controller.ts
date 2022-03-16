// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const answerSerializer = require('../../infrastructure/serializers/jsonapi/answer-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const correctionSerializer = require('../../infrastructure/serializers/jsonapi/correction-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: any, h: any) {
    const answer = answerSerializer.deserialize(request.payload);
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const locale = requestResponseUtils.extractLocaleFromRequest(request);
    const createdAnswer = await usecases.correctAnswerThenUpdateAssessment({ answer, userId, locale });

    return h.response(answerSerializer.serialize(createdAnswer)).created();
  },

  async get(request: any) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const answerId = request.params.id;
    const answer = await usecases.getAnswer({ answerId, userId });

    return answerSerializer.serialize(answer);
  },

  async update(request: any) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const answerId = request.params.id;
    const answer = await usecases.getAnswer({ answerId, userId });

    return answerSerializer.serialize(answer);
  },

  async find(request: any) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const challengeId = request.query.challengeId;
    const assessmentId = request.query.assessmentId;
    let answers = [];
    if (challengeId && assessmentId) {
      answers = await usecases.findAnswerByChallengeAndAssessment({ challengeId, assessmentId, userId });
    }
    if (assessmentId && !challengeId) {
      answers = await usecases.findAnswerByAssessment({ assessmentId, userId });
    }

    return answerSerializer.serialize(answers);
  },

  async getCorrection(request: any) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const locale = requestResponseUtils.extractLocaleFromRequest(request);
    const answerId = request.params.id;

    const correction = await usecases.getCorrectionForAnswer({
      answerId,
      userId,
      locale,
    });

    return correctionSerializer.serialize(correction);
  },
};
