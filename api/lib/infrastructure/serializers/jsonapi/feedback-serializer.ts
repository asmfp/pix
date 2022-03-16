// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Feedback = require('../../orm-models/Feedback');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(feedbacks: any) {
    return new Serializer('feedbacks', {
      attributes: ['createdAt', 'content', 'assessment', 'challenge'],
      assessment: { ref: 'id' },
      challenge: { ref: 'id' },
      transform(json: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const feedback = Object.assign({}, json);
        feedback.assessment = { id: json.assessmentId };
        feedback.challenge = { id: json.challengeId };
        return feedback;
      },
    }).serialize(feedbacks);
  },

  deserialize(json: any, userAgent: any) {
    return new Deserializer()
      .deserialize(json, function (err: any, feedback: any) {
        feedback.assessmentId = json.data.relationships.assessment.data.id;
        feedback.challengeId = json.data.relationships.challenge.data.id;
        feedback.userAgent = userAgent;
      })
      .then((deserializedFeedback: any) => {
        return new Feedback(deserializedFeedback);
      });
  },
};
