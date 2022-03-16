// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateForSupervising = require('../../domain/models/CertificationCandidateForSupervising');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(certificationCandidateId: any) {
    const result = await knex('certification-candidates')
      .select('certification-candidates.*', 'assessments.state AS assessmentStatus')
      .leftJoin('certification-courses', function () {
        this.on('certification-courses.sessionId', '=', 'certification-candidates.sessionId');
        this.on('certification-courses.userId', '=', 'certification-candidates.userId');
      })
      .leftJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
      .where({ 'certification-candidates.id': certificationCandidateId })
      .first();
    return new CertificationCandidateForSupervising({ ...result });
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async update(certificationCandidateForSupervising: any) {
    const result = await knex('certification-candidates')
      .where({
        id: certificationCandidateForSupervising.id,
      })
      .update({ authorizedToStart: certificationCandidateForSupervising.authorizedToStart });

    if (result === 0) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError('Aucun candidat trouvé');
    }
  },
};
