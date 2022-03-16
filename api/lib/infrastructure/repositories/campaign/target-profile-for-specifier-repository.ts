// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDataS... Remove this comment to see the full error message
const skillDataSource = require('../../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForSpecifier = require('../../../domain/read-models/campaign/TargetProfileForSpecifier');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

async function availableForOrganization(organizationId: any) {
  const targetProfileRows = await _fetchTargetProfiles(organizationId);

  return bluebird.mapSeries(targetProfileRows, _buildTargetProfileForSpecifier);
}

function _fetchTargetProfiles(organizationId: any) {
  return knex('target-profiles')
    .select([
      'target-profiles.id',
      'target-profiles.name',
      'target-profiles.description',
      'target-profiles.category',
      knex.raw('ARRAY_AGG("skillId") AS "skillIds"'),
      knex.raw('ARRAY_AGG("badges"."id")  AS "badgeIds"'),
      knex.raw('ARRAY_AGG("stages"."id")  AS "stageIds"'),
    ])
    .leftJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id')
    .leftJoin('badges', 'badges.targetProfileId', 'target-profiles.id')
    .leftJoin('stages', 'stages.targetProfileId', 'target-profiles.id')
    .leftJoin('target-profile-shares', 'target-profile-shares.targetProfileId', 'target-profiles.id')
    .where({ outdated: false })
    .where((qb: any) => {
      qb.orWhere({ isPublic: true });
      qb.orWhere({ ownerOrganizationId: organizationId });
      qb.orWhere({ organizationId });
    })
    .groupBy('target-profiles.id');
}

async function _buildTargetProfileForSpecifier(row: any) {
  const skills = await skillDataSource.findByRecordIds(row.skillIds);
  const thematicResultsIds = _.uniq(row.badgeIds).filter((id: any) => id);
  const hasStage = row.stageIds.some((stage: any) => stage);
  return new TargetProfileForSpecifier({
    id: row.id,
    name: row.name,
    skills,
    thematicResults: thematicResultsIds,
    hasStage,
    description: row.description,
    category: row.category,
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  availableForOrganization,
};
