// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
const AccountRecoveryDemand = require('../../domain/models/AccountRecoveryDemand');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
const _toDomain = (accountRecoveryDemandDTO: any) => {
  return new AccountRecoveryDemand({
    ...accountRecoveryDemandDTO,
  });
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomainA... Remove this comment to see the full error message
const _toDomainArray = (accountRecoveryDemandsDTOs: any) => {
  return _.map(accountRecoveryDemandsDTOs, _toDomain);
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByTemporaryKey(temporaryKey: any) {
    const accountRecoveryDemandDTO = await knex
      .where({ temporaryKey })
      .select('id', 'schoolingRegistrationId', 'userId', 'oldEmail', 'newEmail', 'temporaryKey', 'used', 'createdAt')
      .from('account-recovery-demands')
      .first();

    if (!accountRecoveryDemandDTO) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError('No account recovery demand found');
    }

    return _toDomain(accountRecoveryDemandDTO);
  },

  async findByUserId(userId: any) {
    const accountRecoveryDemandsDTOs = await knex
      .select('id', 'schoolingRegistrationId', 'userId', 'oldEmail', 'newEmail', 'temporaryKey', 'used', 'createdAt')
      .from('account-recovery-demands')
      .where({ userId });

    return _toDomainArray(accountRecoveryDemandsDTOs);
  },

  async save(accountRecoveryDemand: any) {
    const result = await knex('account-recovery-demands').insert(accountRecoveryDemand).returning('*');

    return _toDomain(result[0]);
  },

  async markAsBeingUsed(temporaryKey: any, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const query = knex('account-recovery-demands')
      .where({ temporaryKey })
      .update({ used: true, updatedAt: knex.fn.now() });
    if (knexTransaction) query.transacting(knexTransaction);
    return query;
  },
};
