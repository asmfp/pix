// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const badgesController = require('./badges-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/badges/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.badgeId,
          }),
        },
        handler: badgesController.getBadge,
        tags: ['api', 'badges'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle permet de récupérer un résultat thématique.',
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/badges/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.badgeId,
          }),
          payload: Joi.object({
            data: Joi.object({
              id: Joi.string().required(),
              attributes: Joi.object({
                key: Joi.string().required(),
                'alt-message': Joi.string().required(),
                'image-url': Joi.string().required(),
                message: Joi.string().required().allow(null),
                title: Joi.string().required().allow(null),
                'is-certifiable': Joi.boolean().required(),
                'is-always-visible': Joi.boolean().required(),
                'campaign-threshold': Joi.number().allow(null),
                'skill-set-threshold': Joi.number().allow(null),
                'skill-set-name': Joi.string().allow(null).allow(''),
                'skill-set-skills-ids': Joi.array().items(Joi.string()).allow(null),
              }).required(),
              type: Joi.string().required(),
              relationships: Joi.object(),
            }).required(),
          }).required(),
        },
        handler: badgesController.updateBadge,
        tags: ['api', 'badges'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle permet de modifier un résultat thématique.',
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/badges/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.badgeId,
          }),
        },
        handler: badgesController.deleteUnassociatedBadge,
        tags: ['api', 'badges'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle permet de supprimer un résultat thématique non assigné.',
        ],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'badges-api';
