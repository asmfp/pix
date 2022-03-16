// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationEligibility {
  cleaCertificationEligible: any;
  id: any;
  pixCertificationEligible: any;
  pixPlusDroitExpertCertificationEligible: any;
  pixPlusDroitMaitreCertificationEligible: any;
  pixPlusEduAvanceCertificationEligible: any;
  pixPlusEduConfirmeCertificationEligible: any;
  pixPlusEduExpertCertificationEligible: any;
  pixPlusEduInitieCertificationEligible: any;
  constructor({
    id,
    pixCertificationEligible,
    cleaCertificationEligible,
    pixPlusDroitMaitreCertificationEligible,
    pixPlusDroitExpertCertificationEligible,
    pixPlusEduInitieCertificationEligible,
    pixPlusEduConfirmeCertificationEligible,
    pixPlusEduAvanceCertificationEligible,
    pixPlusEduExpertCertificationEligible
  }: any) {
    this.id = id;
    this.pixCertificationEligible = pixCertificationEligible;
    this.cleaCertificationEligible = cleaCertificationEligible;
    this.pixPlusDroitMaitreCertificationEligible = pixPlusDroitMaitreCertificationEligible;
    this.pixPlusDroitExpertCertificationEligible = pixPlusDroitExpertCertificationEligible;
    this.pixPlusEduInitieCertificationEligible = pixPlusEduInitieCertificationEligible;
    this.pixPlusEduConfirmeCertificationEligible = pixPlusEduConfirmeCertificationEligible;
    this.pixPlusEduAvanceCertificationEligible = pixPlusEduAvanceCertificationEligible;
    this.pixPlusEduExpertCertificationEligible = pixPlusEduExpertCertificationEligible;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationEligibility;
