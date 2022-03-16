// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const paginateModule = require('../../infrastructure/utils/paginate');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findPaginatedRecommendedTutorials({
  userId,
  tutorialRepository,
  page,
  locale
}: any) {
  const tutorials = await tutorialRepository.findRecommendedByUserId({ userId, locale });
  return paginateModule.paginate(tutorials, page);
};
