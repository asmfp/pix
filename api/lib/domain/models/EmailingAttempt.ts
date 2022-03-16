// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class EmailingAttempt {
  recipientEmail: any;
  status: any;
  constructor(recipientEmail: any, status: any) {
    this.recipientEmail = recipientEmail;
    this.status = status;
  }

  hasFailed() {
    return this.status === AttemptStatus.FAILURE;
  }

  hasSucceeded() {
    return this.status === AttemptStatus.SUCCESS;
  }

  static success(recipientEmail: any) {
    return new EmailingAttempt(recipientEmail, AttemptStatus.SUCCESS);
  }

  static failure(recipientEmail: any) {
    return new EmailingAttempt(recipientEmail, AttemptStatus.FAILURE);
  }
};

const AttemptStatus = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};
