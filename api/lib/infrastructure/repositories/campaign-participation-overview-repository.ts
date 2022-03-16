// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../domain/models/Campaign');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationOverview = require('../../domain/read-models/CampaignParticipationOverview');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileWithLearningContentRepository = require('../../../lib/infrastructure/repositories/target-profile-with-learning-content-repository.js');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByUserIdWithFilters({
    userId,
    states,
    page
  }: any) {
    const queryBuilder = _findByUserId({ userId });

    if (states && states.length > 0) {
      _filterByStates(queryBuilder, states);
    }

    const { results, pagination } = await fetchPage(queryBuilder, page);

    const campaignParticipationOverviews = await _toReadModel(results);

    return {
      campaignParticipationOverviews,
      pagination,
    };
  },
};

function _findByUserId({
  userId
}: any) {
  return knex
    .with('campaign-participation-overviews', (qb: any) => {
      qb.select({
        id: 'campaign-participations.id',
        createdAt: 'campaign-participations.createdAt',
        status: 'campaign-participations.status',
        sharedAt: 'campaign-participations.sharedAt',
        masteryRate: 'campaign-participations.masteryRate',
        campaignCode: 'campaigns.code',
        campaignTitle: 'campaigns.title',
        targetProfileId: 'campaigns.targetProfileId',
        campaignArchivedAt: 'campaigns.archivedAt',
        organizationName: 'organizations.name',
        deletedAt: 'campaign-participations.deletedAt',
        participationState: _computeCampaignParticipationState(),
      })
        .from('campaign-participations')
        .innerJoin('campaigns', 'campaign-participations.campaignId', 'campaigns.id')
        .innerJoin('organizations', 'organizations.id', 'campaigns.organizationId')
        .where('campaign-participations.userId', userId)
        .where('campaign-participations.isImproved', false)
        .where('campaigns.type', Campaign.types.ASSESSMENT)
        .whereNot('campaigns.isForAbsoluteNovice', true);
    })
    .from('campaign-participation-overviews')
    .orderByRaw(_computeCampaignParticipationOrder())
    .orderByRaw(_sortEndedBySharedAt())
    .orderBy('createdAt', 'DESC');
}

function _computeCampaignParticipationState() {
  return knex.raw(
    `
  CASE
    WHEN campaigns."archivedAt" IS NOT NULL THEN 'DISABLED'
    WHEN "campaign-participations"."deletedAt" IS NOT NULL THEN 'DISABLED'
    WHEN "campaign-participations"."status" = ? THEN 'ONGOING'
    WHEN "campaign-participations"."status" = ? THEN 'ENDED'
    ELSE 'TO_SHARE'
  END`,
    [CampaignParticipationStatuses.STARTED, CampaignParticipationStatuses.SHARED]
  );
}

function _computeCampaignParticipationOrder() {
  return `
  CASE
    WHEN "participationState" = 'TO_SHARE' THEN 1
    WHEN "participationState" = 'ONGOING'  THEN 2
    WHEN "participationState" = 'ENDED'    THEN 3
    WHEN "participationState" = 'DISABLED' THEN 4
  END`;
}

function _sortEndedBySharedAt() {
  return `
  CASE
    WHEN "participationState" = 'ENDED' THEN "sharedAt"
    ELSE "createdAt"
  END DESC`;
}

function _filterByStates(queryBuilder: any, states: any) {
  queryBuilder.whereIn('participationState', states);
}

function _toReadModel(campaignParticipationOverviews: any) {
  return bluebird.mapSeries(campaignParticipationOverviews, async (data: any) => {
    let targetProfile;
    if (data.targetProfileId) {
      targetProfile = await targetProfileWithLearningContentRepository.get({ id: data.targetProfileId });
    }

    return new CampaignParticipationOverview({
      ...data,
      targetProfile,
    });
  });
}
