// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(request: any, h: any) {
    const userId = request.payload.data.attributes['user-id'];
    const certificationCenterId = request.payload.data.attributes['certification-center-id'];
    return usecases
      .createCertificationCenterMembership({ userId, certificationCenterId })
      .then((membership: any) => h.response(membership).created());
  },

  async disable(request: any, h: any) {
    const certificationCenterMembershipId = request.params.id;
    await usecases.disableCertificationCenterMembership({
      certificationCenterMembershipId,
    });
    return h.response().code(204);
  },
};
