// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../models/CertificationIssueReport');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function saveCertificationIssueReport({
  userId,
  certificationIssueReportDTO,
  certificationCourseRepository,
  certificationIssueReportRepository,
  sessionAuthorizationService
}: any) {
  const certificationCourse = await certificationCourseRepository.get(
    certificationIssueReportDTO.certificationCourseId
  );

  const isAuthorized = await sessionAuthorizationService.isAuthorizedToAccessSession({
    userId,
    sessionId: certificationCourse.getSessionId(),
  });
  if (!isAuthorized) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('Erreur lors de la sauvegarde du signalement. Veuillez vous connecter et réessayer.');
  }

  const certificationIssueReport = CertificationIssueReport.create(certificationIssueReportDTO);
  return certificationIssueReportRepository.save(certificationIssueReport);
};
