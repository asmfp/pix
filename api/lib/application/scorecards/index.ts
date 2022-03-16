// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const scorecardController = require('./scorecard-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async (server: any) => {
  server.route([
    {
      method: 'GET',
      path: '/api/scorecards/{id}',
      config: {
        handler: scorecardController.getScorecard,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération d'un niveau par compétences de l'utilisateur\n" +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/scorecards/{id}/tutorials',
      config: {
        handler: scorecardController.findTutorials,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération des tutoriels par compétences de l'utilisateur dans une scorecard \n" +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'scorecards-api';
