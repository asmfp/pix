const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationNotFound,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationAlreadyLinkedToUserError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STUDENT_RE... Remove this comment to see the full error message
const { STUDENT_RECONCILIATION_ERRORS } = require('../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'find'.
const { find, get } = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function generateUsername({
  studentInformation,
  campaignCode,
  campaignRepository,
  schoolingRegistrationRepository,
  userReconciliationService,
  obfuscationService,
  userRepository,
  studentRepository
}: any) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError(`Le code campagne ${campaignCode} n'existe pas.`);
  }

  const matchedSchoolingRegistration = await findMatchedSchoolingRegistrationForGivenOrganizationIdAndStudentInfo({
    organizationId: campaign.organizationId,
    studentInformation,
    schoolingRegistrationRepository,
    userReconciliationService,
    obfuscationService,
  });
  await checkIfStudentIsAlreadyReconciledOnTheSameOrganization(
    matchedSchoolingRegistration,
    userRepository,
    obfuscationService
  );

  const student = await studentRepository.getReconciledStudentByNationalStudentId(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nationalStudentId' does not exist on typ... Remove this comment to see the full error message
    matchedSchoolingRegistration.nationalStudentId
  );
  await checkIfStudentHasAlreadyAccountsReconciledInOtherOrganizations(student, userRepository, obfuscationService);

  studentInformation = {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstName' does not exist on type 'unkno... Remove this comment to see the full error message
    firstName: matchedSchoolingRegistration.firstName,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'lastName' does not exist on type 'unknow... Remove this comment to see the full error message
    lastName: matchedSchoolingRegistration.lastName,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'birthdate' does not exist on type 'unkno... Remove this comment to see the full error message
    birthdate: matchedSchoolingRegistration.birthdate,
  };

  return userReconciliationService.createUsernameByUser({ user: studentInformation, userRepository });
};

async function findMatchedSchoolingRegistrationForGivenOrganizationIdAndStudentInfo({
  organizationId,
  studentInformation: { firstName, lastName, birthdate },
  schoolingRegistrationRepository,
  userReconciliationService
}: any) {
  const schoolingRegistrations = await schoolingRegistrationRepository.findByOrganizationIdAndBirthdate({
    organizationId,
    birthdate,
  });

  if (schoolingRegistrations.length === 0) {
    throw new SchoolingRegistrationNotFound(
      'There were no schoolingRegistrations matching with organization and birthdate'
    );
  }

  const schoolingRegistrationId = await userReconciliationService.findMatchingCandidateIdForGivenUser(
    schoolingRegistrations,
    { firstName, lastName }
  );

  if (!schoolingRegistrationId) {
    throw new SchoolingRegistrationNotFound('There were no schoolingRegistrations matching with names');
  }

  return find(schoolingRegistrations, { id: schoolingRegistrationId });
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function checkIfStudentIsAlreadyReconciledOnTheSameOrganization(
  matchingSchoolingRegistration: any,
  userRepository: any,
  obfuscationService: any
) {
  if (get(matchingSchoolingRegistration, 'userId')) {
    const userId = matchingSchoolingRegistration.userId;
    const user = await userRepository.getForObfuscation(userId);
    const authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

    const detail = 'Un compte existe déjà pour l‘élève dans le même établissement.';
    const error =
      STUDENT_RECONCILIATION_ERRORS.LOGIN_OR_REGISTER.IN_SAME_ORGANIZATION[authenticationMethod.authenticatedBy];
    const meta = { shortCode: error.shortCode, value: authenticationMethod.value };
    throw new SchoolingRegistrationAlreadyLinkedToUserError(detail, error.code, meta);
  }
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function checkIfStudentHasAlreadyAccountsReconciledInOtherOrganizations(
  student: any,
  userRepository: any,
  obfuscationService: any
) {
  if (get(student, 'account')) {
    const userId = student.account.userId;
    const user = await userRepository.getForObfuscation(userId);
    const authenticationMethod = await obfuscationService.getUserAuthenticationMethodWithObfuscation(user);

    const detail = 'Un compte existe déjà pour l‘élève dans un autre établissement.';
    const error =
      STUDENT_RECONCILIATION_ERRORS.LOGIN_OR_REGISTER.IN_OTHER_ORGANIZATION[authenticationMethod.authenticatedBy];
    const meta = { shortCode: error.shortCode, value: authenticationMethod.value };
    throw new SchoolingRegistrationAlreadyLinkedToUserError(detail, error.code, meta);
  }
}
