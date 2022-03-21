const Joi = require('joi');
const frameworkController = require('./frameworks-controller');
const securityPreHandlers = require('../security-pre-handlers');
const identifiersType = require('../../domain/types/identifiers-type');

exports.register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/frameworks/pix/areas',
      config: {
        handler: frameworkController.getPixFramework,
        pre: [{ method: securityPreHandlers.checkUserIsMemberOfAnOrganization }],
        tags: ['api', 'framework', 'pix'],
        notes: [
          "Cette route est restreinte aux utilisateurs authentifiés membre d'une organisation",
          "Elle permet de demander de récupérer toutes les données du référentiel Pix jusqu'aux sujets",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/frameworks',
      config: {
        handler: frameworkController.getFrameworks,
        pre: [{ method: securityPreHandlers.checkUserHasRolePixMaster }],
        tags: ['api', 'framework'],
        notes: [
          "Cette route est restreinte aux utilisateurs authentifiés membre d'une organisation",
          "Elle permet de récupérer toutes les données du référentiel Pix jusqu'aux sujets",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/frameworks/{id}',
      config: {
        handler: frameworkController.getFramework,
        pre: [{ method: securityPreHandlers.checkUserHasRolePixMaster }],
        validate: {
          params: Joi.object({
            id: identifiersType.frameworkId,
          }),
        },
        tags: ['api', 'framework'],
        notes: [
          "Cette route est restreinte aux utilisateurs authentifiés membre d'une organisation",
          "Elle permet de récupérer toutes les données d'un référentiel jusqu'aux sujets",
        ],
      },
    },
  ]);
};

exports.name = 'tubes-api';
