// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Joi.object({
  code: Joi.string().required().description('An application-specific error code.'),
  title: Joi.string().required().description('A short, human-readable summary of the problem'),
  status: Joi.string().required().description('the HTTP status code applicable of the problem'),
  detail: Joi.string().required().description('a human-readable explanation specific of the problem'),
}).label('Response-Error-Object');
