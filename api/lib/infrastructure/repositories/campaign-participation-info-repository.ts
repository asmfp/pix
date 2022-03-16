// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../domain/models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationInfo = require('../../domain/read-models/CampaignParticipationInfo');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByCampaignId(campaignId: any) {
    const results = await knex
      .with('campaignParticipationWithUserAndRankedAssessment', (qb: any) => {
        qb.select([
          'campaign-participations.*',
          'assessments.state',
          _assessmentRankByCreationDate(),
          'schooling-registrations.firstName',
          'schooling-registrations.lastName',
          'schooling-registrations.studentNumber',
          'schooling-registrations.division',
          'schooling-registrations.group',
        ])
          .from('campaign-participations')
          .join('assessments', 'campaign-participations.id', 'assessments.campaignParticipationId')
          .join(
            'schooling-registrations',
            'schooling-registrations.id',
            'campaign-participations.schoolingRegistrationId'
          )
          .where({ campaignId: campaignId, isImproved: false });
      })
      .from('campaignParticipationWithUserAndRankedAssessment')
      .where({ rank: 1 });

    return results.map(_rowToCampaignParticipationInfo);
  },
};

function _assessmentRankByCreationDate() {
  return knex.raw('ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ?? DESC) AS rank', [
    'assessments.campaignParticipationId',
    'assessments.createdAt',
  ]);
}

function _rowToCampaignParticipationInfo(row: any) {
  return new CampaignParticipationInfo({
    participantFirstName: row.firstName,
    participantLastName: row.lastName,
    participantExternalId: row.participantExternalId,
    studentNumber: row.studentNumber,
    userId: row.userId,
    campaignParticipationId: row.id,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'states' does not exist on type 'typeof A... Remove this comment to see the full error message
    isCompleted: row.state === Assessment.states.COMPLETED,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    createdAt: new Date(row.createdAt),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    sharedAt: row.sharedAt ? new Date(row.sharedAt) : null,
    division: row.division,
    group: row.group,
    masteryRate: row.masteryRate,
  });
}
