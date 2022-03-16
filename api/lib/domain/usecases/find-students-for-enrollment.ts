// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'StudentFor... Remove this comment to see the full error message
const StudentForEnrollment = require('../read-models/StudentForEnrollment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findStudentsForEnrollment({
  certificationCenterId,
  sessionId,
  page,
  filter,
  organizationRepository,
  schoolingRegistrationRepository,
  certificationCandidateRepository
}: any) {
  try {
    const organizationId = await organizationRepository.getIdByCertificationCenterId(certificationCenterId);
    const paginatedStudents = await schoolingRegistrationRepository.findByOrganizationIdAndUpdatedAtOrderByDivision({
      page,
      filter,
      organizationId,
    });
    const certificationCandidates = await certificationCandidateRepository.findBySessionId(sessionId);
    return {
      data: _buildStudentsForEnrollment({ students: paginatedStudents.data, certificationCandidates }),
      pagination: paginatedStudents.pagination,
    };
  } catch (error) {
    // This should not happen but still might (due to missing data in database)
    // in that case, handle error gracefully.
    // The error will be handled properly in the future.
    if (error instanceof NotFoundError) return _emptyResponse(page);

    throw error;
  }
};

function _buildStudentsForEnrollment({
  students,
  certificationCandidates
}: any) {
  return students.map((student: any) => StudentForEnrollment.fromStudentsAndCertificationCandidates({ student, certificationCandidates })
  );
}

function _emptyResponse(page: any) {
  return {
    data: [],
    pagination: { page: page.number, pageSize: page.size, rowCount: 0, pageCount: 0 },
  };
}
