// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
const { CpfBirthInformationValidationError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function correctCandidateIdentityInCertificationCourse({
  command: {
    certificationCourseId,
    firstName,
    lastName,
    birthdate,
    birthplace,
    sex,
    birthCountry,
    birthPostalCode,
    birthINSEECode,
  },

  certificationCourseRepository,
  certificationCpfService,
  certificationCpfCountryRepository,
  certificationCpfCityRepository
}: any) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  certificationCourse.correctFirstName(firstName);
  certificationCourse.correctLastName(lastName);
  certificationCourse.correctBirthdate(birthdate);
  certificationCourse.correctBirthplace(birthplace);
  certificationCourse.correctSex(sex);

  const cpfBirthInformation = await certificationCpfService.getBirthInformation({
    birthCountry,
    birthCity: birthplace,
    birthPostalCode,
    birthINSEECode,
    certificationCpfCountryRepository,
    certificationCpfCityRepository,
  });

  if (cpfBirthInformation.hasFailed()) {
    throw new CpfBirthInformationValidationError(cpfBirthInformation.message);
  }

  certificationCourse.correctBirthInformation(cpfBirthInformation);

  await certificationCourseRepository.update(certificationCourse);
};
