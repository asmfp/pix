// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfStage = require('../orm-models/Stage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, ObjectValidationError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByCampaignId(campaignId: any) {
    const results = await BookshelfStage.query((qb: any) => {
      qb.join('campaigns', 'campaigns.targetProfileId', 'stages.targetProfileId');
      qb.where('campaigns.id', '=', campaignId);
      qb.orderBy('stages.threshold');
    }).fetchAll({ require: false });

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfStage, results);
  },

  findByTargetProfileId(targetProfileId: any) {
    return BookshelfStage.where({ targetProfileId })
      .orderBy('threshold')
      .fetchAll({ require: false })
      .then((results: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfStage, results));
  },

  async create(stage: any) {
    const stageAttributes = _.pick(stage, ['title', 'message', 'threshold', 'targetProfileId']);
    const createdStage = await new BookshelfStage(stageAttributes).save();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfStage, createdStage);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async updateStage({
    id,
    title,
    message,
    threshold,
    prescriberTitle,
    prescriberDescription
  }: any) {
    try {
      await new BookshelfStage({ id }).save(
        { title, message, threshold, prescriberTitle, prescriberDescription },
        { patch: true }
      );
    } catch (error) {
      if (error instanceof BookshelfStage.NoRowsUpdatedError) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError(`Le palier avec l'id ${id} n'existe pas`);
      }
      throw new ObjectValidationError();
    }
  },

  async get(id: any) {
    const bookshelfStage = await BookshelfStage.where('id', id)
      .fetch()
      .catch((err: any) => {
        if (err instanceof BookshelfStage.NotFoundError) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          throw new NotFoundError(`Not found stage for ID ${id}`);
        }
        throw err;
      });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfStage, bookshelfStage);
  },
};
