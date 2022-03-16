// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoOrganiza... Remove this comment to see the full error message
const { NoOrganizationToAttach } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationsToAttachToTargetProfile {
  id: any;
  organizations: any;
  constructor({
    id
  }: any) {
    this.id = id;
  }

  attach(organizationIds: any) {
    if (_.isEmpty(organizationIds)) {
      throw new NoOrganizationToAttach(`Il n'y a aucune organisation à rattacher.`);
    }
    this.organizations = _.uniq(organizationIds);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationsToAttachToTargetProfile;
