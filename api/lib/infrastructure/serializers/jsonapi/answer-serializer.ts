// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../../domain/models/Answer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const answerStatusJSONAPIAdapter = require('../../adapters/answer-status-json-api-adapter');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(answer: any) {
    return new Serializer('answer', {
      transform: (untouchedAnswer: any) => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const answer = Object.assign({}, untouchedAnswer);
        answer.assessment = { id: answer.assessmentId };
        answer.challenge = { id: answer.challengeId };
        answer.result = answerStatusJSONAPIAdapter.adapt(untouchedAnswer.result);
        return answer;
      },
      attributes: ['value', 'timeout', 'result', 'resultDetails', 'assessment', 'challenge', 'correction', 'levelup'],
      assessment: {
        ref: 'id',
        includes: false,
      },
      challenge: {
        ref: 'id',
        includes: false,
      },
      correction: {
        ref: 'id',
        nullIfMissing: true,
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/answers/${parent.id}/correction`;
          },
        },
      },
      levelup: {
        ref: 'id',
        attributes: ['competenceName', 'level'],
      },
    }).serialize(answer);
  },

  deserialize(payload: any) {
    return new Answer({
      value: _cleanValue(payload.data.attributes.value),
      result: null,
      resultDetails: null,
      timeout: payload.data.attributes.timeout,
      isFocusedOut: payload.data.attributes['focused-out'],
      assessmentId: payload.data.relationships.assessment.data.id,
      challengeId: payload.data.relationships.challenge.data.id,
    });
  },
};

function _cleanValue(value: any) {
  return value.replace('\u0000', '');
}
