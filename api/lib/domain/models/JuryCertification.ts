// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('./CompetenceMark');
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'status'.
const status = {
  CANCELLED: 'cancelled',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'partnerCer... Remove this comment to see the full error message
const partnerCertificationStatus = {
  ACQUIRED: 'acquired',
  REJECTED: 'rejected',
  NOT_TAKEN: 'not_taken',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
class JuryCertification {
  assessmentId: any;
  birthCountry: any;
  birthINSEECode: any;
  birthPostalCode: any;
  birthdate: any;
  birthplace: any;
  certificationCourseId: any;
  certificationIssueReports: any;
  commentForCandidate: any;
  commentForJury: any;
  commentForOrganization: any;
  competenceMarks: any;
  completedAt: any;
  createdAt: any;
  firstName: any;
  isPublished: any;
  juryId: any;
  lastName: any;
  partnerCertifications: any;
  pixScore: any;
  sessionId: any;
  sex: any;
  status: any;
  userId: any;
  constructor({
    certificationCourseId,
    sessionId,
    userId,
    assessmentId,
    firstName,
    lastName,
    birthdate,
    sex,
    birthplace,
    birthINSEECode,
    birthCountry,
    birthPostalCode,
    createdAt,
    completedAt,
    status,
    isPublished,
    juryId,
    pixScore,
    competenceMarks,
    commentForCandidate,
    commentForOrganization,
    commentForJury,
    certificationIssueReports,
    partnerCertifications
  }: any) {
    this.certificationCourseId = certificationCourseId;
    this.sessionId = sessionId;
    this.userId = userId;
    this.assessmentId = assessmentId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.sex = sex;
    this.birthplace = birthplace;
    this.birthINSEECode = birthINSEECode;
    this.birthCountry = birthCountry;
    this.birthPostalCode = birthPostalCode;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.status = status;
    this.isPublished = isPublished;
    this.juryId = juryId;
    this.pixScore = pixScore;
    this.competenceMarks = competenceMarks;
    this.commentForCandidate = commentForCandidate;
    this.commentForOrganization = commentForOrganization;
    this.commentForJury = commentForJury;
    this.certificationIssueReports = certificationIssueReports;
    this.partnerCertifications = partnerCertifications;
  }

  static from({
    juryCertificationDTO,
    certificationIssueReports,
    partnerCertifications
  }: any) {
    const competenceMarkDTOs = _.compact(juryCertificationDTO.competenceMarks).map(
      (competenceMarkDTO: any) => new CompetenceMark({
        ...competenceMarkDTO,
      })
    );

    return new JuryCertification({
      certificationCourseId: juryCertificationDTO.certificationCourseId,
      sessionId: juryCertificationDTO.sessionId,
      userId: juryCertificationDTO.userId,
      assessmentId: juryCertificationDTO.assessmentId,
      firstName: juryCertificationDTO.firstName,
      lastName: juryCertificationDTO.lastName,
      birthdate: juryCertificationDTO.birthdate,
      sex: juryCertificationDTO.sex,
      birthplace: juryCertificationDTO.birthplace,
      birthINSEECode: juryCertificationDTO.birthINSEECode,
      birthCountry: juryCertificationDTO.birthCountry,
      birthPostalCode: juryCertificationDTO.birthPostalCode,
      createdAt: juryCertificationDTO.createdAt,
      completedAt: juryCertificationDTO.completedAt,
      status: _getStatus(juryCertificationDTO.assessmentResultStatus, juryCertificationDTO.isCancelled),
      isPublished: juryCertificationDTO.isPublished,
      juryId: juryCertificationDTO.juryId,
      pixScore: juryCertificationDTO.pixScore,
      competenceMarks: competenceMarkDTOs,
      commentForCandidate: juryCertificationDTO.commentForCandidate,
      commentForOrganization: juryCertificationDTO.commentForOrganization,
      commentForJury: juryCertificationDTO.commentForJury,
      certificationIssueReports,
      partnerCertifications,
    });
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

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _getStatus(assessmentResultStatus: any, isCourseCancelled: any) {
  if (isCourseCancelled) return status.CANCELLED;
  return assessmentResultStatus;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = JuryCertification;
