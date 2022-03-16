// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingQue... Remove this comment to see the full error message
const { MissingQueryParamError } = require('../http-errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/organization-invitation-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const scoOrganizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/sco-organization-invitation-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(7010) FIXME: 'acceptOrganizationInvitation', which lacks return... Remove this comment to see the full error message
  async acceptOrganizationInvitation(request: any) {
    const organizationInvitationId = request.params.id;
    const { code, email } = request.payload.data.attributes;

    const membership = await usecases.acceptOrganizationInvitation({ organizationInvitationId, code, email });
    await usecases.createCertificationCenterMembershipForScoOrganizationMember({ membership });
    return null;
  },

  async sendScoInvitation(request: any, h: any) {
    const { uai: uai, 'first-name': firstName, 'last-name': lastName } = request.payload.data.attributes;

    const locale = extractLocaleFromRequest(request);

    const organizationSCOInvitation = await usecases.sendScoInvitation({ uai, firstName, lastName, locale });

    return h.response(scoOrganizationInvitationSerializer.serialize(organizationSCOInvitation)).created();
  },

  async getOrganizationInvitation(request: any) {
    const organizationInvitationId = request.params.id;
    const organizationInvitationCode = request.query.code;

    if (_.isEmpty(organizationInvitationCode)) {
      throw new MissingQueryParamError('code');
    }

    const organizationInvitation = await usecases.getOrganizationInvitation({
      organizationInvitationId,
      organizationInvitationCode,
    });
    return organizationInvitationSerializer.serialize(organizationInvitation);
  },
};
