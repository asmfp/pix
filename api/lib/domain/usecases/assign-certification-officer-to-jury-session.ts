// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function assignCertificationOfficerToJurySession({
  sessionId,
  certificationOfficerId,
  jurySessionRepository,
  finalizedSessionRepository,
  certificationOfficerRepository
}: any = {}) {
  const certificationOfficer = await certificationOfficerRepository.get(certificationOfficerId);
  const finalizedSession = await finalizedSessionRepository.get({ sessionId });

  finalizedSession.assignCertificationOfficer({ certificationOfficerName: certificationOfficer.getFullName() });

  await finalizedSessionRepository.save(finalizedSession);

  return jurySessionRepository.assignCertificationOfficer({
    id: finalizedSession.sessionId,
    assignedCertificationOfficerId: certificationOfficer.id,
  });
};
