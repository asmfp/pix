// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Student'.
class Student {
  account: any;
  nationalStudentId: any;
  constructor({
    nationalStudentId,
    account
  }: any = {}) {
    this.nationalStudentId = nationalStudentId;
    this.account = account;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Student;
