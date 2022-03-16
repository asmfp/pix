// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertificationSummary = require('../../domain/read-models/JuryCertificationSummary');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertification = require('../../domain/models/PartnerCertification');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findBySessionId(sessionId: any) {
    const juryCertificationSummaryRows = await knex
      .with('certifications_every_assess_results', (qb: any) => {
        qb.select('certification-courses.*', 'assessment-results.pixScore')
          .select({
            assessmentResultStatus: 'assessment-results.status',
            assessmentState: 'assessments.state',
          })
          .select(
            knex.raw('ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ?? DESC) AS asr_row_number', [
              'certification-courses.id',
              'assessment-results.createdAt',
            ])
          )
          .select(
            knex.raw(
              `json_agg("partner-certifications".*) over (partition by "certification-courses".id) as "partnerCertifications"`
            )
          )
          .from('certification-courses')
          .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
          .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
          .leftJoin(
            'partner-certifications',
            'partner-certifications.certificationCourseId',
            'certification-courses.id'
          )
          .where('certification-courses.sessionId', sessionId);
      })
      .select('*')
      .from('certifications_every_assess_results')
      .where('asr_row_number', 1)
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC');

    const certificationCourseIds = juryCertificationSummaryRows.map((row: any) => row.id);
    const certificationIssueReportRows = await knex('certification-issue-reports').whereIn(
      'certificationCourseId',
      certificationCourseIds
    );

    const juryCertificationSummaryDTOs = _buildJuryCertificationSummaryDTOs(
      juryCertificationSummaryRows,
      certificationIssueReportRows
    );

    return _.map(juryCertificationSummaryDTOs, _toDomain);
  },
};

function _buildJuryCertificationSummaryDTOs(juryCertificationSummaryRows: any, certificationIssueReportRows: any) {
  return juryCertificationSummaryRows.map((juryCertificationSummaryRow: any) => {
    const matchingCertificationIssueReportRows = _.filter(certificationIssueReportRows, {
      certificationCourseId: juryCertificationSummaryRow.id,
    });
    return {
      ...juryCertificationSummaryRow,
      certificationIssueReports: matchingCertificationIssueReportRows.map((certificationIssueReportRow: any) => ({
        ...certificationIssueReportRow
      })),
    };
  });
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(juryCertificationSummaryDTO: any) {
  const certificationIssueReports = juryCertificationSummaryDTO.certificationIssueReports.map(
    (certificationIssueReportDTO: any) => {
      return new CertificationIssueReport(certificationIssueReportDTO);
    }
  );

  const partnerCertifications = _.compact(juryCertificationSummaryDTO.partnerCertifications).map(
    PartnerCertification.from
  );

  return new JuryCertificationSummary({
    ...juryCertificationSummaryDTO,
    status: juryCertificationSummaryDTO.assessmentResultStatus,
    isCourseCancelled: juryCertificationSummaryDTO.isCancelled,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    isEndedBySupervisor: juryCertificationSummaryDTO.assessmentState === Assessment.states.ENDED_BY_SUPERVISOR,
    certificationIssueReports,
    partnerCertifications,
  });
}
