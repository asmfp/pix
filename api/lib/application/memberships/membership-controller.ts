// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipSerializer = require('../../infrastructure/serializers/jsonapi/membership-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
const { BadRequestError } = require('../http-errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(request: any, h: any) {
    const userId = request.payload.data.relationships.user.data.id;
    const organizationId = request.payload.data.relationships.organization.data.id;

    const membership = await usecases.createMembership({ userId, organizationId });
    await usecases.createCertificationCenterMembershipForScoOrganizationMember({ membership });

    return h.response(membershipSerializer.serialize(membership)).created();
  },

  async update(request: any, h: any) {
    const membershipId = request.params.id;
    const userId = requestResponseUtils.extractUserIdFromRequest(request);
    const membership = membershipSerializer.deserialize(request.payload);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    // eslint-disable-next-line no-restricted-syntax
    const membershipIdFromPayload = parseInt(membership.id);
    if (membershipId !== membershipIdFromPayload) {
      throw new BadRequestError();
    }
    membership.updatedByUserId = userId;

    const updatedMembership = await usecases.updateMembership({ membership });
    await usecases.createCertificationCenterMembershipForScoOrganizationMember({ membership });

    return h.response(membershipSerializer.serialize(updatedMembership));
  },

  async disable(request: any, h: any) {
    const membershipId = request.params.id;
    const userId = requestResponseUtils.extractUserIdFromRequest(request);

    await usecases.disableMembership({ membershipId, userId });
    return h.response().code(204);
  },
};
