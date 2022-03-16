// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const validationErrorSerializer = require('../../infrastructure/serializers/jsonapi/validation-error-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
const { extractUserIdFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  verify(request: any, h: any) {
    const userId = extractUserIdFromRequest(request);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    // eslint-disable-next-line no-restricted-syntax
    const assessmentId = parseInt(request.params.id);

    return assessmentRepository.getByAssessmentIdAndUserId(assessmentId, userId).catch(() => {
      const buildError = _handleWhenInvalidAuthorization('Vous n’êtes pas autorisé à accéder à cette évaluation');
      return h.response(validationErrorSerializer.serialize(buildError)).code(401).takeover();
    });
  },
};

function _handleWhenInvalidAuthorization(errorMessage: any) {
  return {
    data: {
      authorization: [errorMessage],
    },
  };
}
