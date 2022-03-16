// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationMemberIdentity {
  firstName: any;
  id: any;
  lastName: any;
  constructor({
    id,
    firstName,
    lastName
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationMemberIdentity;
