const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
const userReconciliationService = require('../../../../lib/domain/services/user-reconciliation-service');
const {
  AlreadyRegisteredUsernameError,
  NotFoundError,
  SchoolingRegistrationAlreadyLinkedToUserError,
  SchoolingRegistrationAlreadyLinkedToInvalidUserError,
} = require('../../../../lib/domain/errors');

describe('Unit | Service | user-reconciliation-service', function () {
  let schoolingRegistrations;

  beforeEach(function () {
    schoolingRegistrations = [
      domainBuilder.buildSchoolingRegistration({
        firstName: 'firstName',
        middleName: 'middleName',
        thirdName: 'thirdName',
        lastName: 'lastName',
        preferredLastName: 'preferredLastName',
      }),
      domainBuilder.buildSchoolingRegistration({
        firstName: 'secondRegistration_firstName',
        middleName: 'secondRegistration_middleName',
        thirdName: 'secondRegistration_thirdName',
        lastName: 'secondRegistration_lastName',
        preferredLastName: 'secondRegistration_preferredLastName',
      }),
    ];
  });

  describe('#findMatchingCandidateIdForGivenUser', function () {
    const user = {
      firstName: 'Joe',
      lastName: 'Poe',
    };

    context('When schoolingRegistration list is empty', function () {
      it('should return null', async function () {
        // when
        const result = await userReconciliationService.findMatchingCandidateIdForGivenUser([], user);

        // then
        expect(result).to.equal(null);
      });
    });

    context('When schoolingRegistration list is not empty', function () {
      context('When no schoolingRegistration matched on names', function () {
        it('should return null if name is completely different', async function () {
          // given
          user.firstName = 'Sam';

          schoolingRegistrations[0].firstName = 'Joe';
          schoolingRegistrations[0].lastName = user.lastName;

          // when
          const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
            schoolingRegistrations,
            user
          );

          // then
          expect(result).to.equal(null);
        });

        it('should return null if name is not close enough', async function () {
          // given
          user.firstName = 'Frédérique';

          schoolingRegistrations[0].firstName = 'Frédéric';
          schoolingRegistrations[0].lastName = user.lastName;

          // when
          const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
            schoolingRegistrations,
            user
          );

          // then
          expect(result).to.equal(null);
        });
      });

      // A contained context state 'When multiple matches'
      // So the context 'one schoolingRegistration matched' is ambiguous
      // Can it be replaced by 'When at least one schoolingRegistration matched on names' ?
      context('When one schoolingRegistration matched on names', function () {
        context('When schoolingRegistration found based on his...', function () {
          it('...firstName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...middleName', async function () {
            // given
            schoolingRegistrations[0].middleName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...thirdName', async function () {
            // given
            schoolingRegistrations[0].thirdName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...lastName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...preferredLastName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].preferredLastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...firstName with empty middleName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].middleName = null;
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...preferredLastName with empty lastName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].preferredLastName = user.lastName;
            schoolingRegistrations[0].lastName = null;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...lastName with empty preferredLastName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].preferredLastName = null;
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });
        });

        context('When schoolingRegistration found even if there is...', function () {
          it('...an accent', async function () {
            // given
            user.firstName = 'Joé';

            schoolingRegistrations[0].firstName = 'Joe';
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...a white space', async function () {
            // given
            user.firstName = 'Jo e';

            schoolingRegistrations[0].firstName = 'Joe';
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...a special character', async function () {
            // given
            user.firstName = 'Jo~e';

            schoolingRegistrations[0].firstName = 'Joe';
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });

          it('...a mistake', async function () {
            // given
            user.firstName = 'Joey';

            schoolingRegistrations[0].firstName = 'Joe';
            schoolingRegistrations[0].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });
        });

        context('When multiple matches', function () {
          it('should prefer firstName over middleName', async function () {
            // given
            schoolingRegistrations[0].middleName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            schoolingRegistrations[1].firstName = user.firstName;
            schoolingRegistrations[1].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[1].id);
          });

          it('should prefer middleName over thirdName', async function () {
            // given
            schoolingRegistrations[0].thirdName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            schoolingRegistrations[1].middleName = user.firstName;
            schoolingRegistrations[1].lastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(schoolingRegistrations[1].id);
          });

          it('should prefer nobody with same lastName and preferredLastName', async function () {
            // given
            schoolingRegistrations[0].firstName = user.firstName;
            schoolingRegistrations[0].lastName = user.lastName;

            schoolingRegistrations[1].firstName = user.firstName;
            schoolingRegistrations[1].preferredLastName = user.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              user
            );

            // then
            expect(result).to.equal(null);
          });
        });

        context('When two schoolingRegistrations are close', function () {
          const twin1 = { firstName: 'allan', lastName: 'Poe' };
          const twin2 = { firstName: 'alian', lastName: 'Poe' };

          it('should prefer the firstName that match perfectly', async function () {
            // given
            schoolingRegistrations[0].firstName = twin1.firstName;
            schoolingRegistrations[0].lastName = twin1.lastName;
            schoolingRegistrations[1].firstName = twin2.firstName;
            schoolingRegistrations[1].lastName = twin2.lastName;

            // when
            const result = await userReconciliationService.findMatchingCandidateIdForGivenUser(
              schoolingRegistrations,
              twin1
            );

            // then
            expect(result).to.equal(schoolingRegistrations[0].id);
          });
        });
      });
    });
  });

  describe('#findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser', function () {
    let user;
    let organizationId;
    let schoolingRegistrationRepositoryStub;

    beforeEach(function () {
      organizationId = domainBuilder.buildOrganization().id;
      schoolingRegistrationRepositoryStub = {
        findByOrganizationIdAndBirthdate: sinon.stub(),
      };
    });

    context('When schooling registrations are found for organization and birthdate', function () {
      beforeEach(function () {
        schoolingRegistrationRepositoryStub.findByOrganizationIdAndBirthdate.resolves(schoolingRegistrations);
      });

      context('When no schooling registrations matched on names', function () {
        it('should throw NotFoundError', async function () {
          // given
          user = {
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName',
          };

          // when
          const result = await catchErr(
            userReconciliationService.findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser
          )({
            organizationId,
            reconciliationInfo: user,
            schoolingRegistrationRepository: schoolingRegistrationRepositoryStub,
          });

          // then
          expect(result).to.be.instanceOf(NotFoundError);
          expect(result.message).to.equal('There were no schoolingRegistrations matching with names');
        });
      });

      context('When one schooling registration matched on names', function () {
        beforeEach(function () {
          user = {
            firstName: schoolingRegistrations[0].firstName,
            lastName: schoolingRegistrations[0].lastName,
          };
        });

        it('should return matched SchoolingRegistration', async function () {
          // when
          const result =
            await userReconciliationService.findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser({
              organizationId,
              reconciliationInfo: user,
              schoolingRegistrationRepository: schoolingRegistrationRepositoryStub,
            });

          // then
          expect(result).to.equal(schoolingRegistrations[0]);
        });
      });
    });

    context('When no schooling registrations found', function () {
      beforeEach(function () {
        schoolingRegistrationRepositoryStub.findByOrganizationIdAndBirthdate.resolves([]);
      });

      it('should throw NotFoundError', async function () {
        // given
        user = {
          firstName: 'fakeFirstName',
          lastName: 'fakeLastName',
        };

        // when
        const result = await catchErr(
          userReconciliationService.findMatchingSchoolingRegistrationIdForGivenOrganizationIdAndUser
        )({
          organizationId,
          reconciliationInfo: user,
          schoolingRegistrationRepository: schoolingRegistrationRepositoryStub,
        });

        // then
        expect(result).to.be.instanceOf(NotFoundError, 'There were no schoolingRegistrations matching');
      });
    });
  });

  describe('#findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser', function () {
    let user;
    let organizationId;
    let higherSchoolingRegistrationRepositoryStub;

    beforeEach(function () {
      organizationId = domainBuilder.buildOrganization().id;
      higherSchoolingRegistrationRepositoryStub = {
        findOneByStudentNumberAndBirthdate: sinon.stub(),
      };
    });

    context('When schooling registrations are found for organization and birthdate', function () {
      beforeEach(function () {
        higherSchoolingRegistrationRepositoryStub.findOneByStudentNumberAndBirthdate.resolves(
          schoolingRegistrations[0]
        );
      });

      context('When no schooling registrations matched on names', function () {
        it('should throw an error', async function () {
          // given
          user = {
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName',
          };

          // when
          const error = await catchErr(
            userReconciliationService.findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser
          )({
            organizationId,
            reconciliationInfo: user,
            higherSchoolingRegistrationRepository: higherSchoolingRegistrationRepositoryStub,
          });

          // then
          expect(error).to.be.instanceOf(NotFoundError);
        });
      });

      context('When one schooling registration matched on names', function () {
        beforeEach(function () {
          user = {
            firstName: schoolingRegistrations[0].firstName,
            lastName: schoolingRegistrations[0].lastName,
          };
        });

        context('When schoolingRegistration is already linked', function () {
          beforeEach(function () {
            schoolingRegistrations[0].userId = '123';
          });

          it('should throw an error', async function () {
            // given
            higherSchoolingRegistrationRepositoryStub.findOneByStudentNumberAndBirthdate.resolves(
              schoolingRegistrations[0]
            );

            // when
            const result = await catchErr(
              userReconciliationService.findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser
            )({
              organizationId,
              reconciliationInfo: user,
              higherSchoolingRegistrationRepository: higherSchoolingRegistrationRepositoryStub,
            });

            // then
            expect(result).to.be.instanceOf(SchoolingRegistrationAlreadyLinkedToUserError);
          });
        });

        context('When schoolingRegistration is not already linked', function () {
          it('should return matched SchoolingRegistration', async function () {
            // when
            const result =
              await userReconciliationService.findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser({
                organizationId,
                reconciliationInfo: user,
                higherSchoolingRegistrationRepository: higherSchoolingRegistrationRepositoryStub,
              });

            // then
            expect(result).to.equal(schoolingRegistrations[0]);
          });
        });
      });
    });

    context('When no schooling registrations found', function () {
      beforeEach(function () {
        higherSchoolingRegistrationRepositoryStub.findOneByStudentNumberAndBirthdate.resolves(null);
      });

      it('should throw an error', async function () {
        // given
        user = {
          firstName: 'fakeFirstName',
          lastName: 'fakeLastName',
        };

        // when
        const error = await catchErr(
          userReconciliationService.findMatchingHigherSchoolingRegistrationIdForGivenOrganizationIdAndUser
        )({
          organizationId,
          reconciliationInfo: user,
          higherSchoolingRegistrationRepository: higherSchoolingRegistrationRepositoryStub,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  describe('#generateUsernameUntilAvailable', function () {
    let userRepository;

    beforeEach(function () {
      userRepository = {
        isUsernameAvailable: sinon.stub(),
      };
    });

    it('should generate a username with original inputs', async function () {
      // given
      const firstPart = 'firstname.lastname';
      const secondPart = '0101';

      userRepository.isUsernameAvailable.resolves();
      const expectedUsername = firstPart + secondPart;

      // when
      const result = await userReconciliationService.generateUsernameUntilAvailable({
        firstPart,
        secondPart,
        userRepository,
      });

      // then
      expect(result).to.equal(expectedUsername);
    });

    it('should generate an other username when exist with original inputs', async function () {
      // given
      const firstPart = 'firstname.lastname';
      const secondPart = '0101';

      userRepository.isUsernameAvailable
        .onFirstCall()
        .rejects(new AlreadyRegisteredUsernameError())
        .onSecondCall()
        .resolves();

      const originalUsername = firstPart + secondPart;

      // when
      const result = await userReconciliationService.generateUsernameUntilAvailable({
        firstPart,
        secondPart,
        userRepository,
      });

      // then
      expect(result).to.not.equal(originalUsername);
    });
  });

  describe('#createUsernameByUserAndStudentId', function () {
    const user = {
      firstName: 'fakeFirst-Name',
      lastName: 'fake LastName',
      birthdate: '2008-03-01',
    };
    const originaldUsername = 'fakefirstname.fakelastname0103';

    let userRepository;

    beforeEach(function () {
      userRepository = {
        isUsernameAvailable: sinon.stub(),
      };
    });

    it('should generate a username with original user properties', async function () {
      // given
      userRepository.isUsernameAvailable.resolves();

      // when
      const result = await userReconciliationService.createUsernameByUser({ user, userRepository });

      // then
      expect(result).to.equal(originaldUsername);
    });

    it('should generate a other username when exist whith original inputs', async function () {
      // given
      userRepository.isUsernameAvailable
        .onFirstCall()
        .rejects(new AlreadyRegisteredUsernameError())
        .onSecondCall()
        .resolves();

      // when
      const result = await userReconciliationService.createUsernameByUser({ user, userRepository });

      // then
      expect(result).to.not.equal(originaldUsername);
    });
  });

  describe('#checkIfStudentHasAnAlreadyReconciledAccount', function () {
    let userRepositoryStub;
    let obfuscationServiceStub;
    let studentRepositoryStub;

    beforeEach(function () {
      userRepositoryStub = {
        getForObfuscation: sinon.stub(),
      };
      obfuscationServiceStub = {
        getUserAuthenticationMethodWithObfuscation: sinon.stub(),
      };
      studentRepositoryStub = {
        getReconciledStudentByNationalStudentId: sinon.stub(),
      };
    });

    context('When student is already reconciled in the same organization', function () {
      context('When the reconciled account has an email', function () {
        it('should return a SchoolingRegistrationAlreadyLinkedToUserError with ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION code', async function () {
          // given
          const schoolingRegistration = domainBuilder.buildSchoolingRegistration();
          const user = domainBuilder.buildUser({ email: 'test@example.net' });
          schoolingRegistration.userId = user.id;

          userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
          obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).returns({
            authenticatedBy: 'email',
            value: 't***@example.net',
          });

          // when
          const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
            schoolingRegistration,
            userRepositoryStub,
            obfuscationServiceStub,
            studentRepositoryStub
          );

          // then
          expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToUserError);
          expect(error.message).to.equal('Un compte existe déjà pour l‘élève dans le même établissement.');
          expect(error.code).to.equal('ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION');
          expect(error.meta.shortCode).to.equal('R31');
          expect(error.meta.value).to.equal('t***@example.net');
          expect(error.meta.userId).to.equal(user.id);
        });
      });

      context('When the reconciled account as a username', function () {
        it('should return a SchoolingRegistrationAlreadyLinkedToUserError with ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION code', async function () {
          // given
          const schoolingRegistration = domainBuilder.buildSchoolingRegistration();
          const user = domainBuilder.buildUser({ username: 'john.doe0101' });
          schoolingRegistration.userId = user.id;

          userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
          obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).returns({
            authenticatedBy: 'username',
            value: 'j***.d***0101',
          });

          // when
          const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
            schoolingRegistration,
            userRepositoryStub,
            obfuscationServiceStub,
            studentRepositoryStub
          );

          // then
          expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToUserError);
          expect(userRepositoryStub.getForObfuscation).to.have.been.calledWith(user.id);
          expect(error.message).to.equal('Un compte existe déjà pour l‘élève dans le même établissement.');
          expect(error.code).to.equal('ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION');
          expect(error.meta.shortCode).to.equal('R32');
          expect(error.meta.value).to.equal('j***.d***0101');
          expect(error.meta.userId).to.equal(user.id);
        });
      });

      context('When the reconciled account as a samlId', function () {
        it('should return a SchoolingRegistrationAlreadyLinkedToUserError with ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION code', async function () {
          // given
          const schoolingRegistration = domainBuilder.buildSchoolingRegistration();
          const user = domainBuilder.buildUser({ samlId: 'samlId' });
          schoolingRegistration.userId = user.id;

          userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
          obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).returns({
            authenticatedBy: 'samlId',
            value: null,
          });

          // when
          const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
            schoolingRegistration,
            userRepositoryStub,
            obfuscationServiceStub,
            studentRepositoryStub
          );

          // then
          expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToUserError);
          expect(userRepositoryStub.getForObfuscation).to.have.been.calledWith(user.id);
          expect(error.message).to.equal('Un compte existe déjà pour l‘élève dans le même établissement.');
          expect(error.code).to.equal('ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION');
          expect(error.meta.shortCode).to.equal('R33');
          expect(error.meta.value).to.equal(null);
          expect(error.meta.userId).to.equal(user.id);
        });
      });
    });

    context('When student is already reconciled in an other organization', function () {
      context('When the reconciled account as an email', function () {
        it('should return a SchoolingRegistrationAlreadyLinkedToUserError with ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION code', async function () {
          // given
          const nationalStudentId = 'nationalStudentId';
          const schoolingRegistration = domainBuilder.buildSchoolingRegistration({ nationalStudentId });
          const user = domainBuilder.buildUser({ email: 'test@example.net' });

          studentRepositoryStub.getReconciledStudentByNationalStudentId
            .withArgs(nationalStudentId)
            .resolves({ account: { userId: user.id } });
          userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
          obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).returns({
            authenticatedBy: 'email',
            value: 't***@example.net',
          });

          // when
          const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
            schoolingRegistration,
            userRepositoryStub,
            obfuscationServiceStub,
            studentRepositoryStub
          );

          // then
          expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToUserError);
          expect(error.message).to.equal('Un compte existe déjà pour l‘élève dans un autre établissement.');
          expect(error.code).to.equal('ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION');
          expect(error.meta.shortCode).to.equal('R11');
          expect(error.meta.value).to.equal('t***@example.net');
          expect(error.meta.userId).to.equal(user.id);
        });
      });

      context('When the reconciled account as a username', function () {
        it('should return a SchoolingRegistrationAlreadyLinkedToUserError with ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION code', async function () {
          // given
          const nationalStudentId = 'nationalStudentId';
          const schoolingRegistration = domainBuilder.buildSchoolingRegistration({ nationalStudentId });
          const user = domainBuilder.buildUser({ username: 'john.doe0101' });

          studentRepositoryStub.getReconciledStudentByNationalStudentId
            .withArgs(nationalStudentId)
            .resolves({ account: { userId: user.id } });
          userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
          obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).returns({
            authenticatedBy: 'username',
            value: 'j***.d***0101',
          });

          // when
          const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
            schoolingRegistration,
            userRepositoryStub,
            obfuscationServiceStub,
            studentRepositoryStub
          );

          // then
          expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToUserError);
          expect(userRepositoryStub.getForObfuscation).to.have.been.calledWith(user.id);
          expect(error.message).to.equal('Un compte existe déjà pour l‘élève dans un autre établissement.');
          expect(error.code).to.equal('ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION');
          expect(error.meta.shortCode).to.equal('R12');
          expect(error.meta.value).to.equal('j***.d***0101');
          expect(error.meta.userId).to.equal(user.id);
        });
      });

      context('When the reconciled account as a samlId', function () {
        it('should return a SchoolingRegistrationAlreadyLinkedToUserError with ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION code', async function () {
          // given
          const nationalStudentId = 'nationalStudentId';
          const schoolingRegistration = domainBuilder.buildSchoolingRegistration({ nationalStudentId });
          const user = domainBuilder.buildUser({ samlId: 'samlId' });

          studentRepositoryStub.getReconciledStudentByNationalStudentId
            .withArgs(nationalStudentId)
            .resolves({ account: { userId: user.id } });
          userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
          obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).returns({
            authenticatedBy: 'samlId',
            value: null,
          });

          // when
          const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
            schoolingRegistration,
            userRepositoryStub,
            obfuscationServiceStub,
            studentRepositoryStub
          );

          // then
          expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToUserError);
          expect(userRepositoryStub.getForObfuscation).to.have.been.calledWith(user.id);
          expect(error.message).to.equal('Un compte existe déjà pour l‘élève dans un autre établissement.');
          expect(error.code).to.equal('ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION');
          expect(error.meta.shortCode).to.equal('R13');
          expect(error.meta.value).to.equal(null);
          expect(error.meta.userId).to.equal(user.id);
        });
      });
    });

    context('When student has an invalid reconciliation', function () {
      it('should return a SchoolingRegistrationAlreadyLinkedToInvalidUserError', async function () {
        // given
        const nationalStudentId = 'nationalStudentId';
        const user = domainBuilder.buildUser({
          email: null,
          username: null,
          authenticationMethods: [],
        });
        const schoolingRegistration = domainBuilder.buildSchoolingRegistration({ nationalStudentId, userId: user.id });

        studentRepositoryStub.getReconciledStudentByNationalStudentId
          .withArgs(nationalStudentId)
          .resolves({ account: { userId: user.id } });
        userRepositoryStub.getForObfuscation.withArgs(user.id).resolves(user);
        obfuscationServiceStub.getUserAuthenticationMethodWithObfuscation.withArgs(user).rejects(new NotFoundError());

        // when
        const error = await catchErr(userReconciliationService.checkIfStudentHasAnAlreadyReconciledAccount)(
          schoolingRegistration,
          userRepositoryStub,
          obfuscationServiceStub,
          studentRepositoryStub
        );

        // then
        expect(error).to.be.instanceof(SchoolingRegistrationAlreadyLinkedToInvalidUserError);
        expect(error.message).to.equal('Élève rattaché avec un compte invalide.');
      });
    });
  });
});
