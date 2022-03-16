// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfKnowledgeElementSnapshot = require('../orm-models/KnowledgeElementSnapshot');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../domain/models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

function _toKnowledgeElementCollection({
  snapshot
}: any = {}) {
  if (!snapshot) return null;
  return snapshot.map(
    (data: any) => new KnowledgeElement({
      ...data,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      createdAt: new Date(data.createdAt),
    })
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async save({
    userId,
    snappedAt,
    knowledgeElements,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    try {
      await new BookshelfKnowledgeElementSnapshot({
        userId,
        snappedAt,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
        snapshot: JSON.stringify(knowledgeElements),
      }).save(null, { transacting: domainTransaction.knexTransaction });
    } catch (error) {
      if (bookshelfUtils.isUniqConstraintViolated(error)) {
        throw new AlreadyExistingEntityError(
          `A snapshot already exists for the user ${userId} at the datetime ${snappedAt}.`
        );
      }
    }
  },

  async findByUserIdsAndSnappedAtDates(userIdsAndSnappedAtDates = {}) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    const params = Object.entries(userIdsAndSnappedAtDates);
    const results = await knex
      .select('userId', 'snapshot')
      .from('knowledge-element-snapshots')
      .whereIn(['userId', 'snappedAt'], params);

    const knowledgeElementsByUserId = {};
    for (const result of results) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsByUserId[result.userId] = _toKnowledgeElementCollection(result);
    }

    const userIdsWithoutSnapshot = _.difference(
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
      Object.keys(userIdsAndSnappedAtDates),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
      Object.keys(knowledgeElementsByUserId)
    );
    for (const userId of userIdsWithoutSnapshot) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsByUserId[userId] = null;
    }

    return knowledgeElementsByUserId;
  },
};
