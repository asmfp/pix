// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createRelease(request: any, h: any) {
    usecases
      .createLcmsRelease()
      .then(() => {
        logger.info('Release created and cache reloaded');
      })
      .catch((e: any) => {
        logger.error('Error while creating the release and reloading cache', e);
      });
    return h.response({}).code(204);
  },
};
