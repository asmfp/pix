const {
  databaseBuilder,
  expect,
  insertUserWithRolePixMaster,
  generateValidRequestAuthorizationHeader,
  generateIdTokenForExternalUser,
  knex,
} = require('../../test-helper');

const createServer = require('../../../server');
const Membership = require('../../../lib/domain/models/Membership');
const AuthenticationMethod = require('../../../lib/domain/models/AuthenticationMethod');

describe('Acceptance | Controller | Schooling-registration-user-associations', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('POST /api/schooling-registration-user-associations/', function () {
    let organization;
    let campaign;
    let options;
    let schoolingRegistration;
    let user;

    beforeEach(async function () {
      // given
      options = {
        method: 'POST',
        url: '/api/schooling-registration-user-associations',
        headers: {},
        payload: {},
      };

      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization({ type: 'SCO' });
      schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
        firstName: 'france',
        lastName: 'gall',
        birthdate: '2001-01-01',
        organizationId: organization.id,
        userId: null,
        nationalStudentId: 'francegall123',
      });
      campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });

      await databaseBuilder.commit();
    });

    context('associate user with firstName, lastName and birthdate', function () {
      it('should return an 200 status after having successfully associated user to schoolingRegistration', async function () {
        // given
        options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
        options.payload.data = {
          attributes: {
            'campaign-code': campaign.code,
            'first-name': schoolingRegistration.firstName,
            'last-name': schoolingRegistration.lastName,
            birthdate: schoolingRegistration.birthdate,
          },
        };
        options.url += '?withReconciliation=true';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      context('When student is already reconciled in the same organization', function () {
        it('should return a schooling registration already linked error (short code R31 when account with email)', async function () {
          // given
          const userWithEmailOnly = databaseBuilder.factory.buildUser({
            username: null,
            email: 'john.harry@example.net',
          });
          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: organization.id,
            userId: null,
          });
          schoolingRegistration.userId = userWithEmailOnly.id;
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans le même établissement.',
            meta: { shortCode: 'R31', value: 'j***@example.net', userId: userWithEmailOnly.id },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithEmailOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code R32 when connected with username)', async function () {
          // given
          const userWithUsernameOnly = databaseBuilder.factory.buildUser({
            username: 'john.harry0702',
            email: null,
          });
          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: organization.id,
            userId: null,
          });
          schoolingRegistration.userId = userWithUsernameOnly.id;
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans le même établissement.',
            meta: { shortCode: 'R32', value: 'j***.h***2', userId: userWithUsernameOnly.id },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithUsernameOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code R33 when account with samlId)', async function () {
          // given
          const userWithSamlOnly = databaseBuilder.factory.buildUser({
            username: null,
            email: null,
          });
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: '12345678',
            userId: userWithSamlOnly.id,
          });

          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: organization.id,
            userId: null,
          });
          schoolingRegistration.userId = userWithSamlOnly.id;
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans le même établissement.',
            meta: { shortCode: 'R33', value: null, userId: userWithSamlOnly.id },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithSamlOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });
      });

      context('When student is already reconciled in another organization', function () {
        it('should return a schooling registration already linked error (short code R13 when account with samlId)', async function () {
          // given
          const userWithSamlIdOnly = databaseBuilder.factory.buildUser({
            email: null,
            username: null,
          });
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: '12345678',
            userId: userWithSamlIdOnly.id,
          });

          const otherSchoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration();
          otherSchoolingRegistration.nationalStudentId = schoolingRegistration.nationalStudentId;
          otherSchoolingRegistration.birthdate = schoolingRegistration.birthdate;
          otherSchoolingRegistration.firstName = schoolingRegistration.firstName;
          otherSchoolingRegistration.lastName = schoolingRegistration.lastName;
          otherSchoolingRegistration.userId = userWithSamlIdOnly.id;
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans un autre établissement.',
            meta: { shortCode: 'R13', value: null, userId: userWithSamlIdOnly.id },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithSamlIdOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code R11 when account with email)', async function () {
          // given
          const userWithEmailOnly = databaseBuilder.factory.buildUser({
            username: null,
            email: 'john.harry@example.net',
          });
          const otherSchoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration();
          otherSchoolingRegistration.nationalStudentId = schoolingRegistration.nationalStudentId;
          otherSchoolingRegistration.birthdate = schoolingRegistration.birthdate;
          otherSchoolingRegistration.firstName = schoolingRegistration.firstName;
          otherSchoolingRegistration.lastName = schoolingRegistration.lastName;
          otherSchoolingRegistration.userId = userWithEmailOnly.id;

          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans un autre établissement.',
            meta: { shortCode: 'R11', value: 'j***@example.net', userId: userWithEmailOnly.id },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithEmailOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code R12 when connected with username)', async function () {
          // given
          const userWithUsernameOnly = databaseBuilder.factory.buildUser({
            email: null,
            username: 'john.harry0702',
          });

          const otherSchoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration();
          otherSchoolingRegistration.nationalStudentId = schoolingRegistration.nationalStudentId;
          otherSchoolingRegistration.birthdate = schoolingRegistration.birthdate;
          otherSchoolingRegistration.firstName = schoolingRegistration.firstName;
          otherSchoolingRegistration.lastName = schoolingRegistration.lastName;
          otherSchoolingRegistration.userId = userWithUsernameOnly.id;
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans un autre établissement.',
            meta: { shortCode: 'R12', value: 'j***.h***2', userId: userWithUsernameOnly.id },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithUsernameOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });
      });

      context('when no schoolingRegistration can be associated because birthdate does not match', function () {
        it('should return an 404 NotFoundError error', async function () {
          // given
          const options = {
            method: 'POST',
            url: '/api/schooling-registration-user-associations/',
            headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
            payload: {
              data: {
                attributes: {
                  'campaign-code': campaign.code,
                  'first-name': schoolingRegistration.firstName,
                  'last-name': schoolingRegistration.lastName,
                  birthdate: '1990-03-01',
                },
              },
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
          expect(response.result.errors[0].detail).to.equal('There are no schooling registrations found');
        });
      });

      context('when no schoolingRegistration found to associate because names does not match', function () {
        it('should return an 404 NotFoundError error', async function () {
          // given
          const options = {
            method: 'POST',
            url: '/api/schooling-registration-user-associations/',
            headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
            payload: {
              data: {
                attributes: {
                  'campaign-code': campaign.code,
                  'first-name': 'wrong firstName',
                  'last-name': 'wrong lastName',
                  birthdate: schoolingRegistration.birthdate,
                },
              },
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
          expect(response.result.errors[0].detail).to.equal('There were no schoolingRegistrations matching with names');
        });
      });

      context('when user is not authenticated', function () {
        it('should respond with a 401 - unauthorized access', async function () {
          // given
          options.headers.authorization = 'invalid.access.token';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(401);
        });
      });

      context('when a field is not valid', function () {
        it('should respond with a 422 - Unprocessable Entity', async function () {
          // given
          const options = {
            method: 'POST',
            url: '/api/schooling-registration-user-associations/',
            headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
            payload: {
              data: {
                attributes: {
                  'campaign-code': campaign.code,
                  'first-name': ' ',
                  'last-name': schoolingRegistration.lastName,
                  birthdate: schoolingRegistration.birthdate,
                },
              },
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(422);
        });
      });

      context('When withReconciliation query param is set to false', function () {
        it('should not reconcile user and return a 204 No Content', async function () {
          // given
          options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };
          options.url += '?withReconciliation=false';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
          const schoolingRegistrationInDB = await knex('organization-learners')
            .where({
              firstName: schoolingRegistration.firstName,
              lastName: schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            })
            .select();
          expect(schoolingRegistrationInDB.userId).to.be.undefined;
        });

        context('When student is trying to be reconciled on another account', function () {
          it('should return a 422 error (short code R90 when student id and birthdate are different)', async function () {
            // given
            const sisterSchool = databaseBuilder.factory.buildOrganization({ id: 7, type: 'SCO' });
            const brotherSchool = databaseBuilder.factory.buildOrganization({ id: 666, type: 'SCO' });
            const littleBrotherCampaign = databaseBuilder.factory.buildCampaign({
              organizationId: brotherSchool.id,
              code: 'BROTHER',
            });

            const bigSisterAccount = databaseBuilder.factory.buildUser({
              firstName: 'Emmy',
              lastName: 'Barbier',
              birthdate: '2008-02-01',
              email: 'emmy.barbier@example.net',
            });
            databaseBuilder.factory.buildSchoolingRegistration({
              firstName: 'Emmy',
              lastName: 'Barbier',
              birthdate: '2008-02-01',
              organizationId: sisterSchool.id,
              nationalStudentId: 'BBCC',
              userId: bigSisterAccount.id,
            });

            const littleBrother = databaseBuilder.factory.buildSchoolingRegistration({
              firstName: 'Nicolas',
              lastName: 'Barbier',
              birthdate: '2010-02-01',
              organizationId: brotherSchool.id,
              nationalStudentId: 'AABB',
              userId: null,
            });
            await databaseBuilder.commit();

            // when
            const response = await server.inject({
              method: 'POST',
              url: '/api/schooling-registration-user-associations?withReconciliation=false',
              headers: { authorization: generateValidRequestAuthorizationHeader(bigSisterAccount.id) },
              payload: {
                data: {
                  attributes: {
                    'campaign-code': littleBrotherCampaign.code,
                    'first-name': littleBrother.firstName,
                    'last-name': littleBrother.lastName,
                    birthdate: littleBrother.birthdate,
                  },
                },
              },
            });

            // then
            expect(response.statusCode).to.equal(422);
            expect(response.result.errors[0]).to.deep.equal({
              detail: "Cet utilisateur n'est pas autorisé à se réconcilier avec ce compte",
              code: 'ACCOUNT_SEEMS_TO_BELONGS_TO_ANOTHER_USER',
              meta: {
                shortCode: 'R90',
              },
              status: '422',
              title: 'Unprocessable entity',
            });
          });
        });
      });
    });
  });

  describe('POST /api/schooling-registration-dependent-users/external-user-token/', function () {
    let organization;
    let campaign;
    let options;
    let schoolingRegistration;

    beforeEach(async function () {
      // given
      options = {
        method: 'POST',
        url: '/api/schooling-registration-dependent-users/external-user-token/',
        headers: {},
        payload: {},
      };

      organization = databaseBuilder.factory.buildOrganization({ identityProvider: 'SCO' });
      schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
        firstName: 'josé',
        lastName: 'bové',
        birthdate: '2020-01-01',
        nationalStudentId: 'josébové123',
        organizationId: organization.id,
        userId: null,
      });
      campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });
      await databaseBuilder.commit();
    });

    afterEach(function () {
      return knex('authentication-methods').delete();
    });

    context('when an external user try to reconcile for the first time', function () {
      it('should return an 200 status after having successfully created the user and associated it to schoolingRegistration', async function () {
        // given
        const externalUser = {
          lastName: schoolingRegistration.lastName,
          firstName: schoolingRegistration.firstName,
          samlId: '123456789',
        };
        const idTokenForExternalUser = generateIdTokenForExternalUser(externalUser);

        options.payload.data = {
          attributes: {
            'campaign-code': campaign.code,
            'external-user-token': idTokenForExternalUser,
            birthdate: schoolingRegistration.birthdate,
            'access-token': null,
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      context('When external user is already reconciled', function () {
        it('should replace the existing user samlId already reconciled in the other organization with the authenticated user samlId', async function () {
          // given
          const user = databaseBuilder.factory.buildUser({
            firstName: schoolingRegistration.firstName,
            lastName: schoolingRegistration.lastName,
            birthdate: schoolingRegistration.birthdate,
          });
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: '12345678',
            userId: user.id,
          });

          const otherOrganization = databaseBuilder.factory.buildOrganization({ type: 'SCO' });
          databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: otherOrganization.id,
            firstName: schoolingRegistration.firstName,
            lastName: schoolingRegistration.lastName,
            birthdate: schoolingRegistration.birthdate,
            nationalStudentId: schoolingRegistration.nationalStudentId,
            userId: user.id,
          });
          await databaseBuilder.commit();

          const externalUser = {
            lastName: schoolingRegistration.lastName,
            firstName: schoolingRegistration.firstName,
            samlId: '9876654321',
          };
          const idTokenForExternalUser = generateIdTokenForExternalUser(externalUser);

          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'external-user-token': idTokenForExternalUser,
              birthdate: schoolingRegistration.birthdate,
              'access-token': null,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.payload).to.contains('access-token');
          const result = await knex('authentication-methods').where({
            userId: user.id,
            identityProvider: AuthenticationMethod.identityProviders.GAR,
          });
          const garAuthenticationMethod = result[0];
          expect(garAuthenticationMethod.externalIdentifier).to.equal(externalUser.samlId);
        });

        it('should replace the existing user samlId already reconciled in the same organization found with the authenticated user samlId', async function () {
          // given
          const userWithSamlIdOnly = databaseBuilder.factory.buildUser();
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: '12345678',
            userId: userWithSamlIdOnly.id,
          });

          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: organization.id,
            userId: userWithSamlIdOnly.id,
            firstName: userWithSamlIdOnly.firstName,
            lastName: userWithSamlIdOnly.lastName,
            birthdate: userWithSamlIdOnly.birthdate,
          });
          await databaseBuilder.commit();

          const externalUser = {
            lastName: schoolingRegistration.lastName,
            firstName: schoolingRegistration.firstName,
            samlId: '9876654321',
          };
          const idTokenForExternalUser = generateIdTokenForExternalUser(externalUser);

          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'external-user-token': idTokenForExternalUser,
              birthdate: schoolingRegistration.birthdate,
              'access-token': null,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.payload).to.contains('access-token');
          const result = await knex('authentication-methods').where({
            userId: userWithSamlIdOnly.id,
            identityProvider: AuthenticationMethod.identityProviders.GAR,
          });
          const garAuthenticationMethod = result[0];
          expect(garAuthenticationMethod.externalIdentifier).to.equal(externalUser.samlId);
        });
      });

      context('when external user id token is not valid', function () {
        it('should respond with a 401 - unauthorized access', async function () {
          // given
          const invalidIdToken = 'invalid.id.token';

          options.payload.data = {
            attributes: {
              'campaign-code': campaign.code,
              'external-user-token': invalidIdToken,
              birthdate: schoolingRegistration.birthdate,
              'access-token': null,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(401);
        });
      });
    });
  });

  describe('POST /api/schooling-registration-user-associations/auto', function () {
    const nationalStudentId = '12345678AZ';
    let organization;
    let campaign;
    let options;
    let user;

    beforeEach(async function () {
      // given
      options = {
        method: 'POST',
        url: '/api/schooling-registration-user-associations/auto',
        headers: {},
        payload: {},
      };

      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization();
      campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });
      databaseBuilder.factory.buildSchoolingRegistration({
        organizationId: organization.id,
        userId: null,
        nationalStudentId,
      });

      await databaseBuilder.commit();
    });

    it('should return an 200 status after having successfully associated user to schoolingRegistration', async function () {
      // given
      databaseBuilder.factory.buildSchoolingRegistration({ userId: user.id, nationalStudentId });
      await databaseBuilder.commit();

      options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
      options.payload.data = {
        attributes: {
          'campaign-code': campaign.code,
        },
        type: 'schooling-registration-user-associations',
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    context('when user is not authenticated', function () {
      it('should respond with a 401 - unauthorized access', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    context('when user could not be reconciled', function () {
      it('should respond with a 422 - unprocessable entity', async function () {
        // given
        options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
        options.payload.data = {
          attributes: {
            'campaign-code': campaign.code,
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(422);
      });
    });
  });

  describe('POST /api/schooling-registration-user-associations/student', function () {
    let organization;
    let campaign;
    let options;
    let user;

    beforeEach(async function () {
      // given
      options = {
        method: 'POST',
        url: '/api/schooling-registration-user-associations/student',
        headers: {},
        payload: {},
      };

      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization();
      campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });
      databaseBuilder.factory.buildSchoolingRegistration({
        firstName: 'Jean',
        lastName: 'Michel',
        birthdate: new Date('2010-01-01'),
        studentNumber: '12345',
        organizationId: organization.id,
        userId: null,
      });

      await databaseBuilder.commit();
    });

    it('should return an 204 status after updating higher schooling registration', async function () {
      // given
      options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
      options.payload.data = {
        attributes: {
          'student-number': '12345',
          'first-name': 'Jean',
          'last-name': 'Michel',
          birthdate: '2010-01-01',
          'campaign-code': campaign.code,
        },
        type: 'schooling-registration-user-associations',
      };

      // when
      const response = await server.inject(options);
      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  describe('GET /api/schooling-registration-user-associations/', function () {
    let options;
    let user;
    let organization;
    let schoolingRegistration;
    let campaignCode;

    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization({ isManagingStudents: true });
      campaignCode = databaseBuilder.factory.buildCampaign({ organizationId: organization.id, code: 'YUTR789' }).code;
      user = databaseBuilder.factory.buildUser();
      schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
        firstName: 'josé',
        lastName: 'bové',
        birthdate: '2020-01-01',
        nationalStudentId: 'josébové123',
        organizationId: organization.id,
        userId: user.id,
      });
      await databaseBuilder.commit();
      options = {
        method: 'GET',
        url: `/api/schooling-registration-user-associations/?userId=${user.id}&campaignCode=${campaignCode}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };
    });

    describe('Resource access management', function () {
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      it('should respond with a 403 - forbidden access - if requested user is not the same as authenticated user', async function () {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    describe('Success case', function () {
      it('should return the schoolingRegistration linked to the user and a 200 status code response', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['first-name']).to.deep.equal(schoolingRegistration.firstName);
        expect(response.result.data.attributes['last-name']).to.deep.equal(schoolingRegistration.lastName);
        expect(response.result.data.attributes['birthdate']).to.deep.equal(schoolingRegistration.birthdate);
      });
    });

    describe('There is no schoolingRegistration linked to the user', function () {
      it('should return a data null', async function () {
        // given
        const userWithoutStudent = databaseBuilder.factory.buildUser({
          firstName: 'jack',
          lastName: 'black',
        });
        await databaseBuilder.commit();

        options = {
          method: 'GET',
          url: `/api/schooling-registration-user-associations/?userId=${userWithoutStudent.id}&campaignCode=${campaignCode}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userWithoutStudent.id) },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.equal(null);
      });
    });

    describe('There is no schoolingRegistration linked to the organization owning the campaign', function () {
      it('should return a data null', async function () {
        // given
        const otherCampaignCode = databaseBuilder.factory.buildCampaign({ code: 'ABCDE123' }).code;
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/schooling-registration-user-associations/?userId=${user.id}&campaignCode=${otherCampaignCode}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.equal(null);
      });
    });
  });

  describe('PUT /api/schooling-registration-user-associations/possibilities', function () {
    let options;
    let user;
    let organization;
    let schoolingRegistration;
    let campaignCode;

    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization({
        isManagingStudents: true,
        type: 'SCO',
      });
      campaignCode = databaseBuilder.factory.buildCampaign({
        organizationId: organization.id,
      }).code;
      user = databaseBuilder.factory.buildUser();
      schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
        organizationId: organization.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: null,
        nationalStudentId: 'nsi123ABC',
      });
      await databaseBuilder.commit();

      options = {
        method: 'PUT',
        url: '/api/schooling-registration-user-associations/possibilities',
        headers: {},
        payload: {
          data: {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          },
        },
      };
    });

    describe('Success case', function () {
      it('should return the schoolingRegistration linked to the user and a 200 status code response', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    describe('Error cases', function () {
      context('when no schoolingRegistration can be associated because birthdate does not match', function () {
        it('should respond with a 404 - Not Found', async function () {
          // given
          options.payload.data.attributes.birthdate = '1990-03-01';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
          expect(response.result.errors[0].detail).to.equal(
            'There were no schoolingRegistrations matching with organization and birthdate'
          );
        });
      });

      context('when no schoolingRegistration found to associate because names does not match', function () {
        it('should respond with a 404 - Not Found', async function () {
          // given
          options.payload.data.attributes['first-name'] = 'wrong firstName';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
          expect(response.result.errors[0].detail).to.equal('There were no schoolingRegistrations matching with names');
        });
      });

      context('when schoolingRegistration is already associated in the same organization', function () {
        it('should return a schooling registration already linked error (short code S51 when account with email)', async function () {
          // given
          const userWithEmailOnly = databaseBuilder.factory.buildUser({
            username: null,
            email: 'john.harry@example.net',
          });
          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: organization.id,
            userId: userWithEmailOnly.id,
          });
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans le même établissement.',
            meta: { shortCode: 'S51', value: 'j***@example.net' },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithEmailOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code S52 when connected with username)', async function () {
          // given
          const userWithUsernameOnly = databaseBuilder.factory.buildUser({
            username: 'john.harry0702',
            email: null,
          });
          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            organizationId: organization.id,
            userId: userWithUsernameOnly.id,
          });
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans le même établissement.',
            meta: { shortCode: 'S52', value: 'j***.h***2' },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithUsernameOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code S53 when account with samlId)', async function () {
          // given
          const userWithEmailOnly = databaseBuilder.factory.buildUser({
            username: null,
            email: null,
          });
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: '12345678',
            userId: userWithEmailOnly.id,
          });

          const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
            firstName: 'Sam',
            lastName: 'Lebrave',
            birthdate: '2015-10-10',
            nationalStudentId: 'samlebrave',
            organizationId: organization.id,
            userId: null,
          });
          schoolingRegistration.userId = userWithEmailOnly.id;
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans le même établissement.',
            meta: { shortCode: 'S53', value: null },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithEmailOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });
      });

      context('when schoolingRegistration is already associated in others organizations', function () {
        it('should respond with a 409 - Conflict', async function () {
          // given
          const schoolingRegistrationAlreadyMatched = databaseBuilder.factory.buildSchoolingRegistration({
            birthdate: '2005-05-15',
            firstName: user.firstName,
            lastName: user.lastName,
            organizationId: organization.id,
            userId: user.id,
            nationalStudentId: 'coucoucloclo',
          });
          await databaseBuilder.commit();

          options.payload.data.attributes['first-name'] = schoolingRegistrationAlreadyMatched.firstName;
          options.payload.data.attributes['last-name'] = schoolingRegistrationAlreadyMatched.lastName;
          options.payload.data.attributes.birthdate = schoolingRegistrationAlreadyMatched.birthdate;

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0].detail).to.equal(
            'Un compte existe déjà pour l‘élève dans le même établissement.'
          );
        });

        it('should return a schooling registration already linked error (short code S61 when account with email)', async function () {
          // given
          const userWithEmailOnly = databaseBuilder.factory.buildUser({
            username: null,
            email: 'john.harry@example.net',
          });
          databaseBuilder.factory.buildSchoolingRegistration({
            nationalStudentId: schoolingRegistration.nationalStudentId,
            birthdate: schoolingRegistration.birthdate,
            firstName: schoolingRegistration.firstName,
            lastName: schoolingRegistration.lastName,
            userId: userWithEmailOnly.id,
          });
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans un autre établissement.',
            meta: { shortCode: 'S61', value: 'j***@example.net' },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithEmailOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code S62 when connected with username)', async function () {
          // given
          const userWithUsernameOnly = databaseBuilder.factory.buildUser({
            username: 'john.harry0702',
            email: null,
          });
          databaseBuilder.factory.buildSchoolingRegistration({
            nationalStudentId: schoolingRegistration.nationalStudentId,
            birthdate: schoolingRegistration.birthdate,
            firstName: schoolingRegistration.firstName,
            lastName: schoolingRegistration.lastName,
            userId: userWithUsernameOnly.id,
          });
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_USERNAME_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans un autre établissement.',
            meta: { shortCode: 'S62', value: 'j***.h***2' },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithUsernameOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });

        it('should return a schooling registration already linked error (short code S63 when account with samlId)', async function () {
          // given
          const userWithSamlIdOnly = databaseBuilder.factory.buildUser({
            email: null,
            username: null,
          });
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: '12345678',
            userId: userWithSamlIdOnly.id,
          });

          databaseBuilder.factory.buildSchoolingRegistration({
            nationalStudentId: schoolingRegistration.nationalStudentId,
            birthdate: schoolingRegistration.birthdate,
            firstName: schoolingRegistration.firstName,
            lastName: schoolingRegistration.lastName,
            userId: userWithSamlIdOnly.id,
          });
          await databaseBuilder.commit();

          const expectedResponse = {
            status: '409',
            code: 'ACCOUNT_WITH_GAR_ALREADY_EXIST_FOR_ANOTHER_ORGANIZATION',
            title: 'Conflict',
            detail: 'Un compte existe déjà pour l‘élève dans un autre établissement.',
            meta: { shortCode: 'S63', value: null },
          };

          options.headers.authorization = generateValidRequestAuthorizationHeader(userWithSamlIdOnly.id);
          options.payload.data = {
            attributes: {
              'campaign-code': campaignCode,
              'first-name': schoolingRegistration.firstName,
              'last-name': schoolingRegistration.lastName,
              birthdate: schoolingRegistration.birthdate,
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(409);
          expect(response.result.errors[0]).to.deep.equal(expectedResponse);
        });
      });

      context('when a field is not valid', function () {
        it('should respond with a 422 - Unprocessable Entity', async function () {
          // given
          options.payload.data.attributes['last-name'] = ' ';

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(422);
        });
      });
    });
  });

  describe('DELETE /api/schooling-registration-user-associations', function () {
    context('When user has the role pixMaster and schooling registration can be dissociated', function () {
      it('should return an 204 status after having successfully dissociated user from schoolingRegistration', async function () {
        const organizationId = databaseBuilder.factory.buildOrganization({ isManagingStudents: true }).id;
        const pixMaster = await insertUserWithRolePixMaster();
        const userId = databaseBuilder.factory.buildUser().id;
        const schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({ organizationId, userId });

        await databaseBuilder.commit();

        const options = {
          method: 'DELETE',
          url: `/api/schooling-registration-user-associations/${schoolingRegistration.id}`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(pixMaster.id),
          },
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(204);
      });
    });
  });

  describe('PATCH /api/organizations/organizationId/schooling-registration-user-associations/schoolingRegistrationId', function () {
    let organizationId;
    const studentNumber = '54321';
    let schoolingRegistrationId;
    let authorizationToken;

    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization({ isManagingStudents: true, type: 'SUP' }).id;

      const user = databaseBuilder.factory.buildUser();
      authorizationToken = generateValidRequestAuthorizationHeader(user.id);
      schoolingRegistrationId = databaseBuilder.factory.buildSchoolingRegistration({ organizationId }).id;
      databaseBuilder.factory.buildMembership({
        organizationId,
        userId: user.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();
    });

    context('Success cases', function () {
      it('should return an HTTP response with status code 204', async function () {
        const options = {
          method: 'PATCH',
          url: `/api/organizations/${organizationId}/schooling-registration-user-associations/${schoolingRegistrationId}`,
          headers: {
            authorization: authorizationToken,
          },
          payload: {
            data: {
              attributes: {
                'student-number': studentNumber,
              },
            },
          },
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });
});
