// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'XRegExp'.
const XRegExp = require('xregexp');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sendJsonAp... Remove this comment to see the full error message
const { sendJsonApiError, BadRequestError } = require('../http-errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const { passwordValidationPattern } = require('../../config').account;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inePattern... Remove this comment to see the full error message
const inePattern = new RegExp('^[0-9]{9}[a-zA-Z]{2}$');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inaPattern... Remove this comment to see the full error message
const inaPattern = new RegExp('^[0-9]{10}[a-zA-Z]{1}$');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const schoolingRegistrationDependentUserController = require('./schooling-registration-dependent-user-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'POST',
      path: '/api/schooling-registration-dependent-users',
      config: {
        auth: false,
        handler: schoolingRegistrationDependentUserController.createAndReconcileUserToSchoolingRegistration,
        validate: {
          options: {
            allowUnknown: true,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                password: Joi.string().pattern(XRegExp(passwordValidationPattern)).required(),
                'with-username': Joi.boolean().required(),
                username: Joi.string().pattern(XRegExp('^([a-z]+[.]+[a-z]+[0-9]{4})$')).allow(null),
              },
            },
          }),
        },
        notes: [
          "Cette route crée un utilisateur et l'associe à l'élève trouvé au sein de l'organisation à laquelle " +
            'appartient la campagne spécifiée',
        ],
        tags: ['api', 'schoolingRegistrationDependentUser'],
      },
    },
    {
      method: 'POST',
      path: '/api/schooling-registration-dependent-users/external-user-token',
      config: {
        auth: false,
        handler:
          schoolingRegistrationDependentUserController.createUserAndReconcileToSchoolingRegistrationFromExternalUser,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'external-user-token': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').raw().required(),
                'access-token': Joi.string().allow(null).optional(),
              },
              type: 'external-users',
            },
          }),
        },
        notes: [
          "Cette route crée un compte utilisateur suite à une connexion provenant d'un IDP externe (GAR). " +
            "Les informations sont fournies dans un token. Elle réconcilie également cet utilisateur avec l'inscription " +
            "de l'élève au sein de l'organisation qui a créé la campagne.",
        ],
        tags: ['api', 'schoolingRegistrationDependentUser'],
      },
    },
    {
      method: 'POST',
      path: '/api/schooling-registration-dependent-users/password-update',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents,
            assign: 'belongsToScoOrganizationAndManageStudents',
          },
        ],
        handler: schoolingRegistrationDependentUserController.updatePassword,
        validate: {
          options: {
            allowUnknown: true,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'organization-id': identifiersType.campaignId,
                'schooling-registration-id': identifiersType.schoolingRegistrationId,
              },
            },
          }),
          failAction: (request: any, h: any) => {
            return sendJsonApiError(
              new BadRequestError('The server could not understand the request due to invalid syntax.'),
              h
            );
          },
        },
        notes: [
          "- Met à jour le mot de passe d'un utilisateur identifié par son identifiant élève\n" +
            "- La demande de modification du mot de passe doit être effectuée par un membre de l'organisation à laquelle appartient l'élève.",
        ],
        tags: ['api', 'schoolingRegistrationDependentUser'],
      },
    },
    {
      method: 'POST',
      path: '/api/schooling-registration-dependent-users/generate-username-password',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserBelongsToScoOrganizationAndManagesStudents,
            assign: 'belongsToScoOrganizationAndManageStudents',
          },
        ],
        handler: schoolingRegistrationDependentUserController.generateUsernameWithTemporaryPassword,
        validate: {
          options: {
            allowUnknown: true,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'organization-id': identifiersType.organizationId,
                'schooling-registration-id': identifiersType.schoolingRegistrationId,
              },
            },
          }),
        },
        notes: [
          "- Génère un identifiant pour l'élève avec un mot de passe temporaire \n" +
            "- La demande de génération d'identifiant doit être effectuée par un membre de l'organisation à laquelle appartient l'élève.",
        ],
        tags: ['api', 'schoolingRegistrationDependentUser', 'username'],
      },
    },
    {
      method: 'POST',
      path: '/api/schooling-registration-dependent-users/recover-account',
      config: {
        auth: false,
        handler: schoolingRegistrationDependentUserController.checkScoAccountRecovery,
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
              },
            },
          }).options({ allowUnknown: true }),
        },
        notes: [
          "- Recherche d'un ancien élève par son ine/ina, prénom, nom, date de naissance \n" +
            '- On renvoie les informations permettant de récupérer son compte Pix.',
        ],
        tags: ['api', 'schoolingRegistrationDependentUser', 'recovery'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'schooling-registration-dependent-users-api';
