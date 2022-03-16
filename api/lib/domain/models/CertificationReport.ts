// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
const { InvalidCertificationReportForFinalization } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NO_EXAMINE... Remove this comment to see the full error message
const NO_EXAMINER_COMMENT = null;

const certificationReportSchemaForFinalization = Joi.object({
  id: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  certificationCourseId: Joi.number().required(),
  examinerComment: Joi.string().max(500).allow(null).optional(),
  certificationIssueReports: Joi.array().required(),
  hasSeenEndTestScreen: Joi.boolean().required(),
  isCompleted: Joi.boolean().required(),
  abortReason: Joi.string().allow(null),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationReport {
  abortReason: any;
  certificationCourseId: any;
  certificationIssueReports: any;
  examinerComment: any;
  firstName: any;
  hasSeenEndTestScreen: any;
  id: any;
  isCompleted: any;
  lastName: any;
  constructor({
    firstName,
    lastName,
    examinerComment,
    hasSeenEndTestScreen,
    certificationIssueReports = [],
    certificationCourseId,
    isCompleted,
    abortReason
  }: any = {}) {
    this.id = CertificationReport.idFromCertificationCourseId(certificationCourseId);
    this.firstName = firstName;
    this.lastName = lastName;
    this.hasSeenEndTestScreen = hasSeenEndTestScreen;
    this.certificationIssueReports = certificationIssueReports;
    this.certificationCourseId = certificationCourseId;
    this.isCompleted = isCompleted;
    this.examinerComment = examinerComment;
    if (_.isEmpty(_.trim(this.examinerComment))) {
      this.examinerComment = NO_EXAMINER_COMMENT;
    }
    this.abortReason = abortReason;
  }

  validateForFinalization() {
    const { error } = certificationReportSchemaForFinalization.validate(this);

    if (error) {
      throw new InvalidCertificationReportForFinalization(error);
    }

    if (!this.isCompleted && !this.abortReason) {
      throw new InvalidCertificationReportForFinalization(
        'Abort reason is required if certificationReport is not completed'
      );
    }
  }

  static fromCertificationCourse(certificationCourse: any) {
    const certificationCourseDTO = certificationCourse.toDTO();
    return new CertificationReport({
      certificationCourseId: certificationCourseDTO.id,
      firstName: certificationCourseDTO.firstName,
      lastName: certificationCourseDTO.lastName,
      certificationIssueReports: certificationCourseDTO.certificationIssueReports,
      hasSeenEndTestScreen: certificationCourseDTO.hasSeenEndTestScreen,
      isCompleted: certificationCourseDTO.assessment.isCompleted(),
      abortReason: certificationCourseDTO.abortReason,
    });
  }

  static idFromCertificationCourseId(certificationCourseId: any) {
    return `CertificationReport:${certificationCourseId}`;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationReport;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.NO_EXAMINER_COMMENT = NO_EXAMINER_COMMENT;
