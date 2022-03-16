// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'chunk'.
const chunk = require('lodash/chunk');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../domain/services/placement-profile-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionParticipationSummary = require('../../domain/read-models/CampaignProfilesCollectionParticipationSummary');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../infrastructure/repositories/competence-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');

const CampaignProfilesCollectionParticipationSummaryRepository = {
  async findPaginatedByCampaignId(campaignId: any, page: any, filters = {}) {
    const query = knex
      .select(
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.userId AS userId',
        knex.raw('LOWER("schooling-registrations"."firstName") AS "lowerFirstName"'),
        knex.raw('LOWER("schooling-registrations"."lastName") AS "lowerLastName"'),
        'schooling-registrations.firstName AS firstName',
        'schooling-registrations.lastName AS lastName',
        'campaign-participations.participantExternalId',
        'campaign-participations.sharedAt',
        'campaign-participations.pixScore AS pixScore'
      )
      .from('campaign-participations')
      .join('schooling-registrations', 'schooling-registrations.id', 'campaign-participations.schoolingRegistrationId')
      .where('campaign-participations.campaignId', '=', campaignId)
      .where('campaign-participations.isImproved', '=', false)
      .whereRaw('"campaign-participations"."sharedAt" IS NOT NULL')
      .orderByRaw('?? ASC, ?? ASC', ['lowerLastName', 'lowerFirstName'])
      .modify(_filterQuery, filters);

    const { results, pagination } = await fetchPage(query, page);

    const getPlacementProfileForUser = await _makeMemoizedGetPlacementProfileForUser(results);

    const data = results.map((result: any) => {
      if (!result.sharedAt) {
        return new CampaignProfilesCollectionParticipationSummary(result);
      }

      const placementProfile = getPlacementProfileForUser(result.userId);

      return new CampaignProfilesCollectionParticipationSummary({
        ...result,
        certifiable: placementProfile.isCertifiable(),
        certifiableCompetencesCount: placementProfile.getCertifiableCompetencesCount(),
      });
    });

    return { data, pagination };
  },
};

async function _makeMemoizedGetPlacementProfileForUser(results: any) {
  const competences = await competenceRepository.listPixCompetencesOnly();

  const sharedResults = results.filter(({
    sharedAt
  }: any) => sharedAt);

  const sharedResultsChunks = await bluebird.mapSeries(
    chunk(sharedResults, constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING),
    (sharedResultsChunk: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
      const sharedAtDatesByUsers = Object.fromEntries(
        sharedResultsChunk.map(({
          userId,
          sharedAt
        }: any) => [userId, sharedAt])
      );
      return placementProfileService.getPlacementProfilesWithSnapshotting({
        userIdsAndDates: sharedAtDatesByUsers,
        allowExcessPixAndLevels: false,
        competences,
      });
    }
  );

  const placementProfiles = sharedResultsChunks.flat();

  return (userId: any) => placementProfiles.find((placementProfile: any) => placementProfile.userId === userId);
}

function _filterQuery(qb: any, filters: any) {
  if (filters.divisions) {
    const divisionsLowerCase = filters.divisions.map((division: any) => division.toLowerCase());
    qb.whereRaw('LOWER("schooling-registrations"."division") = ANY(:divisionsLowerCase)', { divisionsLowerCase });
  }
  if (filters.groups) {
    const groupsLowerCase = filters.groups.map((group: any) => group.toLowerCase());
    qb.whereIn(knex.raw('LOWER("schooling-registrations"."group")'), groupsLowerCase);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfilesCollectionParticipationSummaryRepository;
