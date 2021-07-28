const _ = require('lodash');
const { knex } = require('../../../db/knex-database-connection');
const AccountRecoveryDemand = require('../../domain/models/AccountRecoveryDemand');
const {
  NotFoundError,
  AccountRecoveryDemandExpired,
} = require('../../domain/errors');
const DomainTransaction = require('../DomainTransaction');

const _toDomain = (accountRecoveryDemandDTO) => {
  return new AccountRecoveryDemand({
    ...accountRecoveryDemandDTO,
  });
};

const _toDomainArray = (accountRecoveryDemandsDTOs) => {
  return _.map(accountRecoveryDemandsDTOs, _toDomain);
};

const demandHasExpired = (demandCreationDate) => {
  const minutesInADay = 60 * 24;
  const lifetimeInMinutes = parseInt(process.env.SCO_ACCOUNT_RECOVERY_TOKEN_LIFETIME_MINUTES) || minutesInADay;
  const millisecondsInAMinute = 60 * 1000;
  const lifetimeInMilliseconds = lifetimeInMinutes * millisecondsInAMinute;

  const expirationDate = new Date(demandCreationDate.getTime() + lifetimeInMilliseconds);
  const now = new Date();

  return expirationDate < now;
};

module.exports = {

  async findByTemporaryKey(temporaryKey) {

    const accountRecoveryDemandDTO = await knex
      .where({ temporaryKey, used: false })
      .select('id', 'schoolingRegistrationId', 'userId', 'oldEmail', 'newEmail', 'temporaryKey', 'used', 'createdAt')
      .from('account-recovery-demands')
      .first();

    if (!accountRecoveryDemandDTO) {
      throw new NotFoundError('No account recovery demand found');
    }

    if (demandHasExpired(accountRecoveryDemandDTO.createdAt)) {
      throw new AccountRecoveryDemandExpired();
    }

    return _toDomain(accountRecoveryDemandDTO);
  },

  async findByUserId(userId) {
    const accountRecoveryDemandsDTOs = await knex
      .select('id', 'schoolingRegistrationId', 'userId', 'oldEmail', 'newEmail', 'temporaryKey', 'used', 'createdAt')
      .from('account-recovery-demands')
      .where({ userId });

    return _toDomainArray(accountRecoveryDemandsDTOs);
  },

  async save(accountRecoveryDemand) {
    const result = await knex('account-recovery-demands')
      .insert(accountRecoveryDemand)
      .returning('*');

    return _toDomain(result[0]);
  },

  markAsBeingUsed(temporaryKey, domainTransaction = DomainTransaction.emptyTransaction()) {
    return knex('account-recovery-demands')
      .transacting(domainTransaction)
      .where({ temporaryKey })
      .update({ used: true });
  },

};
