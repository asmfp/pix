// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('./target-profile-with-learning-content-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResultMinimal = require('../../domain/read-models/campaign-results/CampaignAssessmentParticipationResultMinimal');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

async function findPaginatedByCampaignId({
  page = {},
  campaignId,
  filters = {}
}: any) {
  const targetProfile = await targetProfileRepository.getByCampaignId({ campaignId });
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'results' does not exist on type '{}'.
  const { results, pagination } = await _getResultListPaginated(campaignId, targetProfile, filters, page);

  const participations = await _buildCampaignAssessmentParticipationResultList(results);
  return {
    participations,
    pagination,
  };
}
async function _getResultListPaginated(campaignId: any, targetProfile: any, filters: any, page: any) {
  const query = _getParticipantsResultList(campaignId, targetProfile, filters);
  return fetchPage(query, page);
}

function _getParticipantsResultList(campaignId: any, targetProfile: any, filters: any) {
  return knex
    .with('campaign_participation_summaries', (qb: any) => _getParticipations(qb, campaignId, targetProfile, filters))
    .select('*')
    .from('campaign_participation_summaries')
    .modify(_filterByBadgeAcquisitionsOut, filters)
    .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName']);
}

function _getParticipations(qb: any, campaignId: any, targetProfile: any, filters: any) {
  qb.select(
    'schooling-registrations.firstName',
    'schooling-registrations.lastName',
    'campaign-participations.participantExternalId',
    'campaign-participations.masteryRate',
    'campaign-participations.id AS campaignParticipationId',
    'campaign-participations.userId'
  )
    .from('campaign-participations')
    .join('schooling-registrations', 'schooling-registrations.id', 'campaign-participations.schoolingRegistrationId')
    .where('campaign-participations.campaignId', '=', campaignId)
    .where('campaign-participations.status', '=', SHARED)
    .where('campaign-participations.isImproved', '=', false)
    .modify(_filterByDivisions, filters)
    .modify(_filterByGroups, filters)
    .modify(_addAcquiredBadgeids, filters)
    .modify(_filterByStage, targetProfile, filters);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _filterByDivisions(qb: any, filters: any) {
  if (filters.divisions) {
    const divisionsLowerCase = filters.divisions.map((division: any) => division.toLowerCase());
    qb.whereRaw('LOWER("schooling-registrations"."division") = ANY(:divisionsLowerCase)', { divisionsLowerCase });
  }
}

function _filterByGroups(qb: any, filters: any) {
  if (filters.groups) {
    const groupsLowerCase = filters.groups.map((group: any) => group.toLowerCase());
    qb.whereIn(knex.raw('LOWER("schooling-registrations"."group")'), groupsLowerCase);
  }
}

function _addAcquiredBadgeids(qb: any, filters: any) {
  if (filters.badges) {
    qb.select(knex.raw('ARRAY_AGG("badgeId") OVER (PARTITION BY "campaign-participations"."id") as badges_acquired'))
      .join('badge-acquisitions', 'badge-acquisitions.campaignParticipationId', 'campaign-participations.id')
      .distinct('campaign-participations.id');
  }
}

function _filterByBadgeAcquisitionsOut(qb: any, filters: any) {
  if (filters.badges) {
    qb.whereRaw(':badgeIds <@ "badges_acquired"', { badgeIds: filters.badges });
  }
}

function _filterByStage(qb: any, targetProfile: any, filters: any) {
  if (!filters.stages) return;

  const thresholdBoundaries = targetProfile.getThresholdBoundariesFromStages(filters.stages);
  const thresholdRateBoundaries = thresholdBoundaries.map((boundary: any) => ({
    id: boundary.id,
    from: boundary.from / 100,
    to: boundary.to / 100
  }));
  qb.where((builder: any) => {
    thresholdRateBoundaries.forEach((boundary: any) => {
      builder.orWhereBetween('campaign-participations.masteryRate', [boundary.from, boundary.to]);
    });
  });
}

async function _buildCampaignAssessmentParticipationResultList(results: any) {
  return await bluebird.mapSeries(results, async (result: any) => {
    const badges = await getAcquiredBadges(result.campaignParticipationId);

    return new CampaignAssessmentParticipationResultMinimal({
      ...result,
      badges,
    });
  });
}

async function getAcquiredBadges(campaignParticipationId: any) {
  return await knex('badge-acquisitions')
    .select(['badges.id AS id', 'title', 'altMessage', 'imageUrl'])
    .join('badges', 'badges.id', 'badge-acquisitions.badgeId')
    .where({ campaignParticipationId: campaignParticipationId });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findPaginatedByCampaignId,
};
