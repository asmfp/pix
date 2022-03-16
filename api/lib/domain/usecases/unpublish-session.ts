// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function unpublishSession({
  sessionId,
  certificationRepository,
  sessionRepository,
  finalizedSessionRepository
}: any) {
  const session = await sessionRepository.getWithCertificationCandidates(sessionId);

  await certificationRepository.unpublishCertificationCoursesBySessionId(sessionId);

  session.publishedAt = null;

  await sessionRepository.updatePublishedAt({ id: sessionId, publishedAt: session.publishedAt });

  await _updateFinalizedSession(finalizedSessionRepository, sessionId);

  return sessionRepository.getWithCertificationCandidates(sessionId);
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _updateFinalizedSession(finalizedSessionRepository: any, sessionId: any) {
  const finalizedSession = await finalizedSessionRepository.get({ sessionId });
  finalizedSession.unpublish();
  await finalizedSessionRepository.save(finalizedSession);
}
