// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  ACQUIRED: 'acquired',
  REJECTED: 'rejected',
  NOT_TAKEN: 'not_taken',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
class PixPlusDroitExpertCertificationResult {
  status: any;
  constructor({
    status
  }: any = {}) {
    this.status = status;
  }

  static buildFrom({
    acquired
  }: any) {
    return new PixPlusDroitExpertCertificationResult({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ACQUIRED' does not exist on type '{ DOWN... Remove this comment to see the full error message
      status: acquired ? statuses.ACQUIRED : statuses.REJECTED,
    });
  }

  static buildNotTaken() {
    return new PixPlusDroitExpertCertificationResult({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'NOT_TAKEN' does not exist on type '{ DOW... Remove this comment to see the full error message
      status: statuses.NOT_TAKEN,
    });
  }

  isTaken() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'NOT_TAKEN' does not exist on type '{ DOW... Remove this comment to see the full error message
    return this.status !== statuses.NOT_TAKEN;
  }

  isAcquired() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ACQUIRED' does not exist on type '{ DOWN... Remove this comment to see the full error message
    return this.status === statuses.ACQUIRED;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'statuses' does not exist on type 'typeof... Remove this comment to see the full error message
PixPlusDroitExpertCertificationResult.statuses = statuses;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PixPlusDroitExpertCertificationResult;
