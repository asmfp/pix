// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Uncancella... Remove this comment to see the full error message
const { UncancellableOrganizationInvitationError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function cancelOrganizationInvitation({
  organizationInvitationId,
  organizationInvitationRepository
}: any) {
  const foundOrganizationInvitation = await organizationInvitationRepository.get(organizationInvitationId);

  if (!foundOrganizationInvitation.isPending) {
    throw new UncancellableOrganizationInvitationError();
  }

  return await organizationInvitationRepository.markAsCancelled({ id: organizationInvitationId });
};
