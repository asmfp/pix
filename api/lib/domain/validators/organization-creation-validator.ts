// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationConfiguration = { abortEarly: false, allowUnknown: true };

const organizationValidationJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Le nom n’est pas renseigné.',
  }),

  type: Joi.string().required().valid('SCO', 'SUP', 'PRO').messages({
    'string.empty': 'Le type n’est pas renseigné.',
    'any.only': 'Le type de l’organisation doit avoir l’une des valeurs suivantes: SCO, SUP, PRO.',
  }),

  documentationUrl: Joi.string().uri().allow(null).messages({
    'string.uri': 'Le lien vers la documentation n’est pas valide.',
  }),
});

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate(organizationCreationParams: any) {
    const { error } = organizationValidationJoiSchema.validate(organizationCreationParams, validationConfiguration);
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
    return true;
  },
};
