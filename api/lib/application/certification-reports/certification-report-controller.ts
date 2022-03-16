// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationIssueReportSerializer = require('../../infrastructure/serializers/jsonapi/certification-issue-report-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async saveCertificationIssueReport(request: any, h: any) {
    const userId = request.auth.credentials.userId;
    const certificationIssueReportDTO = certificationIssueReportSerializer.deserialize(request);
    const certificationIssueReportSaved = await usecases.saveCertificationIssueReport({
      userId,
      certificationIssueReportDTO,
    });

    return h.response(certificationIssueReportSerializer.serialize(certificationIssueReportSaved)).created();
  },

  async abort(request: any, h: any) {
    const certificationCourseId = request.params.id;
    const abortReason = request.payload.data.reason;
    await usecases.abortCertificationCourse({ certificationCourseId, abortReason });
    return h.response().code(200);
  },
};
