// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../domain/services/token-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignManagementSerializer = require('../../infrastructure/serializers/jsonapi/campaign-management-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'campaignRe... Remove this comment to see the full error message
const campaignReportSerializer = require('../../infrastructure/serializers/jsonapi/campaign-report-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'divisionSe... Remove this comment to see the full error message
const divisionSerializer = require('../../infrastructure/serializers/jsonapi/division-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'groupSeria... Remove this comment to see the full error message
const groupSerializer = require('../../infrastructure/serializers/jsonapi/group-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipSerializer = require('../../infrastructure/serializers/jsonapi/membership-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationSerializer = require('../../infrastructure/serializers/jsonapi/organization-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/organization-invitation-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userWithSchoolingRegistrationSerializer = require('../../infrastructure/serializers/jsonapi/user-with-schooling-registration-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const higherSchoolingRegistrationWarningSerializer = require('../../infrastructure/serializers/jsonapi/higher-schooling-registration-warnings-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationAttachTargetProfilesSerializer = require('../../infrastructure/serializers/jsonapi/organization-attach-target-profiles-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const TargetProfileForSpecifierSerializer = require('../../infrastructure/serializers/jsonapi/campaign/target-profile-for-specifier-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationMemberIdentitySerializer = require('../../infrastructure/serializers/jsonapi/organization-member-identity-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HigherScho... Remove this comment to see the full error message
const HigherSchoolingRegistrationParser = require('../../infrastructure/serializers/csv/higher-schooling-registration-parser');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
  extractLocaleFromRequest,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
  extractUserIdFromRequest,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationResultUtils = require('../../infrastructure/utils/csv/certification-results');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAttestationPdf = require('../../infrastructure/utils/pdf/certification-attestation-pdf');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationForAdminSerializer = require('../../infrastructure/serializers/jsonapi/organization-for-admin-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getOrganizationDetails(request: any) {
    const organizationId = request.params.id;

    const organizationDetails = await usecases.getOrganizationDetails({ organizationId });
    return organizationForAdminSerializer.serialize(organizationDetails);
  },

  create: (request: any) => {
    const {
      name,
      type,
      email,
      'external-id': externalId,
      'province-code': provinceCode,
      'logo-url': logoUrl,
      'documentation-url': documentationUrl,
    } = request.payload.data.attributes;

    const pixMasterUserId = extractUserIdFromRequest(request);
    return usecases
      .createOrganization({
        createdBy: pixMasterUserId,
        name,
        type,
        externalId,
        provinceCode,
        logoUrl,
        email,
        documentationUrl,
      })
      .then(organizationSerializer.serialize);
  },

  async updateOrganizationInformation(request: any) {
    const organizationDeserialized = organizationSerializer.deserialize(request.payload);

    const organizationUpdated = await usecases.updateOrganizationInformation({
      organization: organizationDeserialized,
    });
    return organizationSerializer.serialize(organizationUpdated);
  },

  async findPaginatedFilteredOrganizations(request: any) {
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: organizations, pagination } = await usecases.findPaginatedFilteredOrganizations({
      filter: options.filter,
      page: options.page,
    });
    return organizationSerializer.serialize(organizations, pagination);
  },

  async findPaginatedFilteredCampaigns(request: any) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);
    const userId = request.auth.credentials.userId;

    if (options.filter.status === 'archived') {
      options.filter.ongoing = false;
      delete options.filter.status;
    }
    const { models: campaigns, meta } = await usecases.findPaginatedFilteredOrganizationCampaigns({
      organizationId,
      filter: options.filter,
      page: options.page,
      userId,
    });
    return campaignReportSerializer.serialize(campaigns, meta);
  },

  async findPaginatedCampaignManagements(request: any) {
    const organizationId = request.params.id;
    const { filter, page } = queryParamsUtils.extractParameters(request.query);

    const { models: campaigns, meta } = await usecases.findPaginatedCampaignManagements({
      organizationId,
      filter,
      page,
    });
    return campaignManagementSerializer.serialize(campaigns, meta);
  },

  async findPaginatedFilteredMemberships(request: any) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: memberships, pagination } = await usecases.findPaginatedFilteredOrganizationMemberships({
      organizationId,
      filter: options.filter,
      page: options.page,
    });
    return membershipSerializer.serialize(memberships, pagination);
  },

  async getOrganizationMemberIdentities(request: any) {
    const organizationId = request.params.id;
    const members = await usecases.getOrganizationMemberIdentities({ organizationId });
    return organizationMemberIdentitySerializer.serialize(members);
  },

  async downloadCertificationAttestationsForDivision(request: any, h: any) {
    const organizationId = request.params.id;
    const { division } = request.query;

    const attestations = await usecases.findCertificationAttestationsForDivision({
      organizationId,
      division,
    });

    const { buffer } = await certificationAttestationPdf.getCertificationAttestationsPdfBuffer({
      certificates: attestations,
    });

    const now = moment();
    const fileName = `${now.format('YYYYMMDD')}_attestations_${division}.pdf`;

    return h
      .response(buffer)
      .header('Content-Disposition', `attachment; filename=${fileName}`)
      .header('Content-Type', 'application/pdf');
  },

  async downloadCertificationResults(request: any, h: any) {
    const organizationId = request.params.id;
    const { division } = request.query;

    const certificationResults = await usecases.getScoCertificationResultsByDivision({ organizationId, division });

    const csvResult = await certificationResultUtils.getDivisionCertificationResultsCsv({ certificationResults });

    const now = moment();
    const fileName = `${now.format('YYYYMMDD')}_resultats_${division}.csv`;

    return h
      .response(csvResult)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${fileName}`);
  },

  async findTargetProfiles(request: any) {
    const organizationId = request.params.id;
    const targetProfiles = await usecases.getAvailableTargetProfilesForOrganization({ organizationId });
    return TargetProfileForSpecifierSerializer.serialize(targetProfiles);
  },

  async attachTargetProfiles(request: any, h: any) {
    const organizationId = request.params.id;
    const targetProfileIdsToAttach = request.payload.data.attributes['target-profiles-to-attach']
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
      // eslint-disable-next-line no-restricted-syntax
      .map((targetProfileToAttach: any) => parseInt(targetProfileToAttach));
    const results = await usecases.attachTargetProfilesToOrganization({
      organizationId,
      targetProfileIdsToAttach,
    });
    return h
      .response(organizationAttachTargetProfilesSerializer.serialize({ ...results, organizationId }))
      .code(results.attachedIds.length > 0 ? 201 : 200);
  },

  async getDivisions(request: any) {
    const organizationId = request.params.id;
    const divisions = await usecases.findDivisionsByOrganization({ organizationId });
    return divisionSerializer.serialize(divisions);
  },

  async getGroups(request: any) {
    const organizationId = request.params.id;
    const groups = await usecases.findGroupsByOrganization({ organizationId });
    return groupSerializer.serialize(groups);
  },

  async findPaginatedFilteredSchoolingRegistrations(request: any) {
    const organizationId = request.params.id;
    const { filter, page } = queryParamsUtils.extractParameters(request.query);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    if (filter.divisions && !Array.isArray(filter.divisions)) {
      filter.divisions = [filter.divisions];
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    if (filter.groups && !Array.isArray(filter.groups)) {
      filter.groups = [filter.groups];
    }
    const { data, pagination } = await usecases.findPaginatedFilteredSchoolingRegistrations({
      organizationId,
      filter,
      page,
    });
    return userWithSchoolingRegistrationSerializer.serialize(data, pagination);
  },

  async importSchoolingRegistrationsFromSIECLE(request: any, h: any) {
    const organizationId = request.params.id;
    const { format } = request.query;

    await usecases.importSchoolingRegistrationsFromSIECLEFormat({
      organizationId,
      payload: request.payload,
      format,
      i18n: request.i18n,
    });
    return h.response(null).code(204);
  },

  async importHigherSchoolingRegistrations(request: any, h: any) {
    const organizationId = request.params.id;
    const buffer = request.payload;
    const higherSchoolingRegistrationParser = new HigherSchoolingRegistrationParser(
      buffer,
      organizationId,
      request.i18n
    );
    const warnings = await usecases.importHigherSchoolingRegistrations({ higherSchoolingRegistrationParser });
    const response = higherSchoolingRegistrationWarningSerializer.serialize({ id: organizationId, warnings });
    return h.response(response).code(200);
  },

  async replaceHigherSchoolingRegistrations(request: any, h: any) {
    const organizationId = request.params.id;
    const buffer = request.payload;
    const higherSchoolingRegistrationParser = new HigherSchoolingRegistrationParser(
      buffer,
      organizationId,
      request.i18n
    );
    const warnings = await usecases.replaceHigherSchoolingRegistrations({
      organizationId,
      higherSchoolingRegistrationParser,
    });
    const response = higherSchoolingRegistrationWarningSerializer.serialize({ id: organizationId, warnings });
    return h.response(response).code(200);
  },

  async sendInvitations(request: any, h: any) {
    const organizationId = request.params.id;
    const emails = request.payload.data.attributes.email.split(',');
    const locale = extractLocaleFromRequest(request);

    const organizationInvitations = await usecases.createOrganizationInvitations({ organizationId, emails, locale });
    return h.response(organizationInvitationSerializer.serialize(organizationInvitations)).created();
  },

  async cancelOrganizationInvitation(request: any, h: any) {
    const organizationInvitationId = request.params.organizationInvitationId;
    const cancelledOrganizationInvitation = await usecases.cancelOrganizationInvitation({ organizationInvitationId });
    return h.response(organizationInvitationSerializer.serialize(cancelledOrganizationInvitation));
  },

  async sendInvitationByLangAndRole(request: any, h: any) {
    const organizationId = request.params.id;
    const invitationInformation =
      await organizationInvitationSerializer.deserializeForCreateOrganizationInvitationAndSendEmail(request.payload);

    const organizationInvitation = await usecases.createOrganizationInvitationByAdmin({
      organizationId,
      email: invitationInformation.email,
      locale: invitationInformation.lang,
      role: invitationInformation.role,
    });
    return h.response(organizationInvitationSerializer.serialize(organizationInvitation)).created();
  },

  async findPendingInvitations(request: any) {
    const organizationId = request.params.id;

    return usecases
      .findPendingOrganizationInvitations({ organizationId })
      .then((invitations: any) => organizationInvitationSerializer.serialize(invitations));
  },

  async getSchoolingRegistrationsCsvTemplate(request: any, h: any) {
    const organizationId = request.params.id;
    const token = request.query.accessToken;
    const userId = tokenService.extractUserId(token);
    const template = await usecases.getSchoolingRegistrationsCsvTemplate({
      userId,
      organizationId,
      i18n: request.i18n,
    });

    return h
      .response(template)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${request.i18n.__('csv-template.template-name')}.csv`);
  },

  async archiveOrganization(request: any) {
    const organizationId = request.params.id;
    const userId = extractUserIdFromRequest(request);
    const archivedOrganization = await usecases.archiveOrganization({ organizationId, userId });
    return organizationForAdminSerializer.serialize(archivedOrganization);
  },
};
