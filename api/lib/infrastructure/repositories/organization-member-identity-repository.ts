// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationMemberIdentity = require('../../domain/models/OrganizationMemberIdentity');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findAllByOrganizationId({
    organizationId
  }: any) {
    const sortedMembers = await knex('users')
      .select('users.id', 'users.firstName', 'users.lastName')
      .join('memberships', 'memberships.userId', 'users.id')
      .where({ disabledAt: null, organizationId })
      .orderByRaw('LOWER("firstName") asc')
      .orderByRaw('LOWER("lastName") asc');

    return sortedMembers.map((sortedMember: any) => new OrganizationMemberIdentity({ ...sortedMember }));
  },
};
