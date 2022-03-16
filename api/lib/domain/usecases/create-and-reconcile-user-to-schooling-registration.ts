// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
  CampaignCodeError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
  EntityValidationError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationAlreadyLinkedToUserError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'User'.
const User = require('../models/User');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../validators/password-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../validators/user-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
const { getCampaignUrl } = require('../../infrastructure/utils/url-builder');

function _encryptPassword(userPassword: any, encryptionService: any) {
  const encryptedPassword = encryptionService.hashPassword(userPassword);

  if (encryptedPassword === userPassword) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('Erreur lors de l‘encryption du mot passe de l‘utilisateur');
  }

  return encryptedPassword;
}

function _createDomainUser(userAttributes: any) {
  return new User({
    firstName: userAttributes.firstName,
    lastName: userAttributes.lastName,
    email: userAttributes.email,
    username: userAttributes.username,
    cgu: false,
  });
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _manageEmailAvailabilityError(error: any) {
  return _manageError(
    error,
    AlreadyRegisteredEmailError,
    'email',
    'Cette adresse e-mail est déjà enregistrée, connectez-vous.'
  );
}

function _manageUsernameAvailabilityError(error: any) {
  return _manageError(
    error,
    AlreadyRegisteredUsernameError,
    'username',
    'Cet identifiant n’est plus disponible, merci de recharger la page.'
  );
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _manageError(error: any, errorType: any, attribute: any, message: any) {
  if (error instanceof errorType) {
    throw new EntityValidationError({
      invalidAttributes: [{ attribute, message }],
    });
  }
  throw error;
}

function _emptyOtherMode(isUsernameMode: any, userAttributes: any) {
  return isUsernameMode ? { ...userAttributes, email: undefined } : { ...userAttributes, username: undefined };
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _validatePassword(password: any) {
  let result;
  try {
    passwordValidator.validate(password);
  } catch (err) {
    result = err;
  }
  return result;
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _validateData({
  isUsernameMode,
  password,
  userAttributes,
  userRepository
}: any) {
  const validationErrors = [];

  try {
    userValidator.validate({ user: userAttributes, cguRequired: false });
  } catch (err) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    validationErrors.push(err);
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
  validationErrors.push(_validatePassword(password));

  if (isUsernameMode) {
    try {
      await userRepository.isUsernameAvailable(userAttributes.username);
    } catch (err) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      validationErrors.push(_manageUsernameAvailabilityError(err));
    }
  } else {
    try {
      await userRepository.checkIfEmailIsAvailable(userAttributes.email);
    } catch (err) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
      validationErrors.push(_manageEmailAvailabilityError(err));
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
  const relevantErrors = validationErrors.filter((error: any) => error instanceof Error);
  if (relevantErrors.length > 0) {
    throw EntityValidationError.fromMultipleEntityValidationErrors(relevantErrors);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createAndReconcileUserToSchoolingRegistration({
  campaignCode,
  locale,
  password,
  userAttributes,
  authenticationMethodRepository,
  campaignRepository,
  schoolingRegistrationRepository,
  userRepository,
  encryptionService,
  mailService,
  obfuscationService,
  userReconciliationService,
  userService
}: any) {
  const campaign = await campaignRepository.getByCode(campaignCode);
  if (!campaign) {
    throw new CampaignCodeError();
  }

  const matchedSchoolingRegistration =
    await userReconciliationService.findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser({
      organizationId: campaign.organizationId,
      reconciliationInfo: userAttributes,
      schoolingRegistrationRepository,
      userRepository,
      obfuscationService,
    });

  if (!isNil(matchedSchoolingRegistration.userId)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
    throw new SchoolingRegistrationAlreadyLinkedToUserError(
      'Un compte existe déjà pour l‘élève dans le même établissement.'
    );
  }

  const isUsernameMode = userAttributes.withUsername;
  const cleanedUserAttributes = _emptyOtherMode(isUsernameMode, userAttributes);

  await _validateData({
    isUsernameMode,
    password,
    userAttributes: cleanedUserAttributes,
    userRepository,
  });

  const hashedPassword = await _encryptPassword(password, encryptionService);
  const domainUser = _createDomainUser(cleanedUserAttributes);

  const userId = await userService.createAndReconcileUserToSchoolingRegistration({
    hashedPassword,
    schoolingRegistrationId: matchedSchoolingRegistration.id,
    user: domainUser,
    authenticationMethodRepository,
    schoolingRegistrationRepository,
    userRepository,
  });

  const createdUser = await userRepository.get(userId);
  if (!isUsernameMode) {
    const redirectionUrl = getCampaignUrl(locale, campaignCode);
    await mailService.sendAccountCreationEmail(createdUser.email, locale, redirectionUrl);
  }
  return createdUser;
};
