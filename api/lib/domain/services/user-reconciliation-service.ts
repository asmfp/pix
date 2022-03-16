// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'pipe'.
const { pipe } = require('lodash/fp');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationAlreadyLinkedToUserError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationAlreadyLinkedToInvalidUserError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'areTwoStri... Remove this comment to see the full error message
const { areTwoStringsCloseEnough, isOneStringCloseEnoughFromMultipleStrings } = require('./string-comparison-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
const { normalizeAndRemoveAccents, removeSpecialCharacters } = require('./validation-treatments');

const MAX_ACCEPTABLE_RATIO = 0.25;
const STRICT_MATCH_RATIO = 0;

function findMatchingCandidateIdForGivenUser(matchingUserCandidates: any, user: any) {
  const standardizedUser = _standardizeUser(user);
  const standardizedMatchingUserCandidates = _.map(matchingUserCandidates, _standardizeMatchingCandidate);

  const foundUserId = _findMatchingCandidateId(
    standardizedMatchingUserCandidates,
    standardizedUser,
    STRICT_MATCH_RATIO
  );
  return (
    foundUserId || _findMatchingCandidateId(standardizedMatchingUserCandidates, standardizedUser, MAX_ACCEPTABLE_RATIO)
  );
}

async function findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser({
  organizationId,
  reconciliationInfo: { studentNumber, firstName, lastName, birthdate },
  higherSchoolingRegistrationRepository
}: any) {
  const schoolingRegistration = await higherSchoolingRegistrationRepository.findOneByStudentNumberAndBirthdate({
    organizationId,
    studentNumber,
    birthdate,
  });

  if (!schoolingRegistration) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('There are no schooling registrations found');
  }

  const schoolingRegistrationId = findMatchingCandidateIdForGivenUser([schoolingRegistration], { firstName, lastName });
  if (!schoolingRegistrationId) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('There were no schoolingRegistrations matching with names');
  }

  if (!_.isNil(schoolingRegistration.userId)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 0.
    throw new SchoolingRegistrationAlreadyLinkedToUserError();
  }
  return schoolingRegistration;
}

async function findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser({
  organizationId,
  reconciliationInfo: { firstName, lastName, birthdate },
  schoolingRegistrationRepository
}: any) {
  const schoolingRegistrations = await schoolingRegistrationRepository.findByOrganizationIdAndBirthdate({
    organizationId,
    birthdate,
  });

  if (_.isEmpty(schoolingRegistrations)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('There are no schooling registrations found');
  }

  const schoolingRegistrationId = findMatchingCandidateIdForGivenUser(schoolingRegistrations, { firstName, lastName });
  if (!schoolingRegistrationId) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError('There were no schoolingRegistrations matching with names');
  }

  return _.find(schoolingRegistrations, { id: schoolingRegistrationId });
}

async function checkIfStudentHasAnAlreadyReconciledAccount(
  schoolingRegistration: any,
  userRepository: any,
  obfuscationService: any,
  studentRepository: any
) {
  if (!_.isNil(schoolingRegistration.userId)) {
    await _buildStudentReconciliationError(
      schoolingRegistration.userId,
      'IN_SAME_ORGANIZATION',
      userRepository,
      obfuscationService
    );
  }

  const student = await studentRepository.getReconciledStudentByNationalStudentId(
    schoolingRegistration.nationalStudentId
  );
  if (_.get(student, 'account')) {
    await _buildStudentReconciliationError(
      student.account.userId,
      'IN_OTHER_ORGANIZATION',
      userRepository,
      obfuscationService
    );
  }
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _buildStudentReconciliationError(userId: any, errorContext: any, userRepository: any, obfuscationService: any) {
  const user = await userRepository.getForObfuscation(userId);
  let authenticationMethod;
  try {
    authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);
  } catch (error) {
    throw new SchoolingRegistrationAlreadyLinkedToInvalidUserError();
  }

  const detailWhenSameOrganization = 'Un compte existe déjà pour l‘élève dans le même établissement.';
  const detailWhenOtherOrganization = 'Un compte existe déjà pour l‘élève dans un autre établissement.';
  const detail = errorContext === 'IN_SAME_ORGANIZATION' ? detailWhenSameOrganization : detailWhenOtherOrganization;
  const error = STUDENT_RECONCILIATION_ERRORS.RECONCILIATION[errorContext][authenticationMethod.authenticatedBy];
  const meta = {
    shortCode: error.shortCode,
    value: authenticationMethod.value,
    userId: userId,
  };
  throw new SchoolingRegistrationAlreadyLinkedToUserError(detail, error.code, meta);
}

function _containsOneElement(arr: any) {
  return _.size(arr) === 1;
}

function _standardizeUser(reconciliationInfo: any) {
  return _(reconciliationInfo).pick(['firstName', 'lastName']).mapValues(_standardize).value();
}

function _standardizeMatchingCandidate(matchingUserCandidate: any) {
  return _(matchingUserCandidate)
    .pick(['id', 'firstName', 'middleName', 'thirdName', 'lastName', 'preferredLastName'])
    .mapValues(_standardize)
    .value();
}

function _standardize(propToStandardize: any) {
  return _.isString(propToStandardize)
    ? pipe(normalizeAndRemoveAccents, removeSpecialCharacters)(propToStandardize)
    : propToStandardize;
}

function _findMatchingCandidateId(standardizedMatchingUserCandidates: any, standardizedUser: any, maxAcceptableRatio: any) {
  return (
    _(['firstName', 'middleName', 'thirdName'])
      .map(_findCandidatesMatchingWithUser(standardizedMatchingUserCandidates, standardizedUser, maxAcceptableRatio))
      .filter(_containsOneElement)
      .flatten()
      .map('id')
      .first() || null
  );
}

// A given name refers to either a first name, middle name or third name
function _findCandidatesMatchingWithUser(matchingUserCandidatesStandardized: any, standardizedUser: any, maxAcceptableRatio: any) {
  return (candidateGivenName: any) => matchingUserCandidatesStandardized
    .filter(_candidateHasSimilarFirstName(standardizedUser, candidateGivenName, maxAcceptableRatio))
    .filter(_candidateHasSimilarLastName(standardizedUser, maxAcceptableRatio));
}

function _candidateHasSimilarFirstName(
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'userFirstName' implicitly has an ... Remove this comment to see the full error message
  { firstName: userFirstName },
  candidateGivenName: any,
  maxAcceptableRatio = MAX_ACCEPTABLE_RATIO
) {
  return (candidate: any) => candidate[candidateGivenName] &&
  areTwoStringsCloseEnough(userFirstName, candidate[candidateGivenName], maxAcceptableRatio);
}

function _candidateHasSimilarLastName({
  lastName
}: any, maxAcceptableRatio = MAX_ACCEPTABLE_RATIO) {
  return (candidate: any) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
    const candidatesLastName = [candidate.lastName, candidate.preferredLastName].filter(
      (candidateLastName: any) => candidateLastName
    );
    return isOneStringCloseEnoughFromMultipleStrings(lastName, candidatesLastName, maxAcceptableRatio);
  };
}

// TODO Export all functions generating random codes to an appropriate service
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_generateC... Remove this comment to see the full error message
const _generateCode = () => {
  return randomString.generate({ length: 4, charset: 'numeric' });
};

async function generateUsernameUntilAvailable({
  firstPart,
  secondPart,
  userRepository
}: any) {
  let randomPart = secondPart;

  let username;
  let isUsernameAvailable;

  do {
    username = firstPart + randomPart;
    isUsernameAvailable = true;

    try {
      await userRepository.isUsernameAvailable(username);
    } catch (error) {
      if (error instanceof AlreadyRegisteredUsernameError) {
        isUsernameAvailable = false;
        randomPart = _generateCode();
      } else {
        throw error;
      }
    }
  } while (!isUsernameAvailable);

  return username;
}

async function createUsernameByUser({
  user: { firstName, lastName, birthdate },
  userRepository
}: any) {
  const standardizeUser = _standardizeUser({ firstName, lastName });
  const [, month, day] = birthdate.split('-');

  const firstPart = standardizeUser.firstName + '.' + standardizeUser.lastName;
  const secondPart = day + month;

  return await generateUsernameUntilAvailable({ firstPart, secondPart, userRepository });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateUsernameUntilAvailable,
  createUsernameByUser,
  findMatchingCandidateIdForGivenUser,
  findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser,
  findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser,
  checkIfStudentHasAnAlreadyReconciledAccount,
};
