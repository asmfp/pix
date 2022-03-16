// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Joi.object({
  token_type: 'bearer',
  access_token: Joi.string().required().description('The bearer token.'),
  client_id: Joi.string().required().description('The client id.'),
}).label('BearerToken');
