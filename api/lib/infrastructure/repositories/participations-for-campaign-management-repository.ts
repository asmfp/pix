// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationForCampaignManagement = require('../../domain/models/ParticipationForCampaignManagement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findPaginatedParticipationsForCampaignManagement({
    campaignId,
    page
  }: any) {
    const query = knex('campaign-participations')
      .select({
        id: 'campaign-participations.id',
        lastName: 'schooling-registrations.lastName',
        firstName: 'schooling-registrations.firstName',
        participantExternalId: 'campaign-participations.participantExternalId',
        status: 'campaign-participations.status',
        createdAt: 'campaign-participations.createdAt',
        sharedAt: 'campaign-participations.sharedAt',
      })
      .join('schooling-registrations', 'schooling-registrations.id', 'campaign-participations.schoolingRegistrationId')
      .where('campaignId', campaignId)
      .orderBy(['lastName', 'firstName'], ['asc', 'asc']);

    const { results, pagination } = await fetchPage(query, page);

    const participationsForCampaignManagement = results.map(
      (attributes: any) => new ParticipationForCampaignManagement(attributes)
    );
    return { models: participationsForCampaignManagement, meta: { ...pagination } };
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async updateParticipantExternalId({
    campaignParticipationId,
    participantExternalId
  }: any) {
    try {
      await knex('campaign-participations').where('id', campaignParticipationId).update({ participantExternalId });
    } catch (error) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`La participation avec l'id ${campaignParticipationId} n'existe pas.`);
    }
  },
};
