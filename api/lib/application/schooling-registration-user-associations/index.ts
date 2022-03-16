// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sendJsonAp... Remove this comment to see the full error message
const { sendJsonApiError, UnprocessableEntityError, NotFoundError } = require('../http-errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const schoolingRegistrationUserAssociationController = require('./schooling-registration-user-association-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'POST',
      path: '/api/schooling-registration-user-associations',
      config: {
        handler: schoolingRegistrationUserAssociationController.reconcileSchoolingRegistrationManually,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').required(),
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
              type: 'schooling-registration-user-associations',
            },
          }),
          failAction: (request: any, h: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle associe des données saisies par l’utilisateur à l’inscription de l’élève dans cette organisation',
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },
    {
      method: 'POST',
      path: '/api/schooling-registration-user-associations/student',
      config: {
        handler: schoolingRegistrationUserAssociationController.reconcileHigherSchoolingRegistration,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').required(),
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
              type: 'schooling-registration-user-associations',
            },
          }),
          failAction: (request: any, h: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle réconcilie l’utilisateur à l’inscription d’un étudiant dans cette organisation',
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },
    {
      method: 'POST',
      path: '/api/schooling-registration-user-associations/auto',
      config: {
        handler: schoolingRegistrationUserAssociationController.reconcileSchoolingRegistrationAutomatically,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
              type: 'schooling-registration-user-associations',
            },
          }),
          failAction: (request: any, h: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle essaye d’associer automatiquement l’utilisateur à l’inscription de l’élève dans cette organisation',
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },
    {
      method: 'GET',
      path: '/api/schooling-registration-user-associations',
      config: {
        handler: schoolingRegistrationUserAssociationController.findAssociation,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération de l'inscription de l'élève à l'organisation, et de l'utilisateur associé\n" +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },
    {
      method: 'PUT',
      path: '/api/schooling-registration-user-associations/possibilities',
      config: {
        auth: false,
        handler: schoolingRegistrationUserAssociationController.generateUsername,
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
              },
            },
          }),
          failAction: (request: any, h: any) => {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- Elle permet de savoir si un élève identifié par son nom, prénom et date de naissance est inscrit à ' +
            "l'organisation détenant la campagne. Cet élève n'est, de plus, pas encore associé à l'organisation.",
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },

    {
      method: 'PATCH',
      path: '/api/organizations/{id}/schooling-registration-user-associations/{schoolingRegistrationId}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents,
          },
        ],
        handler: schoolingRegistrationUserAssociationController.updateStudentNumber,
        validate: {
          options: {
            allowUnknown: true,
          },
          params: Joi.object({
            id: identifiersType.organizationId,
            schoolingRegistrationId: identifiersType.schoolingRegistrationId,
          }),
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
            },
          }),
          failAction: (request: any, h: any, err: any) => {
            const isStudentNumber = err.details[0].path.includes('student-number');
            if (isStudentNumber) {
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
              return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
            }
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            return sendJsonApiError(new NotFoundError('Ressource non trouvée'), h);
          },
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés et admin au sein de l'orga**\n" +
            '- Elle met à jour le numéro étudiant',
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },

    {
      method: 'DELETE',
      path: '/api/schooling-registration-user-associations/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: schoolingRegistrationUserAssociationController.dissociate,
        validate: {
          params: Joi.object({
            id: identifiersType.schoolingRegistrationId,
          }),
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle dissocie un utilisateur d’une inscription d’élève',
        ],
        tags: ['api', 'schoolingRegistrationUserAssociation'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'schooling-registration-user-associations-api';
