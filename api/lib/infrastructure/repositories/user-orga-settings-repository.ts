// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUserOrgaSettings = require('../orm-models/UserOrgaSettings');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const { UserOrgaSettingsCreationError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const UserOrgaSettings = require('../../domain/models/UserOrgaSettings');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findOneByUserId(userId: any) {
    return BookshelfUserOrgaSettings.where({ userId })
      .fetch({ require: true, withRelated: ['user', 'currentOrganization'] })
      .then((userOrgaSettings: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfUserOrgaSettings, userOrgaSettings)
      )
      .catch((err: any) => {
        if (err instanceof BookshelfUserOrgaSettings.NotFoundError) {
          return {};
        }
        throw err;
      });
  },

  create(userId: any, currentOrganizationId: any) {
    return new BookshelfUserOrgaSettings({ userId, currentOrganizationId })
      .save()
      .then((bookshelfUserOrgaSettings: any) => bookshelfUserOrgaSettings.load(['user', 'currentOrganization']))
      .then((userOrgaSettings: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfUserOrgaSettings, userOrgaSettings)
      )
      .catch((err: any) => {
        if (bookshelfUtils.isUniqConstraintViolated(err)) {
          throw new UserOrgaSettingsCreationError(err.message);
        }
        throw err;
      });
  },

  async update(userId: any, organizationId: any) {
    const bookshelfUserOrgaSettings = await BookshelfUserOrgaSettings.where({ userId }).save(
      { currentOrganizationId: organizationId },
      { patch: true, method: 'update' }
    );
    await bookshelfUserOrgaSettings.related('user').fetch();
    await bookshelfUserOrgaSettings.related('currentOrganization').fetch();
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUserOrgaSettings, bookshelfUserOrgaSettings);
  },

  async createOrUpdate({
    userId,
    organizationId
  }: any) {
    const knexUserOrgaSetting = (
      await knex('user-orga-settings')
        .insert({ userId, currentOrganizationId: organizationId })
        .onConflict('userId')
        .merge()
        .returning('*')
    )[0];

    const user = await knex('users').where({ id: knexUserOrgaSetting.userId }).first();

    const organization = await knex('organizations').where({ id: knexUserOrgaSetting.currentOrganizationId }).first();

    return new UserOrgaSettings({
      id: knexUserOrgaSetting.id,
      user,
      currentOrganization: organization,
    });
  },
};
