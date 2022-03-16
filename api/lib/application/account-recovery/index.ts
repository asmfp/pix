// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'XRegExp'.
const XRegExp = require('xregexp');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inePattern... Remove this comment to see the full error message
const inePattern = new RegExp('^[0-9]{9}[a-zA-Z]{2}$');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inaPattern... Remove this comment to see the full error message
const inaPattern = new RegExp('^[0-9]{10}[a-zA-Z]{1}$');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const accountRecoveryController = require('./account-recovery-controller');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const { passwordValidationPattern } = require('../../config').account;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'POST',
      path: '/api/account-recovery',
      config: {
        auth: false,
        handler: accountRecoveryController.sendEmailForAccountRecovery,
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'ine-ina': Joi.alternatives().try(
                  Joi.string().regex(inePattern).required(),
                  Joi.string().regex(inaPattern).required()
                ),
                birthdate: Joi.date().format('YYYY-MM-DD').required(),
                email: Joi.string().email().required(),
              },
            },
          }),
          options: {
            allowUnknown: true,
          },
        },
        notes: ["- Permet d'envoyer un mail de demande d'ajout de mot de passe pour récupérer son compte Pix."],
        tags: ['api', 'account-recovery'],
      },
    },
    {
      method: 'GET',
      path: '/api/account-recovery/{temporaryKey}',
      config: {
        auth: false,
        handler: accountRecoveryController.checkAccountRecoveryDemand,
        validate: {
          params: Joi.object({ temporaryKey: Joi.string().min(32) }),
        },
        notes: [
          '- Permet de vérifier la demande de récupération de son compte Pix.\n' +
            '- Renvoie l’utilisateur correspondant à la demande pour une réinitialisation de mot de passe.',
        ],
        tags: ['api', 'account-recovery'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/account-recovery',
      config: {
        auth: false,
        handler: accountRecoveryController.updateUserAccountFromRecoveryDemand,
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                'temporary-key': Joi.string().min(32).required(),
                password: Joi.string().pattern(XRegExp(passwordValidationPattern)).required(),
              },
            },
          }),
          options: {
            allowUnknown: true,
          },
        },
        notes: [
          '- Permet de mettre à jour les informations d’un utilisateur via à une demande de récupération de compte.',
        ],
        tags: ['api', 'account-recovery'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'account-recovery-api';
