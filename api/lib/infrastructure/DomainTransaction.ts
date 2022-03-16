// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
class DomainTransaction {
  knexTransaction: any;
  constructor(knexTransaction: any) {
    this.knexTransaction = knexTransaction;
  }

  static execute(lambda: any) {
    return knex.transaction((trx: any) => {
      return lambda(new DomainTransaction(trx));
    });
  }

  static emptyTransaction() {
    return new DomainTransaction(null);
  }
}
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = DomainTransaction;
