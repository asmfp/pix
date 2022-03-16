// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../http-errors');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionAuthorizationService = require('../../domain/services/session-authorization-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../infrastructure/repositories/certification-course-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async verify(request: any) {
    const userId = request.auth.credentials.userId;
    const certificationCourseId = request.params.id;

    const certificationCourse = await certificationCourseRepository.get(certificationCourseId);

    const isAuthorized = await sessionAuthorizationService.isAuthorizedToAccessSession({
      userId,
      sessionId: certificationCourse.getSessionId(),
    });

    if (!isAuthorized) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError("La session n'existe pas ou son accès est restreint");
    }

    return isAuthorized;
  },
};
