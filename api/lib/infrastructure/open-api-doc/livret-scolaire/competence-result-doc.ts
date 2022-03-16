// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Joi.object({
  level: Joi.number().example('4').required().description('Niveau obtenu pour la compétence'),
  competenceId: Joi.string()
    .example('1.1')
    .required()
    .description(
      'ID unique de la compétence : il fait directement référence à l’attribut id du Resource Object Competence'
    ),
}).description('Tableau des niveaux validés par compétence');
