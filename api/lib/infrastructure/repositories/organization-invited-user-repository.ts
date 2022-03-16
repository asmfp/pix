// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitedUser = require('../../domain/models/OrganizationInvitedUser');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    organizationInvitationId,
    email
  }: any) {
    const invitation = await knex('organization-invitations')
      .select('id', 'organizationId', 'code', 'role', 'status')
      .where({ id: organizationInvitationId })
      .first();
    if (!invitation) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Not found organization-invitation for ID ${organizationInvitationId}`);
    }

    const user = await knex('users').select('id').where({ email }).first();
    if (!user) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Not found user for email ${email}`);
    }

    const memberships = await knex('memberships')
      .select('id', 'userId', 'organizationRole')
      .where({
        organizationId: invitation.organizationId,
        disabledAt: null,
      })
      .orderBy('id', 'ASC');

    const existingMembership = memberships.find((membership: any) => membership.userId === user.id);

    return new OrganizationInvitedUser({
      userId: user.id,
      invitation,
      currentMembershipId: existingMembership?.id,
      currentRole: existingMembership?.organizationRole,
      organizationHasMemberships: memberships.length,
      status: invitation.status,
    });
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async save({
    organizationInvitedUser
  }: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    const date = new Date();

    if (organizationInvitedUser.isAlreadyMemberOfOrganization) {
      await knex('memberships')
        .update({
          organizationRole: organizationInvitedUser.currentRole,
          updatedAt: date,
        })
        .where({ id: organizationInvitedUser.currentMembershipId });
    } else {
      const [membershipId] = await knex('memberships').returning('id').insert({
        organizationRole: organizationInvitedUser.currentRole,
        organizationId: organizationInvitedUser.invitation.organizationId,
        userId: organizationInvitedUser.userId,
      });

      organizationInvitedUser.currentMembershipId = membershipId;
    }

    await knex('user-orga-settings')
      .insert({
        userId: organizationInvitedUser.userId,
        currentOrganizationId: organizationInvitedUser.invitation.organizationId,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
        updatedAt: new Date(),
      })
      .onConflict('userId')
      .merge();

    await knex('organization-invitations')
      .update({ status: organizationInvitedUser.status, updatedAt: date })
      .where({ id: organizationInvitedUser.invitation.id });
  },
};
