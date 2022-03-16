// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ProgressionController = require('./progression-controller');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/progressions/{id}',
      config: {
        handler: ProgressionController.get,
        tags: ['api'],
        notes: [
          '- **Route nécessitant une authentification**\n' +
            '- Cette route renvoie une évaluation des acquis utilisateur basée sur un profil cible',
        ],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'progressions-api';
