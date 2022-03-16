// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const endTestScreenRemovalRepository = require('../../infrastructure/repositories/end-test-screen-removal-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isEndTestScreenRemovalEnabledBySessionId: async function (sessionId: any) {
    const isEndTestScreenRemovalEnabled = await endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledBySessionId(
      sessionId
    );
    return isEndTestScreenRemovalEnabled;
  },
  isEndTestScreenRemovalEnabledByCandidateId: async function (candidateId: any) {
    const isEndTestScreenRemovalEnabled =
      await endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledByCandidateId(candidateId);
    return isEndTestScreenRemovalEnabled;
  },

  isEndTestScreenRemovalEnabledByCertificationCenterId: function (certificationCenterId: any) {
    return endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledByCertificationCenterId(certificationCenterId);
  },

  isEndTestScreenRemovalEnabledForSomeCertificationCenter: function () {
    return endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledForSomeCertificationCenter();
  },
};
