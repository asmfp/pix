// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'first'.
const { first } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../models/Campaign');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'schema'.
const schema = Joi.object({
  type: Joi.string()
    .valid(Campaign.types.ASSESSMENT, Campaign.types.PROFILES_COLLECTION)
    .required()
    .error((errors: any) => first(errors))
    .messages({
      'any.required': 'CAMPAIGN_PURPOSE_IS_REQUIRED',
      'string.base': 'CAMPAIGN_PURPOSE_IS_REQUIRED',
      'any.only': 'CAMPAIGN_PURPOSE_IS_REQUIRED',
    }),

  name: Joi.string().required().messages({
    'string.base': 'CAMPAIGN_NAME_IS_REQUIRED',
    'string.empty': 'CAMPAIGN_NAME_IS_REQUIRED',
  }),

  creatorId: Joi.number().integer().required().messages({
    'any.required': 'MISSING_CREATOR',
    'number.base': 'MISSING_CREATOR',
  }),

  ownerId: Joi.number().integer().required().messages({
    'any.required': 'MISSING_OWNER',
    'number.base': 'MISSING_OWNER',
  }),

  organizationId: Joi.number().integer().required().messages({
    'any.required': 'MISSING_ORGANIZATION',
    'number.base': 'MISSING_ORGANIZATION',
  }),

  targetProfileId: Joi.number()
    .when('type', {
      switch: [
        {
          is: Joi.string().required().valid(Campaign.types.PROFILES_COLLECTION),
          then: Joi.valid(null).optional(),
        },
        {
          is: Joi.string().required().valid(Campaign.types.ASSESSMENT),
          then: Joi.required(),
        },
      ],
    })
    .integer()
    .messages({
      'any.required': 'TARGET_PROFILE_IS_REQUIRED',
      'number.base': 'TARGET_PROFILE_IS_REQUIRED',
      'any.only': 'TARGET_PROFILE_NOT_ALLOWED_FOR_PROFILES_COLLECTION_CAMPAIGN',
    }),

  title: Joi.string()
    .allow(null)
    .when('type', {
      is: Joi.string().required().valid(Campaign.types.PROFILES_COLLECTION),
      then: Joi.valid(null),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.only': 'TITLE_OF_PERSONALISED_TEST_IS_NOT_ALLOWED_FOR_PROFILES_COLLECTION_CAMPAIGN',
    }),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validate'.
function validate(campaign: any) {
  const { error } = schema.validate(campaign, { abortEarly: false, allowUnknown: true });
  if (error) {
    throw EntityValidationError.fromJoiErrors(error.details);
  }
  return true;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = validate;
