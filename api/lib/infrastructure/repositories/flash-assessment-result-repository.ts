// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'flash-assessment-results';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    answerId,
    estimatedLevel,
    errorRate,
    domainTransaction: { knexTransaction } = DomainTransaction.emptyTransaction()
  }: any) {
    const query = knex(TABLE_NAME).insert({
      answerId,
      estimatedLevel,
      errorRate,
    });
    if (knexTransaction) query.transacting(knexTransaction);
    return query;
  },

  async getLatestByAssessmentId(assessmentId: any) {
    return knex(TABLE_NAME)
      .join('answers', 'answers.id', '=', `${TABLE_NAME}.answerId`)
      .select(`${TABLE_NAME}.*`)
      .where({ assessmentId })
      .orderBy('createdAt', 'desc')
      .limit(1)
      .first();
  },
};
