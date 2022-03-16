// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgeWithLearningContentSerializer = require('../../infrastructure/serializers/jsonapi/badge-with-learning-content-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'badgeSeria... Remove this comment to see the full error message
const badgeSerializer = require('../../infrastructure/serializers/jsonapi/badge-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getBadge(request: any) {
    const badgeId = request.params.id;
    const badgeWithLearningContent = await usecases.getBadgeDetails({ badgeId });
    return badgeWithLearningContentSerializer.serialize(badgeWithLearningContent);
  },

  async updateBadge(request: any, h: any) {
    const badgeId = request.params.id;
    const badge = badgeSerializer.deserialize(request.payload);

    const updatedBadge = await usecases.updateBadge({ badgeId, badge });

    return h.response(badgeSerializer.serialize(updatedBadge)).code(204);
  },

  async deleteUnassociatedBadge(request: any, h: any) {
    const badgeId = request.params.id;
    await usecases.deleteUnassociatedBadge({ badgeId });

    return h.response().code(204);
  },
};
