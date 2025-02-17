const { expect, sinon } = require('../../../test-helper');
const getCertificationCourse = require('../../../../lib/domain/usecases/get-certification-course');
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');

describe('Unit | UseCase | get-certification-course', function () {
  let certificationCourse;
  let certificationCourseRepository;
  let userRepository;

  beforeEach(function () {
    certificationCourse = new CertificationCourse({
      id: 'certification_course_id',
      userId: 'user_id',
    });
    certificationCourseRepository = {
      get: sinon.stub(),
    };
    userRepository = {
      isPixMaster: sinon.stub(),
    };
  });

  it('should get the certificationCourse when the user id matches the certification course user id', async function () {
    // given
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

    // when
    const actualCertificationCourse = await getCertificationCourse({
      certificationCourseId: certificationCourse.getId(),
      userId: 'user_id',
      certificationCourseRepository,
      userRepository,
    });

    // then
    expect(actualCertificationCourse.getId()).to.equal(certificationCourse.getId());
  });

  it('should get the certificationCourse when the user id does not match the certification course user id but is pix master', async function () {
    // given
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);
    userRepository.isPixMaster.withArgs('pix_master_user_id').resolves(true);

    // when
    const actualCertificationCourse = await getCertificationCourse({
      certificationCourseId: certificationCourse.getId(),
      userId: 'pix_master_user_id',
      certificationCourseRepository,
      userRepository,
    });

    // then
    expect(actualCertificationCourse.getId()).to.equal(certificationCourse.getId());
  });

  it('should throw an error when the certification course is not linked to the user passed in parameter and user is not pix master', function () {
    // given
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);
    userRepository.isPixMaster.withArgs('other_user_id').resolves(false);

    // when
    const promise = getCertificationCourse({
      certificationCourseId: certificationCourse.getId(),
      userId: 'other_user_id',
      certificationCourseRepository,
      userRepository,
    });

    // then
    return expect(promise).to.be.rejected;
  });

  it('should throw an error when the certification course could not be retrieved', function () {
    // given
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).rejects();

    // when
    const promise = getCertificationCourse({
      certificationCourseId: certificationCourse.getId(),
      userId: 'other_user_id',
      certificationCourseRepository,
      userRepository,
    });

    // then
    return expect(promise).to.be.rejected;
  });
});
