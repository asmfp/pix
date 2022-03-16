// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const stagesController = require('./stages-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/stages',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: stagesController.create,
        tags: ['api', 'stages'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/stages/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.stageId,
          }),
        },
        handler: stagesController.getStageDetails,
        tags: ['api', 'stages'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle permet de récupérer un palier.',
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/stages/{id}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.stageId,
          }),
          payload: Joi.object({
            data: {
              attributes: {
                threshold: Joi.number().required().allow(null),
                title: Joi.string().required().allow(null),
                message: Joi.string().required().allow(null),
                'prescriber-title': Joi.string().required().allow(null),
                'prescriber-description': Joi.string().required().allow(null),
              },
            },
          }).options({ allowUnknown: true }),
        },
        handler: stagesController.updateStage,
        tags: ['api', 'stages'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            "- Elle permet de mettre à jour le prescriberTitle et le prescriberDescription d'un palier.",
        ],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'stages-api';
