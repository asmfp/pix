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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const PIX_COUNT_BY_LEVEL = 8;
const COMPETENCE_COUNT = 16;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationAttestation {
  acquiredPartnerCertifications: any;
  birthdate: any;
  birthplace: any;
  certificationCenter: any;
  date: any;
  deliveredAt: any;
  firstName: any;
  id: any;
  isPublished: any;
  lastName: any;
  maxReachableLevelOnCertificationDate: any;
  maxReachableScore: any;
  pixScore: any;
  resultCompetenceTree: any;
  userId: any;
  verificationCode: any;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    acquiredPartnerCertifications,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.isPublished = isPublished;
    this.userId = userId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.acquiredPartnerCertifications = acquiredPartnerCertifications;
    this.resultCompetenceTree = resultCompetenceTree;
    this.verificationCode = verificationCode;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
    this.maxReachableScore = this.maxReachableLevelOnCertificationDate * PIX_COUNT_BY_LEVEL * COMPETENCE_COUNT;
  }

  setResultCompetenceTree(resultCompetenceTree: any) {
    this.resultCompetenceTree = resultCompetenceTree;
  }

  getAcquiredCleaCertification() {
    return this.acquiredPartnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_EMPLOI_CLEA || partnerKey === PIX_EMPLOI_CLEA_V2
    )?.partnerKey;
  }

  getAcquiredPixPlusDroitCertification() {
    return this.acquiredPartnerCertifications.find(
      ({
        partnerKey
      }: any) => partnerKey === PIX_DROIT_MAITRE_CERTIF || partnerKey === PIX_DROIT_EXPERT_CERTIF
    )?.partnerKey;
  }

  getAcquiredPixPlusEduCertification() {
    return (
      this._findByPartnerKeyOrTemporaryPartnerKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE) ||
      this._findByPartnerKeyOrTemporaryPartnerKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME) ||
      this._findByPartnerKeyOrTemporaryPartnerKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME) ||
      this._findByPartnerKeyOrTemporaryPartnerKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE) ||
      this._findByPartnerKeyOrTemporaryPartnerKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT)
    );
  }

  // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
  getPixPlusEduBadgeDisplayName() {
    const acquiredPixPlusEduCertification = this.getAcquiredPixPlusEduCertification();
    if (!acquiredPixPlusEduCertification) {
      return null;
    }

    const { partnerKey, temporaryPartnerKey } = acquiredPixPlusEduCertification;
    if (
      partnerKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE ||
      temporaryPartnerKey === PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE
    ) {
      return 'Initié (entrée dans le métier)';
    }
    if (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(
        partnerKey
      ) ||
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
      [PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME].includes(
        temporaryPartnerKey
      )
    ) {
      return 'Confirmé';
    }
    if (
      partnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE ||
      temporaryPartnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE
    ) {
      return 'Avancé';
    }
    if (
      partnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT ||
      temporaryPartnerKey === PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT
    ) {
      return 'Expert';
    }
  }

  hasAcquiredAnyComplementaryCertifications() {
    return this.acquiredPartnerCertifications.length > 0;
  }

  _findByPartnerKeyOrTemporaryPartnerKey(key: any) {
    return this.acquiredPartnerCertifications.find(
      ({
        partnerKey,
        temporaryPartnerKey
      }: any) => partnerKey === key || temporaryPartnerKey === key
    );
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationAttestation;
