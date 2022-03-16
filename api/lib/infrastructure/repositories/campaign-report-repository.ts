// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignRe... Remove this comment to see the full error message
const CampaignReport = require('../../domain/read-models/CampaignReport');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForSpecifier = require('../../domain/read-models/campaign/TargetProfileForSpecifier');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDataS... Remove this comment to see the full error message
const skillDataSource = require('../datasources/learning-content/skill-datasource');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _setSearchFiltersForQueryBuilder(qb: any, {
  name,
  ongoing = true,
  ownerName,
  isOwnedByMe
}: any, userId: any) {
  if (name) {
    qb.whereRaw('LOWER("name") LIKE ?', `%${name.toLowerCase()}%`);
  }
  if (ongoing) {
    qb.whereNull('campaigns.archivedAt');
  } else {
    qb.whereNotNull('campaigns.archivedAt');
  }
  if (ownerName) {
    qb.whereRaw('(LOWER("users"."firstName") LIKE ? OR LOWER("users"."lastName") LIKE ?)', [
      `%${ownerName.toLowerCase()}%`,
      `%${ownerName.toLowerCase()}%`,
    ]);
  }
  if (isOwnedByMe) {
    qb.where('users.id', '=', userId);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    const result = await knex('campaigns')
      .select({
        id: 'campaigns.id',
        name: 'campaigns.name',
        code: 'campaigns.code',
        title: 'campaigns.title',
        idPixLabel: 'campaigns.idPixLabel',
        createdAt: 'campaigns.createdAt',
        customLandingPageText: 'campaigns.customLandingPageText',
        archivedAt: 'campaigns.archivedAt',
        type: 'campaigns.type',
        ownerId: 'users.id',
        ownerLastName: 'users.lastName',
        ownerFirstName: 'users.firstName',
        targetProfileId: 'target-profiles.id',
        targetProfileDescription: 'target-profiles.description',
        targetProfileName: 'target-profiles.name',
      })
      .select(
        knex.raw('ARRAY_AGG("skillId") AS "skillIds"'),
        knex.raw('ARRAY_AGG("badges"."id")  AS "badgeIds"'),
        knex.raw('ARRAY_AGG("stages"."id")  AS "stageIds"'),
        knex.raw(
          '(SELECT COUNT(*) from "campaign-participations" WHERE "campaign-participations"."campaignId" = "campaigns"."id" AND "campaign-participations"."isImproved" IS FALSE) AS "participationsCount"'
        ),
        knex.raw(
          '(SELECT COUNT(*) from "campaign-participations" WHERE "campaign-participations"."campaignId" = "campaigns"."id" AND "campaign-participations"."status" = \'SHARED\' AND "campaign-participations"."isImproved" IS FALSE) AS "sharedParticipationsCount"'
        )
      )
      .join('users', 'users.id', 'campaigns.ownerId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .leftJoin('badges', 'badges.targetProfileId', 'target-profiles.id')
      .leftJoin('stages', 'stages.targetProfileId', 'target-profiles.id')
      .leftJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'campaigns.targetProfileId')
      .where('campaigns.id', id)
      .groupBy('campaigns.id', 'users.id', 'target-profiles.id')
      .first();

    if (!result) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`La campagne d'id ${id} n'existe pas ou son accès est restreint`);
    }

    const skills = await skillDataSource.findByRecordIds(result.skillIds);

    const targetProfile = new TargetProfileForSpecifier({
      id: result.targetProfileId,
      name: result.targetProfileName,
      skills,
      thematicResults: _.uniq(result.badgeIds).filter((id: any) => id),
      hasStage: result.stageIds.some((stage: any) => stage),
      description: result.targetProfileDescription,
    });

    return new CampaignReport({ ...result, id, targetProfileForSpecifier: targetProfile });
  },

  async findMasteryRates(campaignId: any) {
    const results = await knex('campaign-participations')
      .select('masteryRate')
      .where('isImproved', false)
      .andWhere('status', SHARED)
      .andWhere({ campaignId });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    return results.map((result: any) => Number(result.masteryRate));
  },

  async findPaginatedFilteredByOrganizationId({
    organizationId,
    filter,
    page,
    userId
  }: any) {
    const query = knex('campaigns')
      .distinct('campaigns.id')
      .select(
        'campaigns.*',
        'users.id AS "ownerId"',
        'users.firstName AS ownerFirstName',
        'users.lastName AS ownerLastName',
        knex.raw(
          'COUNT(*) FILTER (WHERE "campaign-participations"."id" IS NOT NULL AND "campaign-participations"."isImproved" IS FALSE) OVER (partition by "campaigns"."id") AS "participationsCount"'
        ),
        knex.raw(
          'COUNT(*) FILTER (WHERE "campaign-participations"."id" IS NOT NULL AND "campaign-participations"."status" = \'SHARED\' AND "campaign-participations"."isImproved" IS FALSE) OVER (partition by "campaigns"."id") AS "sharedParticipationsCount"'
        )
      )
      .join('users', 'users.id', 'campaigns.ownerId')
      .leftJoin('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
      .where('campaigns.organizationId', organizationId)
      .modify(_setSearchFiltersForQueryBuilder, filter, userId)
      .orderBy('campaigns.createdAt', 'DESC');

    const { results, pagination } = await fetchPage(query, page);
    const atLeastOneCampaign = await knex('campaigns').select('id').where({ organizationId }).first(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    const hasCampaigns = Boolean(atLeastOneCampaign);

    const campaignReports = results.map((result: any) => new CampaignReport(result));
    return { models: campaignReports, meta: { ...pagination, hasCampaigns } };
  },
};
