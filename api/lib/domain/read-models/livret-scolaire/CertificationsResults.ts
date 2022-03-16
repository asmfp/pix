// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'CertificationsResults'.
class CertificationsResults {
  certifications: any;
  competences: any;
  constructor({
    certifications,
    competences
  }: any = {}) {
    this.certifications = certifications;
    this.competences = competences;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationsResults;
