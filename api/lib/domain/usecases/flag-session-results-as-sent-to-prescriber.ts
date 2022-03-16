// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function flagSessionResultsAsSentToPrescriber({
  sessionId,
  sessionRepository
}: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const integerSessionId = parseInt(sessionId);
  const NOT_FOUND_SESSION = `La session ${sessionId} n'existe pas ou son accès est restreint lors du marquage d'envoi des résultats au prescripteur`;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
  if (!Number.isFinite(integerSessionId)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(NOT_FOUND_SESSION);
  }

  let session = await sessionRepository.get(sessionId);

  if (!session.areResultsFlaggedAsSent()) {
    session = await sessionRepository.flagResultsAsSentToPrescriber({
      id: sessionId,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      resultsSentToPrescriberAt: new Date(),
    });
    return { resultsFlaggedAsSent: true, session };
  }

  return { resultsFlaggedAsSent: false, session };
};
