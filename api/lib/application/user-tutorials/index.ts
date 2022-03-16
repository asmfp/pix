// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const userTutorialsController = require('./user-tutorials-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async (server: any) => {
  server.route([
    {
      method: 'PUT',
      path: '/api/users/tutorials/{tutorialId}',
      config: {
        handler: userTutorialsController.add,
        validate: {
          params: Joi.object({
            tutorialId: identifiersType.tutorialId,
          }),
          payload: Joi.object({
            data: Joi.object({
              attributes: Joi.object({
                'skill-id': Joi.string().allow(null),
              }),
            }),
          }).allow(null),
          options: {
            allowUnknown: true,
          },
        },
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Enregistrement d‘un tutoriel par l‘utilisateur courant\n' +
            '- L’id du tutoriel doit faire référence à un tutoriel existant',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/tutorials',
      config: {
        handler: userTutorialsController.find,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des tutoriels enregistrés par l‘utilisateur courant\n',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/tutorials/saved',
      config: {
        handler: userTutorialsController.findSaved,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des tutoriels enregistrés par l‘utilisateur courant\n',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/tutorials/recommended',
      config: {
        handler: userTutorialsController.findRecommended,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération des tutoriels recommandés pour l‘utilisateur courant\n',
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/api/users/tutorials/{tutorialId}',
      config: {
        validate: {
          params: Joi.object({
            tutorialId: identifiersType.tutorialId,
          }),
        },
        handler: userTutorialsController.removeFromUser,
        tags: ['api', 'tutorials'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Suppression d‘un tutoriel de la liste des tutoriels enregistrés par l‘utilisateur courant\n' +
            ' - L‘id du tutoriel doit faire référence à un tutoriel existant',
        ],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'tutorials-api';
