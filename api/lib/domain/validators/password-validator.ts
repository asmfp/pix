// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'XRegExp'.
const XRegExp = require('xregexp');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const { passwordValidationPattern } = require('../../config').account;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');

const pattern = XRegExp(passwordValidationPattern);

const passwordValidationJoiSchema = Joi.object({
  password: Joi.string().pattern(pattern).required().max(255).messages({
    'string.empty': 'Votre mot de passe n’est pas renseigné.',
    'string.pattern.base':
      'Votre mot de passe doit contenir 8 caractères au minimum et comporter au moins une majuscule, une minuscule et un chiffre.',
    'string.max': 'Votre mot de passe ne doit pas dépasser les 255 caractères.',
    'any.required': 'Votre mot de passe n’est pas renseigné.',
  }),
});

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  validate(password: any) {
    const { error } = passwordValidationJoiSchema.validate({ password });
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
    return true;
  },
};
