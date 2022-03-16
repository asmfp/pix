// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sessionVal... Remove this comment to see the full error message
const sessionValidator = require('../validators/session-validator');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionCodeService = require('../services/session-code-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Session'.
const Session = require('../models/Session');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createSession({
  userId,
  session,
  certificationCenterRepository,
  sessionRepository,
  userRepository
}: any) {
  sessionValidator.validate(session);

  const certificationCenterId = session.certificationCenterId;
  const userWithCertifCenters = await userRepository.getWithCertificationCenterMemberships(userId);
  if (!userWithCertifCenters.hasAccessToCertificationCenter(certificationCenterId)) {
    throw new ForbiddenAccess(
      "L'utilisateur n'est pas membre du centre de certification dans lequel il souhaite créer une session"
    );
  }

  const accessCode = await sessionCodeService.getNewSessionCode();
  const { name: certificationCenter } = await certificationCenterRepository.get(certificationCenterId);
  const domainSession = new Session({
    ...session,
    accessCode,
    certificationCenter,
  });

  domainSession.generateSupervisorPassword();

  return sessionRepository.save(domainSession);
};
