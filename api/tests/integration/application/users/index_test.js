const { expect, sinon, HttpTestServer } = require('../../../test-helper');

const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
const userController = require('../../../../lib/application/users/user-controller');
const moduleUnderTest = require('../../../../lib/application/users');
const faker = require('faker');

describe('Integration | Application | Users | Routes', function() {

  const methodGET = 'GET';
  const methodPATCH = 'PATCH';

  let payload;

  let httpTestServer;

  beforeEach(function() {
    sinon.stub(securityPreHandlers, 'checkUserHasRolePixMaster');
    sinon.stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser').callsFake((request, h) => h.response(true));

    sinon.stub(userController, 'getUserDetailsForAdmin').returns('ok');
    sinon.stub(userController, 'updateUserDetailsForAdministration').returns('updated');
    sinon.stub(userController, 'dissociateSchoolingRegistrations').returns('ok');
    sinon.stub(userController, 'resetScorecard').returns('ok');

    httpTestServer = new HttpTestServer(moduleUnderTest);
  });

  describe('GET /api/admin/users/{id}', function() {

    it('should exist', async function() {
      // given
      securityPreHandlers.checkUserHasRolePixMaster.callsFake((request, h) => h.response(true));
      const url = '/api/admin/users/123';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return BAD_REQUEST (400) when id in param is not a number"', async function() {

      // given
      const url = '/api/admin/users/NOT_A_NUMBER';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(400);
    });

    it('should return BAD_REQUEST (400) when id in param is out of range"', async function() {

      // given
      const url = '/api/admin/users/0';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(400);
    });

  });

  describe('POST /api/users/{userId}/competences/{competenceId}/reset', function() {

    it('should return OK (200) when params are valid', async function() {
      // given
      securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request, h) => h.response(true));
      const url = '/api/users/123/competences/abcdefghijklmnop/reset';

      // when
      const response = await httpTestServer.request('POST', url);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return BAD_REQUEST (400) when competenceId parameter is invalid', async function() {

      // given
      const invalidCompetenceId = faker.random.alphaNumeric(256);
      securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request, h) => h.response(true));
      const url = `/api/users/123/competences/${invalidCompetenceId}/reset`;

      // when
      const response = await httpTestServer.request('POST', url);

      // then
      expect(response.statusCode).to.equal(400);
    });

  });

  describe('PATCH /api/admin/users/{id}', function() {

    it('should update user when payload is valid', async function() {
      // given
      securityPreHandlers.checkUserHasRolePixMaster.callsFake((request, h) => h.response(true));
      const url = '/api/admin/users/123';

      const payload = {
        data: {
          id: '123',
          attributes: {
            'first-name': 'firstNameUpdated',
            'last-name': 'lastNameUpdated',
            email: 'emailUpdated@example.net',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return bad request when firstName is missing', async function() {
      // given
      securityPreHandlers.checkUserHasRolePixMaster.callsFake((request, h) => h.response(true));
      const url = '/api/admin/users/123';

      const payload = {
        data: {
          id: '123',
          attributes: {
            'last-name': 'lastNameUpdated',
            email: 'emailUpdated@example.net',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
      const firstError = response.result.errors[0];
      expect(firstError.detail).to.equal('"data.attributes.first-name" is required');
    });

    it('should return bad request when lastName is missing', async function() {
      // given
      securityPreHandlers.checkUserHasRolePixMaster.callsFake((request, h) => h.response(true));
      const url = '/api/admin/users/123';
      const payload = {
        data: {
          id: '123',
          attributes: {
            'first-name': 'firstNameUpdated',
            email: 'emailUpdated',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(400);
      const firstError = response.result.errors[0];
      expect(firstError.detail).to.equal('"data.attributes.last-name" is required');
    });

    it('should return a 400 when id in param is not a number"', async function() {
      // given
      const url = '/api/admin/users/NOT_A_NUMBER';

      // when
      const response = await httpTestServer.request(methodGET, url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('PATCH /api/admin/users/{id}/dissociate', function() {

    const url = '/api/admin/users/1/dissociate';

    it('should dissociate user', async function() {
      // given
      securityPreHandlers.checkUserHasRolePixMaster.callsFake((request, h) => h.response(true));

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('PATCH /api/users/{id}/email', function() {

    const url = '/api/users/1/email';

    it('should return 422 if email is invalid', async function() {
      // given
      const payload = {
        data: {
          type: 'users',
          attributes: {
            email: 'not_an_email',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(422);
    });

    it('should return 422 if type attribute is missing', async function() {
      // given
      const payload = {
        data: {
          attributes: {
            email: 'user@example.net',
          },
        },
      };

      // when
      const response = await httpTestServer.request(methodPATCH, url, payload);

      // then
      expect(response.statusCode).to.equal(422);
    });

  });
});
