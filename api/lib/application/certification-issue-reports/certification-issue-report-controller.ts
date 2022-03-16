// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(7010) FIXME: 'deleteCertificationIssueReport', which lacks retu... Remove this comment to see the full error message
  async deleteCertificationIssueReport(request: any) {
    const userId = request.auth.credentials.userId;
    const certificationIssueReportId = request.params.id;
    await usecases.deleteCertificationIssueReport({
      certificationIssueReportId,
      userId,
    });

    return null;
  },

  async manuallyResolve(request: any, h: any) {
    const certificationIssueReportId = request.params.id;
    const resolution = request.payload.data.resolution;
    await usecases.manuallyResolveCertificationIssueReport({
      certificationIssueReportId,
      resolution,
    });

    return h.response().code(204);
  },
};
