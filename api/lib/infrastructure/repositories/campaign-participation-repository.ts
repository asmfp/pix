// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfCampaignParticipation = require('../orm-models/CampaignParticipation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../domain/models/CampaignParticipation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../domain/models/Campaign');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementSnapshotRepository = require('./knowledge-element-snapshot-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE, STARTED } = CampaignParticipationStatuses;

const ATTRIBUTES_TO_UPDATE = [
  'createdAt',
  'participantExternalId',
  'sharedAt',
  'status',
  'campaignId',
  'userId',
  'validatedSkillsCount',
  'pixScore',
  'status',
  'masteryRate',
  'schoolingRegistrationId',
];

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async hasAssessmentParticipations(userId: any) {
    const { count } = await knex('campaign-participations')
      .count('campaign-participations.id')
      .join('campaigns', 'campaigns.id', 'campaignId')
      .where('campaigns.type', '=', Campaign.types.ASSESSMENT)
      .andWhere({ userId })
      .first();
    return count > 0;
  },
  async getCodeOfLastParticipationToProfilesCollectionCampaignForUser(userId: any) {
    const result = await knex('campaign-participations')
      .select('campaigns.code')
      .join('campaigns', 'campaigns.id', 'campaignId')
      .where({ userId })
      .whereNull('deletedAt')
      .andWhere({ status: TO_SHARE })
      .andWhere({ 'campaigns.type': Campaign.types.PROFILES_COLLECTION })
      .orderBy('campaign-participations.createdAt', 'desc')
      .first();
    return result?.code || null;
  },
  async get(id: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    const campaignParticipation = await BookshelfCampaignParticipation.where({ id }).fetch({
      withRelated: ['campaign', 'assessments'],
      transacting: domainTransaction.knexTransaction,
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaignParticipation, campaignParticipation);
  },

  async update(campaignParticipation: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const attributes = _getAttributes(campaignParticipation);

    const updatedCampaignParticipation = await knexConn
      .from('campaign-participations')
      .where({ id: campaignParticipation.id })
      .update(attributes);

    return new CampaignParticipation(updatedCampaignParticipation);
  },

  async findProfilesCollectionResultDataByCampaignId(campaignId: any) {
    const results = await knex
      .with('campaignParticipationWithUser', (qb: any) => {
        qb.select([
          'campaign-participations.*',
          'schooling-registrations.studentNumber',
          'schooling-registrations.division',
          'schooling-registrations.group',
          'schooling-registrations.firstName',
          'schooling-registrations.lastName',
        ])
          .from('campaign-participations')
          .join(
            'schooling-registrations',
            'schooling-registrations.id',
            'campaign-participations.schoolingRegistrationId'
          )
          .where({ campaignId, isImproved: false });
      })
      .from('campaignParticipationWithUser');

    return results.map(_rowToResult);
  },

  findLatestOngoingByUserId(userId: any) {
    return BookshelfCampaignParticipation.query((qb: any) => {
      qb.innerJoin('campaigns', 'campaign-participations.campaignId', 'campaigns.id');
      qb.whereNull('campaigns.archivedAt');
      qb.orderBy('campaign-participations.createdAt', 'DESC');
    })
      .where({ userId })
      .fetchAll({
        required: false,
        withRelated: ['campaign', 'assessments'],
      })
      .then((campaignParticipations: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfCampaignParticipation, campaignParticipations)
      );
  },

  async findOneByCampaignIdAndUserId({
    campaignId,
    userId
  }: any) {
    const campaignParticipation = await BookshelfCampaignParticipation.where({
      campaignId,
      userId,
      isImproved: false,
    }).fetch({ require: false, withRelated: ['assessments'] });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfCampaignParticipation, campaignParticipation);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async updateWithSnapshot(campaignParticipation: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    await this.update(campaignParticipation, domainTransaction);

    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId: campaignParticipation.userId,
      limitDate: campaignParticipation.sharedAt,
      domainTransaction,
    });
    await knowledgeElementSnapshotRepository.save({
      userId: campaignParticipation.userId,
      snappedAt: campaignParticipation.sharedAt,
      knowledgeElements,
      domainTransaction,
    });
  },

  async isRetrying({
    campaignParticipationId
  }: any) {
    const { id: campaignId, userId } = await knex('campaigns')
      .select('campaigns.id', 'userId')
      .join('campaign-participations', 'campaigns.id', 'campaignId')
      .where({ 'campaign-participations.id': campaignParticipationId })
      .first();

    const campaignParticipations = await knex('campaign-participations')
      .select('sharedAt', 'isImproved')
      .where({ campaignId, userId });

    return campaignParticipations.length > 1 &&
    campaignParticipations.some((participation: any) => !participation.isImproved && !participation.sharedAt);
  },

  async countParticipationsByStage(campaignId: any, stagesBoundaries: any) {
    const participationCounts = stagesBoundaries.map((boundary: any) => {
      const from = boundary.from / 100;
      const to = boundary.to / 100;
      return knex.raw(
        'COUNT("id") FILTER (WHERE "masteryRate" between ?? and ??) OVER (PARTITION BY "campaignId") AS ??',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'String'.
        [from, to, String(boundary.id)]
      );
    });

    const result = await knex
      .select(participationCounts)
      .from('campaign-participations')
      .where('campaign-participations.campaignId', '=', campaignId)
      .where('campaign-participations.isImproved', '=', false)
      .limit(1);

    if (!result.length) return {};

    return result[0];
  },

  async countParticipationsByStatus(campaignId: any, campaignType: any) {
    const row = await knex('campaign-participations')
      .select([
        // eslint-disable-next-line knex/avoid-injections
        knex.raw(`sum(case when status = '${SHARED}' then 1 else 0 end) as shared`),
        // eslint-disable-next-line knex/avoid-injections
        knex.raw(`sum(case when status = '${TO_SHARE}' then 1 else 0 end) as completed`),
        // eslint-disable-next-line knex/avoid-injections
        knex.raw(`sum(case when status = '${STARTED}' then 1 else 0 end) as started`),
      ])
      .where({ campaignId, isImproved: false })
      .groupBy('campaignId')
      .first();

    return mapToParticipationByStatus(row, campaignType);
  },
};

function _rowToResult(row: any) {
  return {
    id: row.id,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    createdAt: new Date(row.createdAt),
    isShared: row.status === CampaignParticipationStatuses.SHARED,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    sharedAt: row.sharedAt ? new Date(row.sharedAt) : null,
    participantExternalId: row.participantExternalId,
    userId: row.userId,
    isCompleted: row.state === 'completed',
    studentNumber: row.studentNumber,
    participantFirstName: row.firstName,
    participantLastName: row.lastName,
    division: row.division,
    pixScore: row.pixScore,
    group: row.group,
  };
}

function _getAttributes(campaignParticipation: any) {
  return _.pick(campaignParticipation, ATTRIBUTES_TO_UPDATE);
}

function mapToParticipationByStatus(row = {}, campaignType: any) {
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
