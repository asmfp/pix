// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfile = require('../../../lib/domain/read-models/CampaignProfile');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../domain/services/placement-profile-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findProfile({
    campaignId,
    campaignParticipationId,
    locale
  }: any) {
    const profile = await _fetchCampaignProfileAttributesFromCampaignParticipation(campaignId, campaignParticipationId);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sharedAt' does not exist on type '{}'.
    const { sharedAt, userId } = profile;
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId,
      limitDate: sharedAt,
      allowExcessPixAndLevels: false,
      locale,
    });

    // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
    return new CampaignProfile({ ...profile, placementProfile });
  },
};

async function _fetchCampaignProfileAttributesFromCampaignParticipation(campaignId: any, campaignParticipationId: any) {
  const [profile] = await knex
    .with('campaignProfile', (qb: any) => {
      qb.select([
        'campaign-participations.userId',
        'schooling-registrations.firstName',
        'schooling-registrations.lastName',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.campaignId',
        'campaign-participations.createdAt',
        'campaign-participations.sharedAt',
        'campaign-participations.status',
        'campaign-participations.participantExternalId',
        'campaign-participations.pixScore',
      ])
        .from('campaign-participations')
        .join(
          'schooling-registrations',
          'schooling-registrations.id',
          'campaign-participations.schoolingRegistrationId'
        )
        .where({
          campaignId,
          'campaign-participations.id': campaignParticipationId,
        });
    })
    .from('campaignProfile');

  if (profile == null) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`There is no campaign participation with the id "${campaignParticipationId}"`);
  }

  return profile;
}
