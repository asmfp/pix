// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const schoolingRegistrationSerializer = require('../../infrastructure/serializers/jsonapi/schooling-registration-user-association-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async reconcileSchoolingRegistrationAutomatically(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;
    const campaignCode = payload['campaign-code'];
    const schoolingRegistration = await usecases.reconcileUserToOrganization({
      userId: authenticatedUserId,
      campaignCode,
    });
    return schoolingRegistrationSerializer.serialize(schoolingRegistration);
  },

  async reconcileSchoolingRegistrationManually(request: any, h: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;
    const campaignCode = payload['campaign-code'];
    const withReconciliation = request.query.withReconciliation === 'true';

    const reconciliationInfo = {
      id: authenticatedUserId,
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    const schoolingRegistration = await usecases.reconcileSchoolingRegistration({
      campaignCode,
      reconciliationInfo,
      withReconciliation,
    });

    if (withReconciliation) {
      return schoolingRegistrationSerializer.serialize(schoolingRegistration);
    }

    return h.response().code(204);
  },

  async reconcileHigherSchoolingRegistration(request: any, h: any) {
    const userId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;

    const campaignCode = payload['campaign-code'];

    const reconciliationInfo = {
      userId,
      studentNumber: payload['student-number'],
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    await usecases.reconcileHigherSchoolingRegistration({ campaignCode, reconciliationInfo });

    return h.response(null).code(204);
  },

  async findAssociation(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    // eslint-disable-next-line no-restricted-syntax
    const requestedUserId = parseInt(request.query.userId);
    const campaignCode = request.query.campaignCode;

    const schoolingRegistration = await usecases.findAssociationBetweenUserAndSchoolingRegistration({
      authenticatedUserId,
      requestedUserId,
      campaignCode,
    });

    return schoolingRegistrationSerializer.serialize(schoolingRegistration);
  },

  async generateUsername(request: any, h: any) {
    const payload = request.payload.data.attributes;
    const { 'campaign-code': campaignCode } = payload;

    const studentInformation = {
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    const username = await usecases.generateUsername({ campaignCode, studentInformation });

    // we don't persist this ressource, we simulate response by adding the generated username
    const schoolingRegistrationWithUsernameResponse = {
      data: {
        attributes: {
          'last-name': payload['last-name'],
          'first-name': payload['first-name'],
          birthdate: payload['birthdate'],
          'campaign-code': campaignCode,
          username,
        },
        type: 'schooling-registration-user-associations',
      },
    };
    return h.response(schoolingRegistrationWithUsernameResponse).code(200);
  },

  async dissociate(request: any, h: any) {
    const schoolingRegistrationId = request.params.id;
    await usecases.dissociateUserFromSchoolingRegistration({ schoolingRegistrationId });
    return h.response().code(204);
  },

  async updateStudentNumber(request: any, h: any) {
    const payload = request.payload.data.attributes;
    const organizationId = request.params.id;
    const studentNumber = payload['student-number'];
    const schoolingRegistrationId = request.params.schoolingRegistrationId;

    await usecases.updateStudentNumber({ schoolingRegistrationId, studentNumber, organizationId });
    return h.response().code(204);
  },
};
