// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(finalizedSessions: any) {
    return new Serializer('to-be-published-session', {
      transform(finalizedSession: any) {
        return { ...finalizedSession, id: finalizedSession.sessionId };
      },
      attributes: ['sessionId', 'sessionDate', 'sessionTime', 'finalizedAt', 'certificationCenterName'],
    }).serialize(finalizedSessions);
  },
};
