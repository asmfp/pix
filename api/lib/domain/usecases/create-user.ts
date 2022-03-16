// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
const { AlreadyRegisteredEmailError, EntityValidationError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../validators/user-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../validators/password-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
const { getCampaignUrl } = require('../../infrastructure/utils/url-builder');

function _manageEmailAvailabilityError(error: any) {
  return _manageError(error, AlreadyRegisteredEmailError, 'email', 'ALREADY_REGISTERED_EMAIL');
}

function _manageError(error: any, errorType: any, attribute: any, message: any) {
  if (error instanceof errorType) {
    return new EntityValidationError({
      invalidAttributes: [{ attribute, message }],
    });
  }
  throw error;
}

function _validatePassword(password: any) {
  let result;
  try {
    passwordValidator.validate(password);
  } catch (err) {
    result = err;
  }
  return result;
}

async function _validateData({
  password,
  user,
  userRepository
}: any) {
  let userValidatorError;
  try {
    userValidator.validate({ user });
  } catch (err) {
    userValidatorError = err;
  }

  const passwordValidatorError = _validatePassword(password);

  const validationErrors = [];
  if (user.email) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    validationErrors.push(
      await userRepository.checkIfEmailIsAvailable(user.email).catch(_manageEmailAvailabilityError)
    );
  }
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
  validationErrors.push(userValidatorError);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
  validationErrors.push(passwordValidatorError);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'some' does not exist on type '{}'.
  if (validationErrors.some((error: any) => error instanceof Error)) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
    const relevantErrors = validationErrors.filter((error: any) => error instanceof Error);
    throw EntityValidationError.fromMultipleEntityValidationErrors(relevantErrors);
  }

  return true;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createUser({
  user,
  password,
  campaignCode,
  locale,
  authenticationMethodRepository,
  campaignRepository,
  userRepository,
  encryptionService,
  mailService,
  userService
}: any) {
  const isValid = await _validateData({
    password,
    user,
    userRepository,
  });

  const userHasValidatedPixTermsOfService = user.cgu === true;
  if (userHasValidatedPixTermsOfService) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    user.lastTermsOfServiceValidatedAt = new Date();
  }

  if (isValid) {
    const hashedPassword = await encryptionService.hashPassword(password);

    const savedUser = await userService.createUserWithPassword({
      user,
      hashedPassword,
      userRepository,
      authenticationMethodRepository,
    });

    let redirectionUrl = null;

    if (campaignCode) {
      const campaign = await campaignRepository.getByCode(campaignCode);
      if (campaign) {
        redirectionUrl = getCampaignUrl(locale, campaignCode);
      }
    }

    await mailService.sendAccountCreationEmail(savedUser.email, locale, redirectionUrl);

    return savedUser;
  }
};
