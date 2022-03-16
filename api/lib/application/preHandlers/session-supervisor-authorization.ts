// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const supervisorAccessRepository = require('../../infrastructure/repositories/supervisor-access-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async verifyByCertificationCandidateId(request: any, h: any) {
    const supervisorUserId = requestResponseUtils.extractUserIdFromRequest(request);
    const candidateId = request.params.id;
    const isSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSessionCandidate({
      supervisorId: supervisorUserId,
      certificationCandidateId: candidateId,
    });

    if (!isSupervisorForSession) {
      return h.response().code(401).takeover();
    }

    return true;
  },

  async verifyBySessionId(request: any, h: any) {
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const sessionId = request.params.id;

    const isSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSession({
      sessionId,
      userId,
    });

    if (!isSupervisorForSession) {
      return h.response().code(401).takeover();
    }
    return true;
  },
};
