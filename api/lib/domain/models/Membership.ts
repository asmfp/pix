// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidMem... Remove this comment to see the full error message
const { InvalidMembershipOrganizationRoleError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'roles'.
const roles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
class Membership {
  id: any;
  organization: any;
  organizationRole: any;
  updatedByUserId: any;
  user: any;
  constructor({
    id,
    organizationRole = roles.MEMBER,
    updatedByUserId,
    organization,
    user
  }: any = {}) {
    this.id = id;
    this.organizationRole = organizationRole;
    this.updatedByUserId = updatedByUserId;
    this.organization = organization;
    this.user = user;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isAdmin() {
    return this.organizationRole === roles.ADMIN;
  }

  validateRole() {
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Object'. Did you mean 'isObject'... Remove this comment to see the full error message
    const isRoleValid = Object.values(roles).includes(this.organizationRole);
    if (!isRoleValid) {
      throw new InvalidMembershipOrganizationRoleError();
    }
  }
}

Membership.roles = roles;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Membership;
