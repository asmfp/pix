// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getSessionResultsByResultRecipientEmail({
  sessionId,
  resultRecipientEmail,
  sessionRepository,
  certificationResultRepository
}: any) {
  const session = await sessionRepository.getWithCertificationCandidates(sessionId);
  const certificationCandidateIdsForResultRecipient = _(session.certificationCandidates)
    .filter({ resultRecipientEmail })
    .map('id')
    .value();

  const certificationResults = await certificationResultRepository.findByCertificationCandidateIds({
    certificationCandidateIds: certificationCandidateIdsForResultRecipient,
  });

  return { session, certificationResults };
};
