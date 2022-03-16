// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function manuallyResolveCertificationIssueReport({
  certificationIssueReportId,
  resolution,
  certificationIssueReportRepository
}: any) {
  const certificationIssueReport = await certificationIssueReportRepository.get(certificationIssueReportId);
  certificationIssueReport.resolve(resolution);
  await certificationIssueReportRepository.save(certificationIssueReport);
};
