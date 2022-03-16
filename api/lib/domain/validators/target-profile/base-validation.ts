// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'first'.
const { first } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../models/TargetProfile');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = TargetProfile.categories;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'schema'.
const schema = Joi.object({
  category: Joi.string()
    .valid(
      categories.COMPETENCES,
      categories.CUSTOM,
      categories.DISCIPLINE,
      categories.OTHER,
      categories.PREDEFINED,
      categories.SUBJECT
    )
    .required()
    .error((errors: any) => first(errors))
    .messages({
      'any.required': 'CATEGORY_IS_REQUIRED',
      'string.base': 'CATEGORY_IS_REQUIRED',
      'any.only': 'CATEGORY_IS_REQUIRED',
    }),

  name: Joi.string().required().messages({
    'any.required': 'NAME_IS_REQUIRED',
    'string.base': 'NAME_IS_REQUIRED',
    'string.empty': 'NAME_IS_REQUIRED',
  }),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validate'.
function validate(targetProfile: any) {
  const { error } = schema.validate(targetProfile, { abortEarly: false, allowUnknown: true });
  if (error) {
    throw EntityValidationError.fromJoiErrors(error.details);
  }
  return true;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate,
  schema,
};
