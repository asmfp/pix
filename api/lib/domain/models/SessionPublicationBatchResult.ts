// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionPub... Remove this comment to see the full error message
class SessionPublicationBatchResult {
  batchId: any;
  publicationErrors: any;
  constructor(batchId: any) {
    this.batchId = batchId;
    this.publicationErrors = {};
  }

  hasPublicationErrors() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(Object.keys(this.publicationErrors).length);
  }

  addPublicationError(sessionId: any, error: any) {
    this.publicationErrors[sessionId] = error;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  SessionPublicationBatchResult,
};
