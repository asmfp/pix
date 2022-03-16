// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const courseSerializer = require('../../infrastructure/serializers/jsonapi/course-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const courseService = require('../../../lib/domain/services/course-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
const { extractUserIdFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: any) {
    const courseId = request.params.id;
    const userId = extractUserIdFromRequest(request);

    return courseService.getCourse({ courseId, userId }).then(courseSerializer.serialize);
  },
};
