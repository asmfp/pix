// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUser = require('./User');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfP... Remove this comment to see the full error message
const BookshelfPixRole = require('./PixRole');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'modelName'... Remove this comment to see the full error message
const modelName = 'UserPixRole';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'users_pix_roles',

    user() {
      return this.belongsTo(BookshelfUser);
    },

    pixRole() {
      return this.belongsTo(BookshelfPixRole);
    },
  },
  {
    modelName,
  }
);
