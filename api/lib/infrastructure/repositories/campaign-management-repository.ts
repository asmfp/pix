// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignMa... Remove this comment to see the full error message
const CampaignManagement = require('../../domain/read-models/CampaignManagement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../domain/models/Campaign');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(campaignId: any) {
    let campaign = await knex('campaigns')
      .select({
        id: 'campaigns.id',
        code: 'campaigns.code',
        name: 'campaigns.name',
        idPixLabel: 'campaigns.idPixLabel',
        createdAt: 'campaigns.createdAt',
        archivedAt: 'campaigns.archivedAt',
        type: 'campaigns.type',
        creatorLastName: 'users.lastName',
        creatorFirstName: 'users.firstName',
        creatorId: 'users.id',
        organizationId: 'campaigns.organizationId',
        organizationName: 'organizations.name',
        targetProfileId: 'campaigns.targetProfileId',
        targetProfileName: 'target-profiles.name',
        title: 'campaigns.title',
        ownerId: 'ownerUser.id',
        ownerLastName: 'ownerUser.lastName',
        ownerFirstName: 'ownerUser.firstName',
        customLandingPageText: 'campaigns.customLandingPageText',
        customResultPageText: 'campaigns.customResultPageText',
        customResultPageButtonText: 'campaigns.customResultPageButtonText',
        customResultPageButtonUrl: 'campaigns.customResultPageButtonUrl',
        multipleSendings: 'campaigns.multipleSendings',
      })
      .join('users', 'users.id', 'campaigns.creatorId')
      .join('users AS ownerUser', 'ownerUser.id', 'campaigns.ownerId')
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .where('campaigns.id', campaignId)
      .first();

    const participationCountByStatus = await _countParticipationsByStatus(campaignId, campaign.type);
    // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
    campaign = { ...campaign, ...participationCountByStatus };
    const campaignManagement = new CampaignManagement(campaign);
    return campaignManagement;
  },

  async findPaginatedCampaignManagements({
    organizationId,
    page
  }: any) {
    const query = knex('campaigns')
      .select({
        id: 'campaigns.id',
        code: 'campaigns.code',
        name: 'campaigns.name',
        idPixLabel: 'campaigns.idPixLabel',
        createdAt: 'campaigns.createdAt',
        archivedAt: 'campaigns.archivedAt',
        type: 'campaigns.type',
        creatorLastName: 'creatorUser.lastName',
        creatorFirstName: 'creatorUser.firstName',
        creatorId: 'creatorUser.id',
        ownerId: 'ownerUser.id',
        ownerLastName: 'ownerUser.lastName',
        ownerFirstName: 'ownerUser.firstName',
      })
      .join('users AS creatorUser', 'creatorUser.id', 'campaigns.creatorId')
      .join('users AS ownerUser', 'ownerUser.id', 'campaigns.ownerId')
      .where('organizationId', organizationId)
      .orderBy('campaigns.createdAt', 'DESC');

    const { results, pagination } = await fetchPage(query, page);

    const campaignManagement = results.map((attributes: any) => new CampaignManagement(attributes));
    return { models: campaignManagement, meta: { ...pagination } };
  },

  update({
    campaignId,
    campaignAttributes
  }: any) {
    const editableAttributes = _.pick(campaignAttributes, [
      'name',
      'title',
      'customLandingPageText',
      'customResultPageText',
      'customResultPageButtonText',
      'customResultPageButtonUrl',
      'multipleSendings',
    ]);
    return knex('campaigns').where({ id: campaignId }).update(editableAttributes);
  },
};

async function _countParticipationsByStatus(campaignId: any, campaignType: any) {
  const row = await knex('campaign-participations')
    .select([
      knex.raw(`sum(case when status = ? then 1 else 0 end) as shared`, SHARED),
      knex.raw(`sum(case when status = ? then 1 else 0 end) as completed`, TO_SHARE),
      knex.raw(`sum(case when status = ? then 1 else 0 end) as started`, STARTED),
    ])
    .where({ campaignId, isImproved: false })
    .groupBy('campaignId')
    .first();

  return _mapToParticipationByStatus(row, campaignType);
}

function _mapToParticipationByStatus(row = {}, campaignType: any) {
  const participationByStatus = {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'shared' does not exist on type '{}'.
    shared: row.shared || 0,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type '{}'.
    completed: row.completed || 0,
  };
  if (campaignType === Campaign.types.ASSESSMENT) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'started' does not exist on type '{ share... Remove this comment to see the full error message
    participationByStatus.started = row.started || 0;
  }
  return participationByStatus;
}
