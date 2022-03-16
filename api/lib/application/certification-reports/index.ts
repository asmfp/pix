// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationReportController = require('./certification-report-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'authorizat... Remove this comment to see the full error message
const authorization = require('../preHandlers/authorization');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async (server: any) => {
  server.route([
    {
      method: 'POST',
      path: '/api/certification-reports/{id}/certification-issue-reports',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.certificationIssueReportId,
          }),
        },
        handler: certificationReportController.saveCertificationIssueReport,
        tags: ['api', 'certification-reports'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n',
          "- Elle permet d'enregistrer un signalement relevé par un surveillant sur la certification d'un candidat",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/certification-reports/{id}/abort',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.certificationCourseId,
          }),
        },
        pre: [
          {
            method: authorization.verifyCertificationSessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: certificationReportController.abort,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'certification-reports-api';
