// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervisorKit = require('../../../domain/read-models/SessionForSupervisorKit');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(idSession: any) {
    const results = await knex
      .select(
        'sessions.id',
        'sessions.date',
        'sessions.time',
        'sessions.address',
        'sessions.room',
        'sessions.examiner',
        'sessions.accessCode',
        'sessions.supervisorPassword'
      )
      .from('sessions')
      .where({ 'sessions.id': idSession })
      .first();

    return _toDomain(results);
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(results: any) {
  return new SessionForSupervisorKit({
    ...results,
  });
}
