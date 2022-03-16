// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../infrastructure/repositories/sessions/session-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../infrastructure/repositories/user-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async isAuthorizedToAccessSession({
    userId,
    sessionId
  }: any) {
    const hasMembershipAccess = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
      userId,
      sessionId
    );
    if (!hasMembershipAccess) {
      const isPixMaster = await userRepository.isPixMaster(userId);
      if (!isPixMaster) {
        return false;
      }
    }

    return true;
  },
};
