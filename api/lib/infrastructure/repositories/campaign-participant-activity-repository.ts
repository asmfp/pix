// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipantActivity = require('../../domain/read-models/CampaignParticipantActivity');

const campaignParticipantActivityRepository = {
  async findPaginatedByCampaignId({
    page = { size: 25 },
    campaignId,
    filters = {}
  }: any) {
    const pagination = await getPagination(campaignId, filters, page);
    const results = await _buildParticipationsPage(knex, campaignId, filters, pagination);

    const campaignParticipantsActivities = results.map((result: any) => {
      return new CampaignParticipantActivity(result);
    });

    return {
      campaignParticipantsActivities,
      pagination,
    };
  },
};

function _buildCampaignParticipationByParticipant(qb: any, campaignId: any, filters: any) {
  qb.select(
    'campaign-participations.id AS campaignParticipationId',
    'campaign-participations.userId',
    'schooling-registrations.firstName',
    'schooling-registrations.lastName',
    'campaign-participations.participantExternalId',
    'campaign-participations.sharedAt',
    'campaign-participations.status',
    'campaigns.type AS campaignType'
  )
    .from('campaign-participations')
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .join('schooling-registrations', 'schooling-registrations.id', 'campaign-participations.schoolingRegistrationId')
    .where('campaign-participations.campaignId', '=', campaignId)
    .where('campaign-participations.isImproved', '=', false)
    .modify(_filterByDivisions, filters)
    .modify(_filterByStatus, filters)
    .modify(_filterByGroup, filters);
}

function _buildPaginationQuery(queryBuilder: any, campaignId: any, filters: any) {
  return queryBuilder
    .select('campaign-participations.id')
    .from('campaign-participations')
    .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
    .leftJoin('schooling-registrations', function () {
      this.on({ 'campaign-participations.userId': 'schooling-registrations.userId' }).andOn({
        'campaigns.organizationId': 'schooling-registrations.organizationId',
      });
    })
    .where('campaign-participations.campaignId', '=', campaignId)
    .where('campaign-participations.isImproved', '=', false)
    .modify(_filterByDivisions, filters)
    .modify(_filterByStatus, filters)
    .modify(_filterByGroup, filters);
}

function _filterByDivisions(qb: any, filters: any) {
  if (filters.divisions) {
    const divisionsLowerCase = filters.divisions.map((division: any) => division.toLowerCase());
    qb.whereRaw('LOWER("schooling-registrations"."division") = ANY(:divisionsLowerCase)', { divisionsLowerCase });
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _filterByStatus(qb: any, filters: any) {
  if (filters.status) {
    qb.where('campaign-participations.status', filters.status);
  }
}
function _filterByGroup(qb: any, filters: any) {
  if (filters.groups) {
    const groupsLowerCase = filters.groups.map((group: any) => group.toLowerCase());
    qb.whereIn(knex.raw('LOWER("schooling-registrations"."group")'), groupsLowerCase);
  }
}

function _buildParticipationsPage(queryBuilder: any, campaignId: any, filters: any, {
  page,
  pageSize
}: any) {
  const offset = (page - 1) * pageSize;

  return queryBuilder
    .with('campaign_participants_activities_ordered', (qb: any) => _buildCampaignParticipationByParticipant(qb, campaignId, filters)
    )
    .from('campaign_participants_activities_ordered')
    .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName'])
    .limit(pageSize)
    .offset(offset);
}

async function getPagination(campaignId: any, filters: any, { number = 1, size = 10 } = {}) {
  const page = number < 1 ? 1 : number;

  const query = _buildPaginationQuery(knex, campaignId, filters);
  const { rowCount } = await knex.count('*', { as: 'rowCount' }).from(query.as('query_all_results')).first();

  return {
    page,
    pageSize: size,
    rowCount,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    pageCount: Math.ceil(rowCount / size),
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = campaignParticipantActivityRepository;
