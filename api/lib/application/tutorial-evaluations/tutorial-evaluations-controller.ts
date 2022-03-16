// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const tutorialEvaluationSerializer = require('../../infrastructure/serializers/jsonapi/tutorial-evaluation-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async evaluate(request: any, h: any) {
    const { userId } = request.auth.credentials;
    const { tutorialId } = request.params;

    const tutorialEvaluation = await usecases.addTutorialEvaluation({ userId, tutorialId });

    return h.response(tutorialEvaluationSerializer.serialize(tutorialEvaluation)).created();
  },
};
