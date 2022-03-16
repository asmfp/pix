// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function publishSession({
  sessionId,
  certificationRepository,
  finalizedSessionRepository,
  sessionRepository,
  sessionPublicationService,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
  publishedAt = new Date()
}: any) {
  await sessionPublicationService.publishSession({
    sessionId,
    certificationRepository,
    finalizedSessionRepository,
    sessionRepository,
    publishedAt,
  });

  return sessionRepository.get(sessionId);
};
