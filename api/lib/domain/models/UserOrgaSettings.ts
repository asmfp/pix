// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
class UserOrgaSettings {
  currentOrganization: any;
  id: any;
  user: any;
  constructor({
    id,
    currentOrganization,
    user
  }: any = {}) {
    this.id = id;
    this.currentOrganization = currentOrganization;
    this.user = user;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserOrgaSettings;
