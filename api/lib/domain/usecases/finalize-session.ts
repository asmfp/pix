// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionAlr... Remove this comment to see the full error message
const { SessionAlreadyFinalizedError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('../events/SessionFinalized');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function finalizeSession({
  sessionId,
  examinerGlobalComment,
  certificationReports,
  sessionRepository,
  certificationReportRepository
}: any) {
  const isSessionAlreadyFinalized = await sessionRepository.isFinalized(sessionId);

  if (isSessionAlreadyFinalized) {
    throw new SessionAlreadyFinalizedError('Cannot finalize session more than once');
  }

  certificationReports.forEach((certifReport: any) => certifReport.validateForFinalization());

  await certificationReportRepository.finalizeAll(certificationReports);

  const finalizedSession = await sessionRepository.finalize({
    id: sessionId,
    examinerGlobalComment,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    finalizedAt: new Date(),
  });

  return new SessionFinalized({
    sessionId,
    finalizedAt: finalizedSession.finalizedAt,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    hasExaminerGlobalComment: Boolean(examinerGlobalComment),
    certificationCenterName: finalizedSession.certificationCenter,
    sessionDate: finalizedSession.date,
    sessionTime: finalizedSession.time,
  });
};
