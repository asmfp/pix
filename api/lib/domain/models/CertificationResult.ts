// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('./CompetenceMark');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertification = require('./PartnerCertification');
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
} = require('./Badge').keys;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'status'.
const status = {
  REJECTED: 'rejected',
  VALIDATED: 'validated',
  ERROR: 'error',
  CANCELLED: 'cancelled',
  STARTED: 'started',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationResult {
  birthdate: any;
  birthplace: any;
  commentForOrganization: any;
  competencesWithMark: any;
  createdAt: any;
  externalId: any;
  firstName: any;
  id: any;
  lastName: any;
  partnerCertifications: any;
  pixScore: any;
  sessionId: any;
  status: any;
  constructor({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status,
    pixScore,
    commentForOrganization,
    competencesWithMark,
    partnerCertifications
  }: any) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthplace = birthplace;
    this.birthdate = birthdate;
    this.externalId = externalId;
    this.createdAt = createdAt;
    this.sessionId = sessionId;
    this.status = status;
    this.pixScore = pixScore;
    this.commentForOrganization = commentForOrganization;
    this.competencesWithMark = competencesWithMark;
    this.partnerCertifications = partnerCertifications;
  }

  static from({
    certificationResultDTO
  }: any) {
    let certificationStatus;
    if (certificationResultDTO.isCancelled) {
      certificationStatus = status.CANCELLED;
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'STARTED' does not exist on type '{ REJEC... Remove this comment to see the full error message
      certificationStatus = certificationResultDTO?.assessmentResultStatus ?? status.STARTED;
    }
    const competenceMarkDTOs = _.compact(certificationResultDTO.competenceMarks);
    const competencesWithMark = _.map(
      competenceMarkDTOs,
      (competenceMarkDTO: any) => new CompetenceMark({
        ...competenceMarkDTO,
        area_code: competenceMarkDTO.area_code.toString(),
        competence_code: competenceMarkDTO.competence_code.toString(),
      })
    );
    const partnerCertifications = _.compact(certificationResultDTO.partnerCertifications).map(
      (partnerCertification: any) => new PartnerCertification(partnerCertification)
    );

    return new CertificationResult({
      id: certificationResultDTO.id,
      firstName: certificationResultDTO.firstName,
      lastName: certificationResultDTO.lastName,
      birthplace: certificationResultDTO.birthplace,
      birthdate: certificationResultDTO.birthdate,
      externalId: certificationResultDTO.externalId,
      createdAt: certificationResultDTO.createdAt,
      sessionId: certificationResultDTO.sessionId,
      status: certificationStatus,
      pixScore: certificationResultDTO.pixScore,
      commentForOrganization: certificationResultDTO.commentForOrganization,
      competencesWithMark,
      partnerCertifications,
    });
  }

  isCancelled() {
    return this.status === status.CANCELLED;
  }

  isValidated() {
    return this.status === status.VALIDATED;
  }

  isRejected() {
    return this.status === status.REJECTED;
  }

  isInError() {
    return this.status === status.ERROR;
  }

  isStarted() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'STARTED' does not exist on type '{ REJEC... Remove this comment to see the full error message
    return this.status === status.STARTED;
  }

  hasTakenClea() {
    return this.partnerCertifications.some(({
      partnerKey
    }: any) =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2].includes(partnerKey)
    );
  }

  hasAcquiredClea() {
    const cleaPartnerCertification = this.partnerCertifications.find(({
      partnerKey
    }: any) =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EMPLOI_CLEA, PIX_EMPLOI_CLEA_V2].includes(partnerKey)
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(cleaPartnerCertification?.acquired);
  }

  hasTakenPixPlusDroitMaitre() {
    return this.partnerCertifications.some(({
      partnerKey
    }: any) => partnerKey === PIX_DROIT_MAITRE_CERTIF);
  }

  hasAcquiredPixPlusDroitMaitre() {
    const pixPlusDroitMaitrePartnerCertification = this.partnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_DROIT_MAITRE_CERTIF
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(pixPlusDroitMaitrePartnerCertification?.acquired);
  }

  hasTakenPixPlusDroitExpert() {
    return this.partnerCertifications.some(({
      partnerKey
    }: any) => partnerKey === PIX_DROIT_EXPERT_CERTIF);
  }

  hasAcquiredPixPlusDroitExpert() {
    const pixPlusDroitExpertPartnerCertification = this.partnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_DROIT_EXPERT_CERTIF
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(pixPlusDroitExpertPartnerCertification?.acquired);
  }

  hasTakenPixPlusEduInitie() {
    return this.partnerCertifications.some(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE
    );
  }

  hasAcquiredPixPlusEduInitie() {
    const pixPlusEduInitiePartnerCertification = this.partnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(pixPlusEduInitiePartnerCertification?.acquired);
  }

  hasTakenPixPlusEduConfirme() {
    return this.partnerCertifications.some(({
      partnerKey
    }: any) =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(
        partnerKey
      )
    );
  }

  hasAcquiredPixPlusEduConfirme() {
    const pixPlusEduConfirmePartnerCertification = this.partnerCertifications.find(({
      partnerKey
    }: any) =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(
        partnerKey
      )
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(pixPlusEduConfirmePartnerCertification?.acquired);
  }

  hasTakenPixPlusEduAvance() {
    return this.partnerCertifications.some(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE
    );
  }

  hasAcquiredPixPlusEduAvance() {
    const pixPlusEduAvancePartnerCertification = this.partnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(pixPlusEduAvancePartnerCertification?.acquired);
  }

  hasTakenPixPlusEduExpert() {
    return this.partnerCertifications.some(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT
    );
  }

  hasAcquiredPixPlusEduExpert() {
    const pixPlusEduExpertPartnerCertification = this.partnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT
    );
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(pixPlusEduExpertPartnerCertification?.acquired);
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'typeof C... Remove this comment to see the full error message
CertificationResult.status = status;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationResult;
