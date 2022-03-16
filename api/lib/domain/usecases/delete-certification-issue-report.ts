// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deleteCertificationIssueReport({
  certificationIssueReportId,
  userId,
  certificationCourseRepository,
  certificationIssueReportRepository,
  sessionRepository,
  sessionAuthorizationService
}: any) {
  const certificationIssueReport = await certificationIssueReportRepository.get(certificationIssueReportId);

  const certificationCourse = await certificationCourseRepository.get(certificationIssueReport.certificationCourseId);

  const isAuthorized = await sessionAuthorizationService.isAuthorizedToAccessSession({
    userId,
    sessionId: certificationCourse.getSessionId(),
  });
  if (!isAuthorized) {
    throw new ForbiddenAccess('Certification issue report deletion forbidden');
  }
  const isFinalized = await sessionRepository.isFinalized(certificationCourse.getSessionId());
  if (isFinalized) {
    throw new ForbiddenAccess('Certification issue report deletion forbidden');
  }

  return certificationIssueReportRepository.delete(certificationIssueReportId);
};
