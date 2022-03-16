// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async create({
    sessionId,
    userId
  }: any) {
    await knex('supervisor-accesses').insert({ sessionId, userId });
  },

  async isUserSupervisorForSession({
    sessionId,
    userId
  }: any) {
    const result = await knex.select(1).from('supervisor-accesses').where({ sessionId, userId }).first();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(result);
  },

  async sessionHasSupervisorAccess({
    sessionId
  }: any) {
    const result = await knex.select(1).from('supervisor-accesses').where({ sessionId }).first();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(result);
  },

  async isUserSupervisorForSessionCandidate({
    supervisorId,
    certificationCandidateId
  }: any) {
    const result = await knex
      .select(1)
      .from('supervisor-accesses')
      .innerJoin('certification-candidates', 'supervisor-accesses.sessionId', 'certification-candidates.sessionId')
      .where({ 'certification-candidates.id': certificationCandidateId, 'supervisor-accesses.userId': supervisorId })
      .first();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(result);
  },
};
