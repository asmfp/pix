// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getSession({
  sessionId,
  sessionRepository,
  supervisorAccessRepository
}: any) {
  const session = await sessionRepository.get(sessionId);
  const hasSupervisorAccess = await supervisorAccessRepository.sessionHasSupervisorAccess({ sessionId });
  return {
    session,
    hasSupervisorAccess,
  };
};
