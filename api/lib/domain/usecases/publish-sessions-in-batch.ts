// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'uuidv4'.
const { v4: uuidv4 } = require('uuid');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionPub... Remove this comment to see the full error message
const { SessionPublicationBatchResult } = require('../models/SessionPublicationBatchResult');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function publishSessionsInBatch({
  sessionIds,
  certificationRepository,
  finalizedSessionRepository,
  sessionPublicationService,
  sessionRepository,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  publishedAt = new Date(),
  batchId = uuidv4()
}: any) {
  const result = new SessionPublicationBatchResult(batchId);
  for (const sessionId of sessionIds) {
    try {
      await sessionPublicationService.publishSession({
        sessionId,
        certificationRepository,
        finalizedSessionRepository,
        sessionRepository,
        publishedAt,
      });
    } catch (error) {
      result.addPublicationError(sessionId, error);
    }
  }
  return result;
};
