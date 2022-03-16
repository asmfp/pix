// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingMembershipError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, AlreadyAcceptedOrCancelledOrganizationInvitationError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'roles'.
const { roles } = require('./Membership');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('./OrganizationInvitation');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationInvitedUser {
  currentMembershipId: any;
  currentRole: any;
  invitation: any;
  organizationHasMemberships: any;
  status: any;
  userId: any;
  constructor({
    userId,
    invitation,
    currentRole,
    organizationHasMemberships,
    currentMembershipId,
    status
  }: any = {}) {
    this.userId = userId;
    this.invitation = invitation;
    this.currentRole = currentRole;
    this.organizationHasMemberships = organizationHasMemberships;
    this.currentMembershipId = currentMembershipId;
    this.status = status;
  }

  acceptInvitation({
    code
  }: any) {
    if (code !== this.invitation.code) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Not found organization-invitation for ID ${this.invitation.id} and code ${code}`);
    }

    if (this.status !== 'pending') {
      throw new AlreadyAcceptedOrCancelledOrganizationInvitationError();
    }

    if (this.currentRole && !this.invitation.role) {
      throw new AlreadyExistingMembershipError(
        `User is already member of organisation ${this.invitation.organizationId}`
      );
    }

    this.currentRole = this.invitation.role || this._pickDefaultRole();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
    this.status = OrganizationInvitation.StatusType.ACCEPTED;
  }

  _pickDefaultRole() {
    return this.organizationHasMemberships ? roles.MEMBER : roles.ADMIN;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isAlreadyMemberOfOrganization() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.currentMembershipId);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationInvitedUser;
