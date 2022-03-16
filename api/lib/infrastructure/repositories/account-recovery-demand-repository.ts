import { IAccountRecoveryDemand, AccountRecoveryDemand } from './../../domain/models/AccountRecoveryDemand';
import _ from 'lodash';
import { knex } from '../../../db/knex-database-connection';

import { NotFoundError } from '../../domain/errors';
import DomainTransaction from '../DomainTransaction';

const _toDomain = (accountRecoveryDemandDTO: IAccountRecoveryDemand): IAccountRecoveryDemand => {
  return new AccountRecoveryDemand({
    ...accountRecoveryDemandDTO,
  });
};

const _toDomainArray = (accountRecoveryDemandsDTOs: Array<IAccountRecoveryDemand>): Array<IAccountRecoveryDemand> => {
  return _.map(accountRecoveryDemandsDTOs, _toDomain);
};

export async function findByTemporaryKey(temporaryKey: string): Promise<IAccountRecoveryDemand> {
  const accountRecoveryDemandDTO = await knex
    .where({ temporaryKey })
    .select('id', 'schoolingRegistrationId', 'userId', 'oldEmail', 'newEmail', 'temporaryKey', 'used', 'createdAt')
    .from('account-recovery-demands')
    .first();

  if (!accountRecoveryDemandDTO) {
    throw new NotFoundError('No account recovery demand found');
  }

  return _toDomain(accountRecoveryDemandDTO);
}

export async function findByUserId(userId: number): Promise<Array<IAccountRecoveryDemand>> {
  const accountRecoveryDemandsDTOs = await knex
    .select('id', 'schoolingRegistrationId', 'userId', 'oldEmail', 'newEmail', 'temporaryKey', 'used', 'createdAt')
    .from('account-recovery-demands')
    .where({ userId });

  return _toDomainArray(accountRecoveryDemandsDTOs);
}

export async function save(accountRecoveryDemand: IAccountRecoveryDemand): Promise<IAccountRecoveryDemand> {
  const result = await knex('account-recovery-demands').insert(accountRecoveryDemand).returning('*');

  return _toDomain(result[0]);
}

export async function markAsBeingUsed(
  temporaryKey: string,
  { knexTransaction } = DomainTransaction.emptyTransaction()
): Promise<unknown> {
  const query = knex('account-recovery-demands')
    .where({ temporaryKey })
    .update({ used: true, updatedAt: knex.fn.now() });
  if (knexTransaction) query.transacting(knexTransaction);
  return query;
}
