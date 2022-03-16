// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
const { NoCertificationAttestationForDivisionError } = require('../../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findCertificationAttestationsForDivision({
  organizationId,
  division,
  certificationAttestationRepository
}: any) {
  const certificationAttestations =
    await certificationAttestationRepository.findByDivisionForScoIsManagingStudentsOrganization({
      organizationId,
      division,
    });

  if (certificationAttestations.length === 0) {
    throw new NoCertificationAttestationForDivisionError(division);
  }
  return certificationAttestations;
};
