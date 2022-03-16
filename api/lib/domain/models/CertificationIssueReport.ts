// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
  InvalidCertificationIssueReportForSaving,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Deprecated... Remove this comment to see the full error message
  DeprecatedCertificationIssueReportSubcategory,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
const {
  CertificationIssueReportCategories,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./CertificationIssueReportCategory');

const categoryOtherJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.OTHER),
  description: Joi.string().trim().required(),
});

const categoryLateOrLeavingJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.LATE_OR_LEAVING),
  description: Joi.string().when('subcategory', {
    switch: [
      { is: Joi.valid(CertificationIssueReportSubcategories.LEFT_EXAM_ROOM), then: Joi.string().trim().required() },
    ],
    otherwise: Joi.string().trim().optional(),
  }),
  subcategory: Joi.string()
    .required()
    .valid(CertificationIssueReportSubcategories.LEFT_EXAM_ROOM, CertificationIssueReportSubcategories.SIGNATURE_ISSUE),
});

const categoryCandidateInformationChangesJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES),
  description: Joi.string().trim().required(),
  subcategory: Joi.string()
    .required()
    .valid(
      CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
      CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE
    ),
});

const categoryInChallengeJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.IN_CHALLENGE),
  questionNumber: Joi.number().min(1).max(500).required(),
  subcategory: Joi.string()
    .required()
    .valid(
      CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
      CertificationIssueReportSubcategories.LINK_NOT_WORKING,
      CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
      CertificationIssueReportSubcategories.FILE_NOT_OPENING,
      CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
      CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
      CertificationIssueReportSubcategories.OTHER,
      CertificationIssueReportSubcategories.EXTRA_TIME_EXCEEDED,
      CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING
    ),
});

const categoryFraudJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.FRAUD),
});

const categoryTechnicalProblemJoiSchema = Joi.object({
  certificationCourseId: Joi.number().required().empty(null),
  category: Joi.string().required().valid(CertificationIssueReportCategories.TECHNICAL_PROBLEM),
  description: Joi.string().trim().required(),
});

const categorySchemas = {
  [CertificationIssueReportCategories.OTHER]: categoryOtherJoiSchema,
  [CertificationIssueReportCategories.LATE_OR_LEAVING]: categoryLateOrLeavingJoiSchema,
  [CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES]: categoryCandidateInformationChangesJoiSchema,
  [CertificationIssueReportCategories.IN_CHALLENGE]: categoryInChallengeJoiSchema,
  [CertificationIssueReportCategories.FRAUD]: categoryFraudJoiSchema,
  [CertificationIssueReportCategories.TECHNICAL_PROBLEM]: categoryTechnicalProblemJoiSchema,
};

const categoryCodeImpactful = [
  CertificationIssueReportCategories.TECHNICAL_PROBLEM,
  CertificationIssueReportCategories.OTHER,
  CertificationIssueReportCategories.FRAUD,
];

const subcategoryCodeImpactful = [
  CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
  CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
  CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
  CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
  CertificationIssueReportSubcategories.FILE_NOT_OPENING,
  CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
  CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
  CertificationIssueReportSubcategories.LINK_NOT_WORKING,
  CertificationIssueReportSubcategories.OTHER,
  CertificationIssueReportSubcategories.EXTRA_TIME_EXCEEDED,
  CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING,
];

const deprecatedSubcategories = [
  CertificationIssueReportSubcategories.LINK_NOT_WORKING,
  CertificationIssueReportSubcategories.OTHER,
];

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationIssueReport {
  category: any;
  certificationCourseId: any;
  description: any;
  id: any;
  isImpactful: any;
  questionNumber: any;
  resolution: any;
  resolvedAt: any;
  subcategory: any;
  constructor({
    id,
    certificationCourseId,
    category,
    description,
    subcategory,
    questionNumber,
    resolvedAt,
    resolution
  }: any = {}) {
    this.id = id;
    this.certificationCourseId = certificationCourseId;
    this.category = category;
    this.subcategory = subcategory;
    this.description = description;
    this.questionNumber = questionNumber;
    this.resolvedAt = resolvedAt;
    this.resolution = resolution;
    this.isImpactful = _isImpactful({ category, subcategory });

    if (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN, CertificationIssueReportCategories.OTHER].includes(
        this.category
      )
    ) {
      this.subcategory = null;
    }

    if (this.category === CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN) {
      this.description = null;
    }

    if (this.category !== CertificationIssueReportCategories.IN_CHALLENGE) {
      this.questionNumber = null;
    }
  }

  static create({
    id,
    certificationCourseId,
    category,
    description,
    subcategory,
    questionNumber
  }: any) {
    const certificationIssueReport = new CertificationIssueReport({
      id,
      certificationCourseId,
      category,
      description,
      subcategory,
      questionNumber,
      resolvedAt: null,
      resolution: null,
    });
    certificationIssueReport.validate();
    return certificationIssueReport;
  }

  validate() {
    const schemaToUse = categorySchemas[this.category];
    if (!schemaToUse) {
      throw new InvalidCertificationIssueReportForSaving(`Unknown category : ${this.category}`);
    }

    const { error } = schemaToUse.validate(this, { allowUnknown: true });
    if (error) {
      throw new InvalidCertificationIssueReportForSaving(error);
    }

    if (_isSubcategoryDeprecated(this.subcategory)) {
      throw new DeprecatedCertificationIssueReportSubcategory();
    }
  }

  isResolved() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.resolvedAt);
  }

  resolve(resolution: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    this.resolvedAt = new Date();
    this.resolution = resolution;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationIssueReport;

function _isImpactful({
  category,
  subcategory
}: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  return categoryCodeImpactful.includes(category) || subcategoryCodeImpactful.includes(subcategory);
}

function _isSubcategoryDeprecated(subcategory: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  return deprecatedSubcategories.includes(subcategory);
}
