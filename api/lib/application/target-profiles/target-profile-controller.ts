// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfileSerializer = require('../../infrastructure/serializers/jsonapi/target-profile-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfileWithLearningContentSerializer = require('../../infrastructure/serializers/jsonapi/target-profile-with-learning-content-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationSerializer = require('../../infrastructure/serializers/jsonapi/organization-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'badgeSeria... Remove this comment to see the full error message
const badgeSerializer = require('../../infrastructure/serializers/jsonapi/badge-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgeCreationSerializer = require('../../infrastructure/serializers/jsonapi/badge-creation-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'stageSeria... Remove this comment to see the full error message
const stageSerializer = require('../../infrastructure/serializers/jsonapi/stage-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const targetProfileAttachOrganizationSerializer = require('../../infrastructure/serializers/jsonapi/target-profile-attach-organization-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findPaginatedFilteredTargetProfiles(request: any) {
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: targetProfiles, pagination } = await usecases.findPaginatedFilteredTargetProfiles({
      filter: options.filter,
      page: options.page,
    });
    return targetProfileSerializer.serialize(targetProfiles, pagination);
  },

  async getTargetProfileDetails(request: any) {
    const targetProfileId = request.params.id;
    const targetProfilesDetails = await usecases.getTargetProfileDetails({ targetProfileId });
    return targetProfileWithLearningContentSerializer.serialize(targetProfilesDetails);
  },

  async findPaginatedFilteredTargetProfileOrganizations(request: any) {
    const targetProfileId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: organizations, pagination } = await usecases.findPaginatedFilteredTargetProfileOrganizations({
      targetProfileId,
      filter: options.filter,
      page: options.page,
    });
    return organizationSerializer.serialize(organizations, pagination);
  },

  async findTargetProfileBadges(request: any) {
    const targetProfileId = request.params.id;

    const badges = await usecases.findTargetProfileBadges({ targetProfileId });
    return badgeSerializer.serialize(badges);
  },

  async attachOrganizations(request: any, h: any) {
    const organizationIds = request.payload['organization-ids'];
    const targetProfileId = request.params.id;
    const results = await usecases.attachOrganizationsToTargetProfile({ targetProfileId, organizationIds });

    return h.response(targetProfileAttachOrganizationSerializer.serialize({ ...results, targetProfileId })).code(200);
  },

  async attachOrganizationsFromExistingTargetProfile(request: any, h: any) {
    const existingTargetProfileId = request.payload['target-profile-id'];
    const targetProfileId = request.params.id;
    await usecases.attachOrganizationsFromExistingTargetProfile({ targetProfileId, existingTargetProfileId });
    return h.response({}).code(204);
  },

  async updateTargetProfile(request: any, h: any) {
    const id = request.params.id;
    const { name, description, comment, category } = request.payload.data.attributes;
    await usecases.updateTargetProfile({ id, name, description, comment, category });
    return h.response({}).code(204);
  },

  async outdateTargetProfile(request: any, h: any) {
    const id = request.params.id;

    await usecases.outdateTargetProfile({ id });
    return h.response({}).code(204);
  },

  async createTargetProfile(request: any) {
    const targetProfileData = targetProfileSerializer.deserialize(request.payload);

    const targetProfile = await usecases.createTargetProfile({ targetProfileData });

    return targetProfileWithLearningContentSerializer.serialize(targetProfile);
  },

  async findByTargetProfileId(request: any) {
    const targetProfileId = request.params.id;

    const stages = await usecases.findTargetProfileStages({ targetProfileId });
    return stageSerializer.serialize(stages);
  },

  async createBadge(request: any, h: any) {
    const targetProfileId = request.params.id;
    const badgeCreation = await badgeCreationSerializer.deserialize(request.payload);

    const createdBadge = await usecases.createBadge({ targetProfileId, badgeCreation });

    return h.response(badgeSerializer.serialize(createdBadge)).created();
  },

  async markTargetProfileAsSimplifiedAccess(request: any, h: any) {
    const id = request.params.id;

    const targetProfile = await usecases.markTargetProfileAsSimplifiedAccess({ id });
    return h.response(targetProfileSerializer.serialize(targetProfile));
  },
};
