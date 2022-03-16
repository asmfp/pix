// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAu... Remove this comment to see the full error message
const CampaignAuthorization = require('../../application/preHandlers/models/CampaignAuthorization');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getForCampaign({
    userId,
    campaignId
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'organizationId' does not exist on type '... Remove this comment to see the full error message
    const { organizationId, ownerId } = await _getOrganizationIdAndOwnerId({ campaignId });
    const organizationRole = await _getOrganizationRole({ userId, organizationId });

    let prescriberRole = organizationRole;
    if (userId === ownerId) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'prescriberRoles' does not exist on type ... Remove this comment to see the full error message
      prescriberRole = CampaignAuthorization.prescriberRoles.OWNER;
    }
    return prescriberRole;
  },
};

async function _getOrganizationIdAndOwnerId({
  campaignId
}: any) {
  const result = await knex('campaigns').select('organizationId', 'ownerId').where({ id: campaignId }).first();
  if (!result) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('Campaign is not found');
  }
  return result;
}

async function _getOrganizationRole({
  userId,
  organizationId
}: any) {
  const result = await knex('memberships')
    .select('organizationRole')
    .where({ userId, organizationId, disabledAt: null })
    .first();
  if (!result) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('Membership is not found');
  }
  return result.organizationRole;
}
