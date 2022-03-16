// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfTutorialEvaluation = require('../orm-models/TutorialEvaluation');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async addEvaluation({
    userId,
    tutorialId
  }: any) {
    const foundTutorialEvaluation = await BookshelfTutorialEvaluation.where({ userId, tutorialId }).fetch({
      require: false,
    });
    if (foundTutorialEvaluation) {
      return _toDomain(foundTutorialEvaluation);
    }

    const newTutorialEvaluation = new BookshelfTutorialEvaluation({ userId, tutorialId });
    const savedTutorialEvaluation = await newTutorialEvaluation.save();
    return _toDomain(savedTutorialEvaluation);
  },

  async find({
    userId
  }: any) {
    const tutorialEvaluation = await BookshelfTutorialEvaluation.where({ userId }).fetchAll();
    return tutorialEvaluation.map(_toDomain);
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(bookshelfTutorialEvaluation: any) {
  return {
    id: bookshelfTutorialEvaluation.get('id'),
    tutorialId: bookshelfTutorialEvaluation.get('tutorialId'),
    userId: bookshelfTutorialEvaluation.get('userId'),
  };
}
