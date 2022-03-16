// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validateEntity(schema: any, entity: any) {
    const { error } = schema.validate(entity);
    if (error) {
      throw new ObjectValidationError(error);
    }
  },
};
