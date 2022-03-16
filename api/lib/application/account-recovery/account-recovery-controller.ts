// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'studentInf... Remove this comment to see the full error message
const studentInformationForAccountRecoverySerializer = require('../../infrastructure/serializers/jsonapi/student-information-for-account-recovery-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async sendEmailForAccountRecovery(request: any, h: any) {
    const studentInformation = await studentInformationForAccountRecoverySerializer.deserialize(request.payload);

    await usecases.sendEmailForAccountRecovery({ studentInformation });

    return h.response().code(204);
  },

  async checkAccountRecoveryDemand(request: any) {
    const temporaryKey = request.params.temporaryKey;
    const studentInformation = await usecases.getAccountRecoveryDetails({ temporaryKey });
    return studentInformationForAccountRecoverySerializer.serializeAccountRecovery(studentInformation);
  },

  async updateUserAccountFromRecoveryDemand(request: any, h: any) {
    const temporaryKey = request.payload.data.attributes['temporary-key'];
    const password = request.payload.data.attributes.password;

    // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
    await DomainTransaction.execute(async (domainTransaction: any) => {
      await usecases.updateUserForAccountRecovery({
        password,
        temporaryKey,
        domainTransaction,
      });
    });

    return h.response().code(204);
  },
};
