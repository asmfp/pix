// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

const CampaignParticipationsStatsRepository = {
  async getParticipationsActivityByDate(campaignId: any) {
    // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    const [startedParticipations, sharedParticipations] = await Promise.all([
      _getCumulativeParticipationCountsByDay(campaignId, 'createdAt'),
      _getCumulativeParticipationCountsByDay(campaignId, 'sharedAt'),
    ]);
    return { startedParticipations, sharedParticipations };
  },

  async countParticipationsByMasteryRate({
    campaignId
  }: any) {
    return knex('campaign-participations')
      .select('masteryRate')
      .count()
      .where({ campaignId, status: SHARED, isImproved: false })
      .whereNotNull('masteryRate')
      .groupBy('masteryRate')
      .orderBy('masteryRate', 'ASC');
  },
};

async function _getCumulativeParticipationCountsByDay(campaignId: any, column: any) {
  const { rows: data } = await knex.raw(
    `
    SELECT CAST(:column: AS DATE) AS "day", SUM(COUNT(*)) OVER (ORDER BY CAST(:column: AS DATE)) AS "count"
    FROM "campaign-participations"
    WHERE "campaignId" = :campaignId AND :column: IS NOT NULL AND "isImproved" = false
    GROUP BY "day"`,
    { column, campaignId }
  );

  return data.map(({
    day,
    count
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
  }: any) => ({ day, count: Number(count) }));
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationsStatsRepository;
