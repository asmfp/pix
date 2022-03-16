// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async addNonEnrolledCandidatesToSession({
    sessionId,
    scoCertificationCandidates
  }: any) {
    const schoolingRegistrationIds = scoCertificationCandidates.map((candidate: any) => candidate.schoolingRegistrationId);

    const alreadyEnrolledCandidate = await knex
      .select(['schoolingRegistrationId'])
      .from('certification-candidates')
      .whereIn('schoolingRegistrationId', schoolingRegistrationIds)
      .where({ sessionId });

    const alreadyEnrolledCandidateSchoolingRegistrationIds = alreadyEnrolledCandidate.map(
      (candidate: any) => candidate.schoolingRegistrationId
    );

    const scoCandidateToDTO = _scoCandidateToDTOForSession(sessionId);
    const candidatesToBeEnrolledDTOs = scoCertificationCandidates
      .filter(
        (candidate: any) => !alreadyEnrolledCandidateSchoolingRegistrationIds.includes(candidate.schoolingRegistrationId)
      )
      .map(scoCandidateToDTO);

    await knex.batchInsert('certification-candidates', candidatesToBeEnrolledDTOs);
  },

  async findIdsByOrganizationIdAndDivision({
    organizationId,
    division
  }: any) {
    const rows = await knex
      .select(['certification-candidates.id'])
      .from('certification-candidates')
      .join('schooling-registrations', 'schooling-registrations.id', 'certification-candidates.schoolingRegistrationId')
      .where({
        'schooling-registrations.organizationId': organizationId,
        'schooling-registrations.isDisabled': false,
      })
      .whereRaw('LOWER("schooling-registrations"."division") = ?', division.toLowerCase())
      .orderBy('certification-candidates.lastName', 'ASC')
      .orderBy('certification-candidates.firstName', 'ASC');

    return rows.map((row: any) => row.id);
  },
};

function _scoCandidateToDTOForSession(sessionId: any) {
  return (scoCandidate: any) => {
    const pickedAttributes = _.pick(scoCandidate, [
      'firstName',
      'lastName',
      'birthdate',
      'schoolingRegistrationId',
      'sex',
      'birthINSEECode',
      'birthCity',
      'birthCountry',
    ]);
    return {
      ...pickedAttributes,
      sessionId,
    };
  };
}
