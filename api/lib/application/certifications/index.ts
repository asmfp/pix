// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationController = require('./certification-controller');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../security-pre-handlers');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/certifications',
      config: {
        handler: certificationController.findUserCertifications,
        notes: [
          '- **Route nécessitant une authentification**\n' +
            '- Récupération de toutes les certifications complétées de l’utilisateur courant',
        ],
        tags: ['api', 'certifications'],
      },
    },
    {
      method: 'GET',
      path: '/api/certifications/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.certificationCourseId,
          }),
        },
        handler: certificationController.getCertification,
        notes: [
          '- **Route nécessitant une authentification**\n' +
            '- Seules les certifications de l’utilisateur authentifié sont accessibles\n' +
            '- Récupération des informations d’une certification de l’utilisateur courant',
        ],
        tags: ['api', 'certifications'],
      },
    },
    {
      method: 'POST',
      path: '/api/shared-certifications',
      config: {
        auth: false,
        handler: certificationController.getCertificationByVerificationCode,
        notes: [
          "- **Route accessible par n'importe qui**\n" +
            '- Récupération des informations d’une certification d’un utilisateur' +
            ' via un PixScore et un code de vérification',
        ],
        tags: ['api', 'certifications', 'shared-certifications'],
      },
    },
    {
      method: 'GET',
      path: '/api/attestation/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.certificationCourseId,
          }),
        },
        handler: certificationController.getPDFAttestation,
        notes: [
          '- **Route accessible par un user authentifié**\n' +
            '- Récupération des informations d’une attestation de certification au format PDF' +
            ' via un id de certification et un user id',
        ],
        tags: ['api', 'certifications', 'PDF'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/certification/neutralize-challenge',
      config: {
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                certificationCourseId: identifiersType.certificationCourseId,
                challengeRecId: Joi.string().required(),
              },
            },
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: certificationController.neutralizeChallenge,
        tags: ['api'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/certification/deneutralize-challenge',
      config: {
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                certificationCourseId: identifiersType.certificationCourseId,
                challengeRecId: Joi.string().required(),
              },
            },
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: certificationController.deneutralizeChallenge,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'certifications-api';
