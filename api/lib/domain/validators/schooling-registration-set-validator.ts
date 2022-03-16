// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationConfiguration = { allowUnknown: true };

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.array().unique((a: any, b: any) => {
  return a.nationalStudentId === b.nationalStudentId;
});

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkValidationUnicity(schoolingRegistrationSet: any) {
    const { error } = validationSchema.validate(schoolingRegistrationSet.registrations, validationConfiguration);

    if (error) {
      const err = EntityValidationError.fromJoiErrors(error.details);
      err.key = 'nationalIdentifier';
      err.why = 'uniqueness';

      throw err;
    }
  },
};
