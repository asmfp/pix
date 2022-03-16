// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
class AccountRecoveryDemand {
  createdAt: any;
  id: any;
  newEmail: any;
  oldEmail: any;
  schoolingRegistrationId: any;
  temporaryKey: any;
  used: any;
  userId: any;
  constructor({
    id,
    userId,
    schoolingRegistrationId,
    oldEmail,
    newEmail,
    temporaryKey,
    used,
    createdAt
  }: any = {}) {
    this.id = id;
    this.schoolingRegistrationId = schoolingRegistrationId;
    this.userId = userId;
    this.oldEmail = oldEmail;
    this.newEmail = newEmail.toLowerCase();
    this.temporaryKey = temporaryKey;
    this.used = used;
    this.createdAt = createdAt;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AccountRecoveryDemand;
