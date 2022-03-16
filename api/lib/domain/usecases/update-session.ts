// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../validators/session-validator');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateSession({
  session,
  sessionRepository
}: any) {
  sessionValidator.validate(session);
  const sessionToUpdate = await sessionRepository.get(session.id);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  Object.assign(sessionToUpdate, session);

  return sessionRepository.updateSessionInfo(sessionToUpdate);
};
