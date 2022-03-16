// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUser = require('../orm-models/User');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
const { UserNotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationOfficer = require('../../domain/models/CertificationOfficer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(certificationOfficerId: any) {
    try {
      const certificationOfficer = await BookshelfUser.where({ id: certificationOfficerId }).fetch({
        columns: ['id', 'firstName', 'lastName'],
      });

      return _toDomain(certificationOfficer.attributes);
    } catch (error) {
      if (error instanceof BookshelfUser.NotFoundError) {
        throw new UserNotFoundError(`User not found for ID ${certificationOfficerId}`);
      }
      throw error;
    }
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certificationOfficer: any) {
  return new CertificationOfficer(certificationOfficer);
}
