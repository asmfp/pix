// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

async function isEndTestScreenRemovalEnabledByCertificationCenterId(certificationCenterId: any) {
  const result = await knex
    .select(1)
    .from('certification-centers')
    .where({ id: certificationCenterId, isSupervisorAccessEnabled: true })
    .first();

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  return Boolean(result);
}

async function isEndTestScreenRemovalEnabledBySessionId(sessionId: any) {
  const result = await knex
    .select(1)
    .from('sessions')
    .where({ 'sessions.id': sessionId, isSupervisorAccessEnabled: true })
    .innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
    .first();

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  return Boolean(result);
}

async function isEndTestScreenRemovalEnabledByCandidateId(certificationCandidateId: any) {
  const result = await knex
    .select(1)
    .from('certification-candidates')
    .where({ 'certification-candidates.id': certificationCandidateId, isSupervisorAccessEnabled: true })
    .innerJoin('sessions', 'sessions.id', 'certification-candidates.sessionId')
    .innerJoin('certification-centers', 'certification-centers.id', 'sessions.certificationCenterId')
    .first();

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  return Boolean(result);
}

async function isEndTestScreenRemovalEnabledForSomeCertificationCenter() {
  const result = await knex.select(1).from('certification-centers').where({ isSupervisorAccessEnabled: true }).first();

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
  return Boolean(result);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isEndTestScreenRemovalEnabledBySessionId,
  isEndTestScreenRemovalEnabledByCandidateId,
  isEndTestScreenRemovalEnabledByCertificationCenterId,
  isEndTestScreenRemovalEnabledForSomeCertificationCenter,
};
