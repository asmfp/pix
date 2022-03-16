// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Student'.
const Student = require('../../domain/models/Student');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  _toStudents(results: any) {
    const students = [];
    const resultsGroupedByNatId = _.groupBy(results, 'nationalStudentId');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    for (const [nationalStudentId, accounts] of Object.entries(resultsGroupedByNatId)) {
      const mostRelevantAccount = _.orderBy(accounts, ['certificationCount', 'updatedAt'], ['desc', 'desc'])[0];
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      students.push(
        new Student({
          nationalStudentId,
          account: _.pick(mostRelevantAccount, ['userId', 'certificationCount', 'updatedAt']),
        })
      );
    }
    return students;
  },

  async findReconciledStudentsByNationalStudentId(
    nationalStudentIds: any,
    domainTransaction = DomainTransaction.emptyTransaction()
  ) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const results = await knexConn
      .select({
        nationalStudentId: 'schooling-registrations.nationalStudentId',
        userId: 'users.id',
        updatedAt: 'users.updatedAt',
      })
      .count('certification-courses.id as certificationCount')
      .from('schooling-registrations')
      .join('users', 'users.id', 'schooling-registrations.userId')
      .leftJoin('certification-courses', 'certification-courses.userId', 'users.id')
      .whereIn('nationalStudentId', nationalStudentIds)
      .groupBy('schooling-registrations.nationalStudentId', 'users.id', 'users.updatedAt')
      .orderBy('users.id');

    return this._toStudents(results);
  },

  async getReconciledStudentByNationalStudentId(nationalStudentId: any) {
    const result = await this.findReconciledStudentsByNationalStudentId([nationalStudentId]);

    return _.isEmpty(result) ? null : result[0];
  },
};
