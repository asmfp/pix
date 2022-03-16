// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Joi.object({
  code: Joi.string().required().description("Code erreur spécifique à l'application."),
  titre: Joi.string().required().description("Un résumé court et lisible de l'erreur"),
  statut: Joi.string().required().description("le code d'état HTTP lié à l'erreur"),
  detail: Joi.string().required().description("Une explication détaillé et lisible de l'erreur"),
}).label('Erreur');
