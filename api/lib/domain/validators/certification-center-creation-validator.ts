// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationConfiguration = { abortEarly: false, allowUnknown: true };

const certificationCenterSchema = Joi.object({
  name: Joi.string().max(255).required().messages({
    'string.empty': 'Le nom n’est pas renseigné.',
    'any.required': 'Le nom n’est pas renseigné.',
    'string.max': 'Le nom ne doit pas dépasser 255 caractères.',
  }),

  type: Joi.string().required().valid('SCO', 'SUP', 'PRO').messages({
    'string.empty': 'Le type n’est pas renseigné.',
    'any.required': 'Le type n’est pas renseigné.',
    'any.only': 'Le type du centre de certification doit avoir l’une des valeurs suivantes: SCO, SUP, PRO.',
  }),

  externalId: Joi.string().optional().allow(null).max(255).messages({
    'string.max': 'L‘identifiant externe ne doit pas dépasser 255 caractères.',
  }),

  isSupervisorAccessEnabled: Joi.boolean().required().messages({
    'any.required': 'L‘accès à l‘espace surveillant n’est pas renseigné.',
    'boolean.base': 'L‘accès à l‘espace surveillant n’est pas renseigné.',
  }),
});

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate(certificationCenter: any) {
    const { error } = certificationCenterSchema.validate(certificationCenter, validationConfiguration);
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
    return true;
  },
};
