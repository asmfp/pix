// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Group'.
const Group = require('../../domain/models/Group');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

async function findByCampaignId(campaignId: any) {
  const groups = await knex('campaigns')
    .where({ 'campaigns.id': campaignId })
    .select('group')
    .groupBy('group')
    .join('campaign-participations', 'campaigns.id', 'campaign-participations.campaignId')
    .join('schooling-registrations', function () {
      this.on('schooling-registrations.userId', '=', 'campaign-participations.userId').andOn(
        'schooling-registrations.organizationId',
        '=',
        'campaigns.organizationId'
      );
    });

  return groups.map(({
    group
  }: any) => _toDomain(group));
}

async function findByOrganizationId({
  organizationId
}: any) {
  const groupRows = await knex('schooling-registrations')
    .distinct('group')
    .where({ organizationId, isDisabled: false })
    .whereNotNull('group')
    .orderBy('group', 'asc');

  return groupRows.map(({
    group
  }: any) => _toDomain(group));
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(group: any) {
  return new Group({ name: group });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByCampaignId,
  findByOrganizationId,
};
