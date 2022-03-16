// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../http-errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../infrastructure/repositories/certification-course-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../infrastructure/repositories/sessions/session-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.verifySessionAuthorization = async (request: any) => {
  const userId = request.auth.credentials.userId;
  const sessionId = request.params.id;

  return await _isAuthorizedToAccessSession({ userId, sessionId });
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.verifyCertificationSessionAuthorization = async (request: any) => {
  const userId = request.auth.credentials.userId;
  const certificationCourseId = request.params.id;

  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);

  return await _isAuthorizedToAccessSession({ userId, sessionId: certificationCourse.getSessionId() });
};

async function _isAuthorizedToAccessSession({
  userId,
  sessionId
}: any) {
  const hasMembershipAccess = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
    userId,
    sessionId
  );

  if (!hasMembershipAccess) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError("La session n'existe pas ou son accès est restreint");
  }

  return hasMembershipAccess;
}
