// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCpfCountry {
  code: any;
  commonName: any;
  id: any;
  matcher: any;
  originalName: any;
  constructor({
    id,
    code,
    commonName,
    originalName,
    matcher
  }: any = {}) {
    this.id = id;
    this.code = code;
    this.commonName = commonName;
    this.originalName = originalName;
    this.matcher = matcher;
  }

  isFrance() {
    return this.code === '99100';
  }

  isForeign() {
    return this.code !== '99100';
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCpfCountry;
