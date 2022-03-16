// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationPointOfContactController = require('./certification-point-of-contact-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/certification-point-of-contacts/me',
      config: {
        handler: certificationPointOfContactController.get,
        notes: [
          // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
          '- **Cette route est restreinte aux utilisateurs authentifiés*' * '\n' +
            '- Récupération d’un référent de certification.',
        ],
        tags: ['api', 'user', 'certification', 'certification-point-of-contact'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'certification-point-of-contacts-api';
