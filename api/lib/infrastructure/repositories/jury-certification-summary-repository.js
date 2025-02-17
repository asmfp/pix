const _ = require('lodash');
const { knex } = require('../bookshelf');
const JuryCertificationSummary = require('../../domain/read-models/JuryCertificationSummary');
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');
const PartnerCertification = require('../../domain/models/PartnerCertification');
const Assessment = require('../../domain/models/Assessment');

module.exports = {
  async findBySessionId(sessionId) {
    const juryCertificationSummaryRows = await knex
      .with('certifications_every_assess_results', (qb) => {
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

    const certificationCourseIds = juryCertificationSummaryRows.map((row) => row.id);
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

function _buildJuryCertificationSummaryDTOs(juryCertificationSummaryRows, certificationIssueReportRows) {
  return juryCertificationSummaryRows.map((juryCertificationSummaryRow) => {
    const matchingCertificationIssueReportRows = _.filter(certificationIssueReportRows, {
      certificationCourseId: juryCertificationSummaryRow.id,
    });
    return {
      ...juryCertificationSummaryRow,
      certificationIssueReports: matchingCertificationIssueReportRows.map((certificationIssueReportRow) => ({
        ...certificationIssueReportRow,
      })),
    };
  });
}

function _toDomain(juryCertificationSummaryDTO) {
  const certificationIssueReports = juryCertificationSummaryDTO.certificationIssueReports.map(
    (certificationIssueReportDTO) => {
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
    isEndedBySupervisor: juryCertificationSummaryDTO.assessmentState === Assessment.states.ENDED_BY_SUPERVISOR,
    certificationIssueReports,
    partnerCertifications,
  });
}
