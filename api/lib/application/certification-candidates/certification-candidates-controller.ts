// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCandidateSubscriptionSerializer = require('../../infrastructure/serializers/jsonapi/certification-candidate-subscription-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async authorizeToStart(request: any, h: any) {
    const certificationCandidateForSupervisingId = request.params.id;

    const authorizedToStart = request.payload['authorized-to-start'];
    await usecases.authorizeCertificationCandidateToStart({
      certificationCandidateForSupervisingId,
      authorizedToStart,
    });

    return h.response().code(204);
  },

  async authorizeToResume(request: any, h: any) {
    const certificationCandidateId = request.params.id;

    await usecases.authorizeCertificationCandidateToResume({
      certificationCandidateId,
    });

    return h.response().code(204);
  },

  async getSubscriptions(request: any) {
    const certificationCandidateId = request.params.id;
    const certificationCandidateSubscription = await usecases.getCertificationCandidateSubscription({
      certificationCandidateId,
    });
    return certificationCandidateSubscriptionSerializer.serialize(certificationCandidateSubscription);
  },

  // @ts-expect-error ts-migrate(7010) FIXME: 'endAssessmentBySupervisor', which lacks return-ty... Remove this comment to see the full error message
  async endAssessmentBySupervisor(request: any) {
    const certificationCandidateId = request.params.id;

    await usecases.endAssessmentBySupervisor({ certificationCandidateId });

    return null;
  },
};
