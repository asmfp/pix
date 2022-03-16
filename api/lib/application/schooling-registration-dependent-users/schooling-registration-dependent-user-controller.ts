// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const schoolingRegistrationDependentUser = require('../../infrastructure/serializers/jsonapi/schooling-registration-dependent-user-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'studentInf... Remove this comment to see the full error message
const studentInformationForAccountRecoverySerializer = require('../../infrastructure/serializers/jsonapi/student-information-for-account-recovery-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createAndReconcileUserToSchoolingRegistration(request: any, h: any) {
    const payload = request.payload.data.attributes;
    const userAttributes = {
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
      email: payload.email,
      username: payload.username,
      withUsername: payload['with-username'],
    };
    const locale = extractLocaleFromRequest(request);

    await usecases.createAndReconcileUserToSchoolingRegistration({
      userAttributes,
      password: payload.password,
      campaignCode: payload['campaign-code'],
      locale,
    });

    return h.response().code(204);
  },

  async createUserAndReconcileToSchoolingRegistrationFromExternalUser(request: any, h: any) {
    const { birthdate, 'campaign-code': campaignCode, 'external-user-token': token } = request.payload.data.attributes;

    const accessToken = await usecases.createUserAndReconcileToSchoolingRegistrationFromExternalUser({
      birthdate,
      campaignCode,
      token,
    });

    const response = {
      data: {
        attributes: {
          'access-token': accessToken,
        },
        type: 'external-users',
      },
    };

    return h.response(response).code(200);
  },

  async updatePassword(request: any, h: any) {
    const payload = request.payload.data.attributes;
    const userId = request.auth.credentials.userId;
    const organizationId = payload['organization-id'];
    const schoolingRegistrationId = payload['schooling-registration-id'];

    const generatedPassword = await usecases.updateSchoolingRegistrationDependentUserPassword({
      userId,
      organizationId,
      schoolingRegistrationId,
    });

    const schoolingRegistrationWithGeneratedPasswordResponse = {
      data: {
        attributes: {
          'generated-password': generatedPassword,
        },
        type: 'schooling-registration-dependent-user',
      },
    };

    return h.response(schoolingRegistrationWithGeneratedPasswordResponse).code(200);
  },

  async generateUsernameWithTemporaryPassword(request: any, h: any) {
    const payload = request.payload.data.attributes;
    const organizationId = payload['organization-id'];
    const schoolingRegistrationId = payload['schooling-registration-id'];

    const result = await usecases.generateUsernameWithTemporaryPassword({
      schoolingRegistrationId,
      organizationId,
    });

    const schoolingRegistrationWithGeneratedUsernamePasswordResponse =
      schoolingRegistrationDependentUser.serialize(result);

    return h.response(schoolingRegistrationWithGeneratedUsernamePasswordResponse).code(200);
  },

  async checkScoAccountRecovery(request: any) {
    const studentInformation = await studentInformationForAccountRecoverySerializer.deserialize(request.payload);

    const studentInformationForAccountRecovery = await usecases.checkScoAccountRecovery({
      studentInformation,
    });

    return studentInformationForAccountRecoverySerializer.serialize(studentInformationForAccountRecovery);
  },
};
