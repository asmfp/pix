// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionForSupervisingSerializer = require('../../infrastructure/serializers/jsonapi/session-for-supervising-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(request: any) {
    const sessionId = request.params.id;
    const session = await usecases.getSessionForSupervising({ sessionId });
    return sessionForSupervisingSerializer.serialize(session);
  },

  async supervise(request: any, h: any) {
    const { 'supervisor-password': supervisorPassword, 'session-id': sessionId } = request.payload.data.attributes;
    const { userId } = request.auth.credentials;
    await usecases.superviseSession({ sessionId, userId, supervisorPassword });
    return h.response().code(204);
  },
};
