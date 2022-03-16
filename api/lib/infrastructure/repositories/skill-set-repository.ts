// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../../lib/domain/models/SkillSet');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'skill-sets';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    skillSet
  }: any, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const savedSkillSet = await (knexTransaction ?? knex)(TABLE_NAME).insert(skillSet).returning('*');
    return new SkillSet(savedSkillSet[0]);
  },
};
