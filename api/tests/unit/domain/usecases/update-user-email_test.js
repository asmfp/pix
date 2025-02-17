const bcrypt = require('bcrypt');

const updateUserEmail = require('../../../../lib/domain/usecases/update-user-email');
const {
  AlreadyRegisteredEmailError,
  UserNotAuthorizedToUpdateEmailError,
  InvalidPasswordForUpdateEmailError,
} = require('../../../../lib/domain/errors');

const { sinon, expect, catchErr } = require('../../../test-helper');

describe('Unit | UseCase | update-user-email', function () {
  let userRepository;
  let authenticationMethodRepository;
  let encryptionService;
  let mailService;

  const locale = undefined;
  const password = 'password123';
  // eslint-disable-next-line no-sync, mocha/no-setup-in-describe
  const passwordHash = bcrypt.hashSync(password, 1);

  beforeEach(function () {
    userRepository = {
      updateEmail: sinon.stub(),
      checkIfEmailIsAvailable: sinon.stub(),
      get: sinon.stub().resolves({ email: 'old_email@example.net' }),
    };

    authenticationMethodRepository = {
      findOneByUserIdAndIdentityProvider: sinon
        .stub()
        .resolves({ authenticationComplement: { password: passwordHash } }),
    };

    encryptionService = {
      checkPassword: sinon.stub().resolves(),
    };

    mailService = {
      notifyEmailChange: sinon.stub().resolves(),
    };
  });

  it('should call updateEmail', async function () {
    // given
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    await updateUserEmail({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(userRepository.updateEmail).to.have.been.calledWith({
      id: userId,
      email: newEmail,
    });
  });

  it('should call notifyEmailChange', async function () {
    // given
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    await updateUserEmail({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(mailService.notifyEmailChange).to.have.been.calledWith({
      email: newEmail,
      locale: undefined,
    });
  });

  it('should save email in lower case', async function () {
    // given
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'EMAIl_IN_UPPER_CASE@example.net';
    const newEmailInLowerCase = newEmail.toLowerCase();

    // when
    await updateUserEmail({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(userRepository.updateEmail).to.have.been.calledWith({
      id: userId,
      email: newEmailInLowerCase,
    });
  });

  it('should throw AlreadyRegisteredEmailError if email already exists', async function () {
    // given
    userRepository.checkIfEmailIsAvailable.rejects(new AlreadyRegisteredEmailError());
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(AlreadyRegisteredEmailError);
  });

  it('should throw UserNotAuthorizedToUpdateEmailError if the authenticated user try to change the email of an other user', async function () {
    // given
    const userId = 1;
    const authenticatedUserId = 2;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotAuthorizedToUpdateEmailError);
  });

  it('should throw UserNotAuthorizedToUpdateEmailError if user does not have an email', async function () {
    // given
    userRepository.get.resolves({});
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotAuthorizedToUpdateEmailError);
  });

  it('should throw InvalidPasswordForUpdateEmailError if the password is invalid', async function () {
    // given
    encryptionService.checkPassword.rejects();
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      locale,
      userRepository,
      authenticationMethodRepository,
      encryptionService,
      mailService,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidPasswordForUpdateEmailError);
  });
});
