// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfBadgeAcquisition = require('../orm-models/BadgeAcquisition');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createOrUpdate(badgeAcquisitionsToCreate = [], domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || Bookshelf.knex;
    return bluebird.mapSeries(badgeAcquisitionsToCreate, async (badgeAcquisitionToCreate: any) => {
      const alreadyCreatedBadgeAcquisition = await knexConn('badge-acquisitions')
        .select('id')
        .where(badgeAcquisitionToCreate);
      if (alreadyCreatedBadgeAcquisition.length === 0) {
        return knexConn('badge-acquisitions').insert(badgeAcquisitionsToCreate, 'id');
      } else {
        return knexConn('badge-acquisitions')
          .update({ updatedAt: Bookshelf.knex.raw('CURRENT_TIMESTAMP') })
          .where(badgeAcquisitionToCreate);
      }
    });
  },

  async hasAcquiredBadge({
    badgeKey,
    userId
  }: any) {
    const badgeAcquisition = await Bookshelf.knex('badge-acquisitions')
      .select('badge-acquisitions.id')
      .innerJoin('badges', 'badges.id', 'badgeId')
      .where({ userId, key: badgeKey })
      .first();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(badgeAcquisition);
  },

  async getAcquiredBadgeIds({
    badgeIds,
    userId
  }: any) {
    const collectionResult = await BookshelfBadgeAcquisition.where({ userId })
      .where('badgeId', 'in', badgeIds)
      .fetchAll({ columns: ['badge-acquisitions.badgeId'], require: false });
    return collectionResult.map((obj: any) => obj.attributes.badgeId);
  },

  async getAcquiredBadgesByCampaignParticipations({
    campaignParticipationsIds
  }: any) {
    const badges = await Bookshelf.knex('badges')
      .distinct('badges.id')
      .select('badge-acquisitions.campaignParticipationId AS campaignParticipationId', 'badges.*')
      .from('badges')
      .join('badge-acquisitions', 'badges.id', 'badge-acquisitions.badgeId')
      .where('badge-acquisitions.campaignParticipationId', 'IN', campaignParticipationsIds)
      .orderBy('badges.id');

    const acquiredBadgesByCampaignParticipations = {};
    for (const badge of badges) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (acquiredBadgesByCampaignParticipations[badge.campaignParticipationId]) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByCampaignParticipations[badge.campaignParticipationId].push(badge);
      } else {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByCampaignParticipations[badge.campaignParticipationId] = [badge];
      }
    }
    return acquiredBadgesByCampaignParticipations;
  },

  async getCampaignAcquiredBadgesByUsers({
    campaignId,
    userIds
  }: any) {
    const results = await BookshelfBadgeAcquisition.query((qb: any) => {
      qb.join('badges', 'badges.id', 'badge-acquisitions.badgeId');
      qb.join('campaigns', 'campaigns.targetProfileId', 'badges.targetProfileId');
      qb.where('campaigns.id', '=', campaignId);
      qb.where('badge-acquisitions.userId', 'IN', userIds);
    }).fetchAll({
      withRelated: ['badge'],
      require: false,
    });

    const badgeAcquisitions = results.map((result: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfBadgeAcquisition, result)
    );

    const acquiredBadgesByUsers = {};
    for (const badgeAcquisition of badgeAcquisitions) {
      const { userId, badge } = badgeAcquisition;
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (acquiredBadgesByUsers[userId]) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByUsers[userId].push(badge);
      } else {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        acquiredBadgesByUsers[userId] = [badge];
      }
    }
    return acquiredBadgesByUsers;
  },

  async findCertifiable({
    userId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const results = await BookshelfBadgeAcquisition.query((qb: any) => {
      qb.join('badges', 'badges.id', 'badge-acquisitions.badgeId');
      qb.where('badge-acquisitions.userId', '=', userId);
      qb.where('badges.isCertifiable', '=', true);
    }).fetchAll({
      withRelated: ['badge', 'badge.skillSets', 'badge.badgeCriteria'],
      require: false,
      transacting: domainTransaction.knexTransaction,
    });

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfBadgeAcquisition, results);
  },
};
