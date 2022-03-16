// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGetCertificationCoursesError } = require('../../../lib/domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCertificationCourse({
  userId,
  certificationCourseId,
  certificationCourseRepository,
  userRepository
}: any) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  if (!certificationCourse.doesBelongTo(userId)) {
    const userIsPixMaster = await userRepository.isPixMaster(userId);
    if (!userIsPixMaster) {
      throw new UserNotAuthorizedToGetCertificationCoursesError();
    }
  }

  return certificationCourse;
};
