// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Division'.
const Division = require('../../domain/models/Division');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function findByCampaignId(campaignId: any) {
  const divisions = await knex('campaigns')
    .where({ 'campaigns.id ': campaignId })
    .select('division')
    .groupBy('division')
    .join('campaign-participations', 'campaigns.id', 'campaign-participations.campaignId')
    .innerJoin('schooling-registrations', function () {
      this.on('schooling-registrations.userId', '=', 'campaign-participations.userId').andOn(
        'schooling-registrations.organizationId',
        '=',
        'campaigns.organizationId'
      );
    });

  return divisions.map(({
    division
  }: any) => _toDomain(division));
}

async function findByOrganizationIdForCurrentSchoolYear({
  organizationId
}: any) {
  const divisionRows = await knex('schooling-registrations')
    .distinct('division')
    .where({ organizationId, isDisabled: false })
    .whereNotNull('division')
    .orderBy('division', 'asc');

  return divisionRows.map(({
    division
  }: any) => _toDomain(division));
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(division: any) {
  return new Division({ name: division });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByCampaignId,
  findByOrganizationIdForCurrentSchoolYear,
};
