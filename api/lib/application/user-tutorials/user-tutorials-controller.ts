// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userTutorialSerializer = require('../../infrastructure/serializers/jsonapi/user-tutorial-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tutorialSe... Remove this comment to see the full error message
const tutorialSerializer = require('../../infrastructure/serializers/jsonapi/tutorial-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialRepository = require('../../infrastructure/repositories/user-tutorial-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async add(request: any, h: any) {
    const { userId } = request.auth.credentials;
    const { tutorialId } = request.params;
    const userTutorial = userTutorialSerializer.deserialize(request.payload);

    const userSavedTutorial = await usecases.addTutorialToUser({ ...userTutorial, userId, tutorialId });

    return h.response(userTutorialSerializer.serialize(userSavedTutorial)).created();
  },

  async find(request: any, h: any) {
    const { userId } = request.auth.credentials;

    const userSavedTutorials = await usecases.findUserTutorials({ userId });

    return h.response(userTutorialSerializer.serialize(userSavedTutorials));
  },

  async findSaved(request: any, h: any) {
    const { userId } = request.auth.credentials;
    const { page } = queryParamsUtils.extractParameters(request.query);

    const userPaginatedSavedTutorials = await usecases.findPaginatedSavedTutorials({ userId, page });

    return h.response(
      tutorialSerializer.serialize(userPaginatedSavedTutorials.results, userPaginatedSavedTutorials.meta)
    );
  },

  async findRecommended(request: any, h: any) {
    const { userId } = request.auth.credentials;
    const { page } = queryParamsUtils.extractParameters(request.query);
    const locale = extractLocaleFromRequest(request);
    const userRecommendedTutorials = await usecases.findPaginatedRecommendedTutorials({ userId, page, locale });

    return h.response(
      tutorialSerializer.serialize(userRecommendedTutorials.results, userRecommendedTutorials.pagination)
    );
  },

  async removeFromUser(request: any, h: any) {
    const { userId } = request.auth.credentials;
    const { tutorialId } = request.params;

    await userTutorialRepository.removeFromUser({ userId, tutorialId });

    return h.response().code(204);
  },
};
