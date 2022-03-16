// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('../models/AssessmentResult');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/Badge').keys;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STARTED'.
const STARTED = 'started';
const CANCELLED = 'cancelled';
const ENDED_BY_SUPERVISOR = 'endedBySupervisor';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partnerCer... Remove this comment to see the full error message
const partnerCertificationStatus = {
  ACQUIRED: 'acquired',
  REJECTED: 'rejected',
  NOT_TAKEN: 'not_taken',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
class JuryCertificationSummary {
  certificationIssueReports: any;
  completedAt: any;
  createdAt: any;
  firstName: any;
  hasSeenEndTestScreen: any;
  id: any;
  isFlaggedAborted: any;
  isPublished: any;
  lastName: any;
  partnerCertifications: any;
  pixScore: any;
  status: any;
  constructor({
    id,
    firstName,
    lastName,
    status,
    pixScore,
    createdAt,
    completedAt,
    abortReason,
    isPublished,
    isCourseCancelled,
    isEndedBySupervisor,
    hasSeenEndTestScreen,
    partnerCertifications,
    certificationIssueReports
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = _getStatus(status, isCourseCancelled, isEndedBySupervisor);
    this.pixScore = pixScore;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    this.isFlaggedAborted = Boolean(abortReason) && !completedAt;
    this.partnerCertifications = partnerCertifications;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isPublished = isPublished;
    this.hasSeenEndTestScreen = hasSeenEndTestScreen;
    this.certificationIssueReports = certificationIssueReports;
  }

  isActionRequired() {
    return this.certificationIssueReports.some((issueReport: any) => issueReport.isImpactful && !issueReport.isResolved());
  }

  hasScoringError() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
    return this.status === JuryCertificationSummary.statuses.ERROR;
  }

  hasCompletedAssessment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
    return this.status !== JuryCertificationSummary.statuses.STARTED;
  }

  getCleaCertificationStatus() {
    return this._getStatusFromPartnerCertification([PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2]);
  }

  getPixPlusDroitMaitreCertificationStatus() {
    return this._getStatusFromPartnerCertification([PIX_DROIT_MAITRE_CERTIF]);
  }

  getPixPlusDroitExpertCertificationStatus() {
    return this._getStatusFromPartnerCertification([PIX_DROIT_EXPERT_CERTIF]);
  }

  getPixPlusEduInitieCertificationStatus() {
    return this._getStatusFromPartnerCertification([PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE]);
  }

  getPixPlusEduConfirmeCertificationStatus() {
    return this._getStatusFromPartnerCertification([
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    ]);
  }

  getPixPlusEduAvanceCertificationStatus() {
    return this._getStatusFromPartnerCertification([PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE]);
  }

  getPixPlusEduExpertCertificationStatus() {
    return this._getStatusFromPartnerCertification([PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT]);
  }

  _getStatusFromPartnerCertification(partnerCertificationKeys: any) {
    const partnerCertification = this.partnerCertifications.find(({
      partnerKey
    }: any) =>
      partnerCertificationKeys.includes(partnerKey)
    );
    if (!partnerCertification) {
      return partnerCertificationStatus.NOT_TAKEN;
    }
    return partnerCertification.acquired ? partnerCertificationStatus.ACQUIRED : partnerCertificationStatus.REJECTED;
  }
}

function _getStatus(status: any, isCourseCancelled: any, isEndedBySupervisor: any) {
  if (isCourseCancelled) {
    return CANCELLED;
  }

  if (isEndedBySupervisor) {
    return ENDED_BY_SUPERVISOR;
  }

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  if (!Object.values(assessmentResultStatuses).includes(status)) {
    return STARTED;
  }

  return status;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JuryCertificationSummary;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.statuses = { ...assessmentResultStatuses, STARTED, ENDED_BY_SUPERVISOR };
