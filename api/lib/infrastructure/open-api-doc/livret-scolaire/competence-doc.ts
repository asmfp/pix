// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const areaDoc = require('./area-doc');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Joi.object({
  id: Joi.number().example('1.1').required().description('ID unique de la compétence (ex : “1.1”, “4.3”)'),
  name: Joi.string()
    .example('Mener une recherche et une veille d’information')
    .required()
    .description('Nom de la compétence'),
  area: areaDoc,
});
