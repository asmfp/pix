// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignAn... Remove this comment to see the full error message
const CampaignAnalysis = require('../../domain/read-models/CampaignAnalysis');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCampaignAnalysis(campaignId: any, targetProfileWithLearningContent: any, tutorials: any) {
    const userIdsAndSharedDates = await _getSharedParticipationsWithUserIdsAndDates(campaignId);
    const userIdsAndSharedDatesChunks = _.chunk(userIdsAndSharedDates, constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'unknown'... Remove this comment to see the full error message
    const participantCount = userIdsAndSharedDates.length;

    const campaignAnalysis = new CampaignAnalysis({
      campaignId,
      targetProfileWithLearningContent,
      tutorials,
      participantCount,
    });

    // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
    await bluebird.mapSeries(userIdsAndSharedDatesChunks, async (userIdsAndSharedDates: any) => {
      const knowledgeElementsByTube = await knowledgeElementRepository.findValidatedTargetedGroupedByTubes(
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        Object.fromEntries(userIdsAndSharedDates),
        targetProfileWithLearningContent
      );
      campaignAnalysis.addToTubeRecommendations({ knowledgeElementsByTube });
    });
    campaignAnalysis.finalize();
    return campaignAnalysis;
  },

  async getCampaignParticipationAnalysis(
    campaignId: any,
    campaignParticipation: any,
    targetProfileWithLearningContent: any,
    tutorials: any
  ) {
    const campaignAnalysis = new CampaignAnalysis({
      campaignId,
      targetProfileWithLearningContent,
      tutorials,
      participantCount: 1,
    });

    const knowledgeElementsByTube = await knowledgeElementRepository.findValidatedTargetedGroupedByTubes(
      { [campaignParticipation.userId]: campaignParticipation.sharedAt },
      targetProfileWithLearningContent
    );
    campaignAnalysis.addToTubeRecommendations({ knowledgeElementsByTube });

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    campaignAnalysis.finalize(1);
    return campaignAnalysis;
  },
};

async function _getSharedParticipationsWithUserIdsAndDates(campaignId: any) {
  const results = await knex('campaign-participations')
    .select('userId', 'sharedAt')
    .where({ campaignId, status: SHARED, isImproved: false });

  const userIdsAndDates = [];
  for (const result of results) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    userIdsAndDates.push([result.userId, result.sharedAt]);
  }

  return userIdsAndDates;
}
