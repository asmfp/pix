const cleaStatuses = {
  ACQUIRED: 'acquired',
  REJECTED: 'rejected',
  NOT_TAKEN: 'not_taken',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
class CleaCertificationResult {
  status: any;
  constructor({
    status
  }: any = {}) {
    this.status = status;
  }

  static buildFrom({
    acquired
  }: any) {
    return new CleaCertificationResult({
      status: acquired ? cleaStatuses.ACQUIRED : cleaStatuses.REJECTED,
    });
  }

  static buildNotTaken() {
    return new CleaCertificationResult({
      status: cleaStatuses.NOT_TAKEN,
    });
  }

  isTaken() {
    return this.status !== cleaStatuses.NOT_TAKEN;
  }

  isAcquired() {
    return this.status === cleaStatuses.ACQUIRED;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'cleaStatuses' does not exist on type 'ty... Remove this comment to see the full error message
CleaCertificationResult.cleaStatuses = cleaStatuses;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CleaCertificationResult;
