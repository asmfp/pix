// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
class EmailModificationDemand {
  code: any;
  newEmail: any;
  constructor({
    code,
    newEmail
  }: any = {}) {
    this.code = code;
    this.newEmail = newEmail;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = EmailModificationDemand;
