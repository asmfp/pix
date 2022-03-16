// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationSerializer = require('../../infrastructure/serializers/jsonapi/campaign-participation-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignParticipationOverviewSerializer = require('../../infrastructure/serializers/jsonapi/campaign-participation-overview-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationEligibilitySerializer = require('../../infrastructure/serializers/jsonapi/certification-eligibility-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipSerializer = require('../../infrastructure/serializers/jsonapi/membership-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'scorecardS... Remove this comment to see the full error message
const scorecardSerializer = require('../../infrastructure/serializers/jsonapi/scorecard-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const profileSerializer = require('../../infrastructure/serializers/jsonapi/profile-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participantResultSerializer = require('../../infrastructure/serializers/jsonapi/participant-result-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sharedProfileForCampaignSerializer = require('../../infrastructure/serializers/jsonapi/shared-profile-for-campaign-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userSerial... Remove this comment to see the full error message
const userSerializer = require('../../infrastructure/serializers/jsonapi/user-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userWithActivitySerializer = require('../../infrastructure/serializers/jsonapi/user-with-activity-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const emailVerificationSerializer = require('../../infrastructure/serializers/jsonapi/email-verification-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userDetailsForAdminSerializer = require('../../infrastructure/serializers/jsonapi/user-details-for-admin-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userAnonymizedDetailsForAdminSerializer = require('../../infrastructure/serializers/jsonapi/user-anonymized-details-for-admin-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateEmailSerializer = require('../../infrastructure/serializers/jsonapi/update-email-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authenticationMethodsSerializer = require('../../infrastructure/serializers/jsonapi/authentication-methods-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  save(request: any, h: any) {
    const campaignCode = request.payload.meta ? request.payload.meta['campaign-code'] : null;
    const user = userSerializer.deserialize(request.payload);
    const locale = extractLocaleFromRequest(request);

    const password = request.payload.data.attributes.password;

    return usecases
      .createUser({
        user,
        password,
        campaignCode,
        locale,
      })
      .then((savedUser: any) => {
        return h.response(userSerializer.serialize(savedUser)).created();
      });
  },

  getCurrentUser(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases.getCurrentUser({ authenticatedUserId }).then(userWithActivitySerializer.serialize);
  },

  async getUserDetailsForAdmin(request: any) {
    const userId = request.params.id;
    const userDetailsForAdmin = await usecases.getUserDetailsForAdmin({ userId });
    return userDetailsForAdminSerializer.serialize(userDetailsForAdmin);
  },

  async updateEmail(request: any, h: any) {
    const userId = request.params.id;
    const authenticatedUserId = request.auth.credentials.userId;
    const { email, password } = request.payload.data.attributes;
    const locale = extractLocaleFromRequest(request);

    await usecases.updateUserEmail({
      email,
      userId,
      authenticatedUserId,
      password,
      locale,
    });

    return h.response({}).code(204);
  },

  async updatePassword(request: any) {
    const userId = request.params.id;
    const password = request.payload.data.attributes.password;

    const updatedUser = await usecases.updateUserPassword({
      userId,
      password,
      temporaryKey: request.query['temporary-key'] || '',
    });

    return userSerializer.serialize(updatedUser);
  },

  async updateUserDetailsForAdministration(request: any) {
    const userId = request.params.id;
    const userDetailsForAdministration = userDetailsForAdminSerializer.deserialize(request.payload);

    const updatedUser = await usecases.updateUserDetailsForAdministration({
      userId,
      userDetailsForAdministration,
    });

    return userDetailsForAdminSerializer.serialize(updatedUser);
  },

  async acceptPixLastTermsOfService(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.acceptPixLastTermsOfService({
      userId: authenticatedUserId,
    });

    return userSerializer.serialize(updatedUser);
  },

  async changeLang(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const lang = request.params.lang;
    const updatedUser = await usecases.changeUserLang({
      userId: authenticatedUserId,
      lang,
    });

    return userSerializer.serialize(updatedUser);
  },

  async acceptPixOrgaTermsOfService(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.acceptPixOrgaTermsOfService({
      userId: authenticatedUserId,
    });

    return userSerializer.serialize(updatedUser);
  },

  async acceptPixCertifTermsOfService(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.acceptPixCertifTermsOfService({
      userId: authenticatedUserId,
    });

    return userSerializer.serialize(updatedUser);
  },

  async rememberUserHasSeenAssessmentInstructions(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.rememberUserHasSeenAssessmentInstructions({ userId: authenticatedUserId });
    return userSerializer.serialize(updatedUser);
  },

  async rememberUserHasSeenNewDashboardInfo(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    const updatedUser = await usecases.rememberUserHasSeenNewDashboardInfo({ userId: authenticatedUserId });
    return userSerializer.serialize(updatedUser);
  },

  async rememberUserHasSeenChallengeTooltip(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const challengeType = request.params.challengeType;

    const updatedUser = await usecases.rememberUserHasSeenChallengeTooltip({
      userId: authenticatedUserId,
      challengeType,
    });
    return userSerializer.serialize(updatedUser);
  },

  getMemberships(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases
      .getUserWithMemberships({ userId: authenticatedUserId })
      .then((user: any) => membershipSerializer.serialize(user.memberships));
  },

  async findPaginatedFilteredUsers(request: any) {
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: users, pagination } = await usecases.findPaginatedFilteredUsers({
      filter: options.filter,
      page: options.page,
    });
    return userSerializer.serialize(users, pagination);
  },

  getCampaignParticipations(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    return usecases
      .findLatestOngoingUserCampaignParticipations({ userId: authenticatedUserId })
      .then(campaignParticipationSerializer.serialize);
  },

  async getCampaignParticipationOverviews(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const query = queryParamsUtils.extractParameters(request.query);

    const userCampaignParticipationOverviews = await usecases.findUserCampaignParticipationOverviews({
      userId: authenticatedUserId,
      states: query.filter.states,
      page: query.page,
    });

    return campaignParticipationOverviewSerializer.serializeForPaginatedList(userCampaignParticipationOverviews);
  },

  async isCertifiable(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;

    const certificationEligibility = await usecases.getUserCertificationEligibility({ userId: authenticatedUserId });
    return certificationEligibilitySerializer.serialize(certificationEligibility);
  },

  getProfile(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const locale = extractLocaleFromRequest(request);

    return usecases.getUserProfile({ userId: authenticatedUserId, locale }).then(profileSerializer.serialize);
  },

  resetScorecard(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const competenceId = request.params.competenceId;
    const locale = extractLocaleFromRequest(request);

    return usecases
      .resetScorecard({ userId: authenticatedUserId, competenceId, locale })
      .then(scorecardSerializer.serialize);
  },

  getUserCampaignParticipationToCampaign(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const campaignId = request.params.campaignId;

    return usecases
      .getUserCampaignParticipationToCampaign({ userId: authenticatedUserId, campaignId })
      .then((campaignParticipation: any) => campaignParticipationSerializer.serialize(campaignParticipation));
  },

  async getUserProfileSharedForCampaign(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const campaignId = request.params.campaignId;
    const locale = extractLocaleFromRequest(request);

    const sharedProfileForCampaign = await usecases.getUserProfileSharedForCampaign({
      userId: authenticatedUserId,
      campaignId,
      locale,
    });

    return sharedProfileForCampaignSerializer.serialize(sharedProfileForCampaign);
  },

  async getUserCampaignAssessmentResult(request: any) {
    const authenticatedUserId = request.auth.credentials.userId;
    const campaignId = request.params.campaignId;
    const locale = extractLocaleFromRequest(request);

    const campaignAssessmentResult = await usecases.getUserCampaignAssessmentResult({
      userId: authenticatedUserId,
      campaignId,
      locale,
    });

    return participantResultSerializer.serialize(campaignAssessmentResult);
  },

  async anonymizeUser(request: any, h: any) {
    const userId = request.params.id;
    const user = await usecases.anonymizeUser({ userId });
    return h.response(userAnonymizedDetailsForAdminSerializer.serialize(user)).code(200);
  },

  async removeAuthenticationMethod(request: any, h: any) {
    const userId = request.params.id;
    const type = request.payload.data.attributes.type;
    await usecases.removeAuthenticationMethod({ userId, type });
    return h.response().code(204);
  },

  async sendVerificationCode(request: any, h: any) {
    const locale = extractLocaleFromRequest(request);
    const i18n = request.i18n;
    const userId = request.params.id;
    const { newEmail, password } = await emailVerificationSerializer.deserialize(request.payload);

    await usecases.sendVerificationCode({ i18n, locale, newEmail, password, userId });
    return h.response().code(204);
  },

  async updateUserEmailWithValidation(request: any) {
    const userId = request.params.id;
    const code = request.payload.data.attributes.code;

    const updatedUserAttributes = await usecases.updateUserEmailWithValidation({
      userId,
      code,
    });

    return updateEmailSerializer.serialize(updatedUserAttributes);
  },

  async getUserAuthenticationMethods(request: any) {
    const userId = request.params.id;

    const authenticationMethods = await usecases.findUserAuthenticationMethods({ userId });

    return authenticationMethodsSerializer.serialize(authenticationMethods);
  },

  async addPixAuthenticationMethodByEmail(request: any, h: any) {
    const userId = request.params.id;
    const email = request.payload.data.attributes.email.trim().toLowerCase();

    const userUpdated = await usecases.addPixAuthenticationMethodByEmail({
      userId,
      email,
    });
    return h.response(userDetailsForAdminSerializer.serialize(userUpdated)).created();
  },

  async reassignAuthenticationMethods(request: any, h: any) {
    const authenticationMethodId = request.params.authenticationMethodId;
    const originUserId = request.params.userId;
    const targetUserId = request.payload.data.attributes['user-id'];

    await usecases.reassignAuthenticationMethodToAnotherUser({
      originUserId,
      targetUserId,
      authenticationMethodId,
    });
    return h.response().code(204);
  },
};
