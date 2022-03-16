const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Supervisor... Remove this comment to see the full error message
  SupervisorAccessNotAuthorizedError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
  InvalidSessionSupervisingLoginError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../domain/services/end-test-screen-removal-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../infrastructure/repositories/sessions/session-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async verifyBySessionId(request: any) {
    let sessionId = request.params?.id;
    if (!sessionId) {
      sessionId = request.payload.data.attributes['session-id'];
    }

    try {
      await sessionRepository.get(sessionId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new InvalidSessionSupervisingLoginError();
      }
      throw error;
    }

    const isEndTestScreenRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId(
      sessionId
    );
    if (!isEndTestScreenRemovalEnabled) {
      throw new SupervisorAccessNotAuthorizedError();
    }

    return true;
  },

  async verifyByCertificationCandidateId(request: any, h: any) {
    const candidateId = request.params.id;

    const isEndTestScreenRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCandidateId(
      candidateId
    );
    if (!isEndTestScreenRemovalEnabled) {
      return h.response().code(404).takeover();
    }

    return true;
  },
};
