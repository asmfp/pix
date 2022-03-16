// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authorizeCertificationCandidateToStart({
  certificationCandidateForSupervisingId,
  authorizedToStart,
  certificationCandidateForSupervisingRepository
}: any) {
  await certificationCandidateForSupervisingRepository.update({
    id: certificationCandidateForSupervisingId,
    authorizedToStart,
  });
};
