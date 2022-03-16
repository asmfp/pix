// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationController = require('./certification-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'responseEr... Remove this comment to see the full error message
const responseErrorObjectDoc = require('../../infrastructure/open-api-doc/livret-scolaire/response-object-error-doc');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationsResultsResponseDoc = require('../../infrastructure/open-api-doc/livret-scolaire/certifications-results-doc');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/organizations/{uai}/certifications',
      config: {
        auth: 'jwt-livret-scolaire',
        handler: certificationController.getCertificationsByOrganizationUAI,
        notes: [
          '- **API for LSU/LSL qui nécessite une authentification de type client credential grant**\n' +
            '- Récupération des résultats de certifications pour une organisation. Les résultats sont accompagnés du référentiel des compétences',
        ],
        response: {
          failAction: 'log',
          status: {
            200: certificationsResultsResponseDoc,
            204: certificationsResultsResponseDoc,
            403: responseErrorObjectDoc,
          },
        },
        validate: {
          params: Joi.object({
            uai: Joi.string()
              .required()
              .description(
                'UAI/RNE (Unité Administrative Immatriculée anciennement Répertoire National des Établissements) '
              ),
          }),
          headers: Joi.object({
            authorization: Joi.string().description('Bearer Access token to access to API '),
          }).unknown(),
        },
        tags: ['api', 'organisation', 'livret-scolaire'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'certifications-lsu-lsl-api';
