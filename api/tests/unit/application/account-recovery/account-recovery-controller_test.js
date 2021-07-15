const {
  expect,
  sinon,
  hFake,
  domainBuilder,
} = require('../../../test-helper');

const accountRecoveryController = require('../../../../lib/application/account-recovery/account-recovery-controller');
const usecases = require('../../../../lib/domain/usecases');

describe('Unit | Controller | account-recovery-controller', () => {

  describe('#sendEmailForAccountRecovery', () => {

    it('should call sendEmailForAccountRecovery usecase and return 204', async () => {
      // given
      const userId = domainBuilder.buildUser({ id: 1 }).id;
      const newEmail = 'new_email@example.net';

      const request = {
        payload: {
          data: {
            attributes: {
              'user-id': userId,
              email: newEmail,
            },
          },
        },
      };

      sinon.stub(usecases, 'sendEmailForAccountRecovery').resolves();

      // when
      const response = await accountRecoveryController.sendEmailForAccountRecovery(request, hFake);

      // then
      expect(usecases.sendEmailForAccountRecovery).calledWith({ userId, email: newEmail });
      expect(response.statusCode).to.equal(204);
    });

  });

});