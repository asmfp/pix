// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../infrastructure/repositories/membership-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../domain/models/Membership');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute(userId: any, organizationId: any, type: any) {
    const memberships = await membershipRepository.findByUserIdAndOrganizationId({
      userId,
      organizationId,
      includeOrganization: true,
    });
    if (memberships.length === 0) {
      return false;
    }
    return memberships.some(
      (membership: any) => membership.organization.isManagingStudents &&
      membership.organization.type === type &&
      membership.organizationRole === Membership.roles.ADMIN
    );
  },
};
