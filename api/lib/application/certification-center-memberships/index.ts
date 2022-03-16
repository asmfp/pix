// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCenterMembershipController = require('./certification-center-membership-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'POST',
      path: '/api/certification-center-memberships',
      config: {
        handler: certificationCenterMembershipController.create,
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        notes: [
          '- **Cette route est restreinte aux utilisateurs Pix Master authentifiés**\n' +
            '- Création d‘un lien entre un utilisateur et un centre de certification\n' +
            '- L‘utilisateur doit avoir les droits d‘accès en tant que Pix Master',
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
    {
      method: 'DELETE',
      path: '/api/certification-center-memberships/{id}',
      config: {
        handler: certificationCenterMembershipController.disable,
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        notes: [
          '- **Cette route est restreinte aux utilisateurs Pix Master authentifiés**\n' +
            '- Désactivation d‘un lien entre un utilisateur et un centre de certification\n',
        ],
        tags: ['api', 'certification-center-membership'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'certification-center-memberships-api';
