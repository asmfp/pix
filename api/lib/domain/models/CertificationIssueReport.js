const Joi = require('@hapi/joi');
const { InvalidCertificationIssueReportForSaving } = require('../errors');
const { CertificationIssueReportCategories } = require('./CertificationIssueReportCategory');

const certificationIssueReportValidationJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(...Object.values(CertificationIssueReportCategories)),
  description: Joi.string().allow(null).optional(),
});

class CertificationIssueReport {
  constructor(
    {
      id,
      certificationCourseId,
      category,
      description,

    } = {}) {
    this.id = id;
    this.certificationCourseId = certificationCourseId;
    this.category = category;
    this.description = description;
  }

  static new({
    id,
    certificationCourseId,
    category,
    description,
  }) {
    const certificationIssueReport = new CertificationIssueReport({
      id,
      certificationCourseId,
      category,
      description,
    });
    certificationIssueReport.validate();
    return certificationIssueReport;
  }

  validate() {
    const { error } = certificationIssueReportValidationJoiSchema.validate(this, { allowUnknown: true });
    if (error) {
      throw new InvalidCertificationIssueReportForSaving(error);
    }
  }
}

module.exports = CertificationIssueReport;