// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'XRegExp'.
const XRegExp = require('xregexp');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const { passwordValidationPattern } = require('../../config').account;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const passwordController = require('./password-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'POST',
      path: '/api/password-reset-demands',
      config: {
        auth: false,
        handler: passwordController.createResetDemand,
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                email: Joi.string().email().required(),
                'temporary-key': [Joi.string(), null],
              },
              type: Joi.string(),
            },
          }),
        },
        notes: ['Route publique', 'Faire une demande de réinitialisation de mot de passe'],
        tags: ['api', 'passwords'],
      },
    },

    {
      method: 'GET',
      path: '/api/password-reset-demands/{temporaryKey}',
      config: {
        auth: false,
        handler: passwordController.checkResetDemand,
        tags: ['api', 'passwords'],
      },
    },
    {
      method: 'POST',
      path: '/api/expired-password-updates',
      config: {
        auth: false,
        handler: passwordController.updateExpiredPassword,
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                username: Joi.string().required(),
                expiredPassword: Joi.string().required(),
                newPassword: Joi.string().pattern(XRegExp(passwordValidationPattern)).required(),
              },
              type: Joi.string(),
            },
          }),
        },
        notes: ['Route publique', 'Cette route permet de mettre à jour un mot de passe expiré'],
        tags: ['api', 'passwords'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'passwords-api';
