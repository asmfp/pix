const Joi = require('joi');
const securityPreHandlers = require('../security-pre-handlers');
const sessionController = require('./session-controller');
const sessionForSupervisingController = require('./session-for-supervising-controller');
const finalizedSessionController = require('./finalized-session-controller');
const authorization = require('../preHandlers/authorization');
const identifiersType = require('../../domain/types/identifiers-type');
const { sendJsonApiError, UnprocessableEntityError } = require('../http-errors');
const endTestScreenRemovalEnabled = require('../preHandlers/end-test-screen-removal-enabled');
const assessmentSupervisorAuthorization = require('../preHandlers/session-supervisor-authorization');

exports.register = async (server) => {
  server.route([
    {
      method: 'GET',
      path: '/api/admin/sessions',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.findPaginatedFilteredJurySessions,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle permet de consulter la liste de toutes les sessions avec filtre et pagination (retourne un tableau avec n éléments)',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/sessions/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.getJurySession,
        tags: ['api', 'sessions'],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.get,
        tags: ['api', 'sessions'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/sessions/to-publish',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: finalizedSessionController.findFinalizedSessionsToPublish,
        tags: ['api', 'finalized-sessions'],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/sessions/with-required-action',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: finalizedSessionController.findFinalizedSessionsWithRequiredAction,
        tags: ['api', 'finalized-sessions'],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}/attendance-sheet',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        handler: sessionController.getAttendanceSheet,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs appartenant à un centre de certification ayant créé la session**\n' +
            '- Cette route permet de télécharger le pv de session pré-rempli au format ods',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}/supervisor-kit',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        handler: sessionController.getSupervisorKitPdf,
        tags: ['api', 'sessions', 'supervisor'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs appartenant à un centre de certification ayant créé la session**\n' +
            '- Cette route permet de télécharger le kit surveillant au format pdf',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}/candidates-import-sheet',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        handler: sessionController.getCandidatesImportSheet,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs appartenant à un centre de certification ayant créé la session**\n' +
            "- Cette route permet de télécharger le template d'import des candidats d'une certification au format ods",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/sessions',
      config: {
        handler: sessionController.save,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle permet de créer une session de certification liée au centre de certification de l’utilisateur',
        ],
      },
    },
    {
      method: 'PUT',
      path: '/api/sessions/{id}/finalization',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.finalize,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle permet de finaliser une session de certification afin de la signaler comme terminée',
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/sessions/{id}/certification-candidates/import',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        payload: {
          multipart: true,
          allow: 'multipart/form-data',
          maxBytes: 1048576 * 10, // 10MB
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.importCertificationCandidatesFromCandidatesImportSheet,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés et appartenant à un centre de certification ayant créé la session**\n' +
            '- Elle permet de récupérer la liste des candidats à inscrire contenue dans le PV de session format ODS envoyé',
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/sessions/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.update,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Modification d'une session de certification\n" +
            '- L‘utilisateur doit avoir les droits d‘accès à l‘organisation liée à la session à modifier',
        ],
        tags: ['api', 'session'],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}/certification-candidates',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.getCertificationCandidates,
        tags: ['api', 'sessions', 'certification-candidates'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          'Elle retourne les candidats de certification inscrits à la session.',
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/sessions/{id}/certification-candidates',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.addCertificationCandidate,
        tags: ['api', 'sessions', 'certification-candidates'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          'Elle ajoute un candidat de certification à la session.',
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/api/sessions/{id}/certification-candidates/{certificationCandidateId}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
            certificationCandidateId: identifiersType.certificationCandidateId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.deleteCertificationCandidate,
        tags: ['api', 'sessions', 'certification-candidates'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          'Elle supprime un candidat de certification à la session.',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/sessions/{id}/jury-certification-summaries',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.getJuryCertificationSummaries,
        tags: ['api', 'sessions', 'jury-certification-summary'],
        notes: [
          'Cette route est restreinte aux utilisateurs ayant le rôle PIXMASTER',
          "Elle retourne les résumés de certifications d'une session",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/admin/sessions/{id}/generate-results-download-link',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.generateSessionResultsDownloadLink,
        tags: ['api', 'sessions'],
        notes: [
          'Cette route est restreinte aux utilisateurs ayant le rôle PIXMASTER',
          "Elle permet de générer un lien permettant de télécharger tous les résultats de certification d'une session",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/download-results/{token}',
      config: {
        auth: false,
        handler: sessionController.getSessionResultsByRecipientEmail,
        tags: ['api', 'sessions', 'results'],
        notes: [
          "Cette route est accessible via un token envoyé par email lors de l'envoi automatique des résultats de certification",
          "Elle retourne les résultats de certifications d'une session agrégés par email de destinataire des résultats, sous format CSV",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}/supervising',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: endTestScreenRemovalEnabled.verifyBySessionId,
            assign: 'endTestScreenRemovalEnabledCheck',
          },
          {
            method: assessmentSupervisorAuthorization.verifyBySessionId,
            assign: 'isSupervisorForSession',
          },
        ],
        handler: sessionForSupervisingController.get,
        tags: ['api', 'sessions', 'supervising'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          "Elle retourne les informations d'une session à surveiller",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/sessions/supervise',
      config: {
        validate: {
          payload: Joi.object({
            data: {
              id: Joi.string().required(),
              type: 'supervisor-authentications',
              attributes: {
                'supervisor-password': Joi.string().required(),
                'session-id': Joi.number().required(),
              },
            },
          }),
          failAction: (request, h) => {
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        pre: [
          {
            method: endTestScreenRemovalEnabled.verifyBySessionId,
            assign: 'endTestScreenRemovalEnabledCheck',
          },
        ],
        handler: sessionForSupervisingController.supervise,
        tags: ['api', 'sessions', 'supervising'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          "Elle valide l'accès du'un surveillant à l'espace surveillant",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/download-all-results/{token}',
      config: {
        auth: false,
        handler: sessionController.getSessionResultsToDownload,
        tags: ['api', 'sessions', 'results'],
        notes: [
          'Cette route est accessible via un token généré par un utilisateur ayant le rôle PIXMASTER',
          "Elle retourne tous les résultats de certifications d'une session, sous format CSV",
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/sessions/{id}/certification-reports',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.getCertificationReports,
        tags: ['api', 'sessions', 'certification-reports'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          "Elle retourne des infos sur les certifications d'une session.",
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/sessions/{id}/candidate-participation',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        handler: sessionController.createCandidateParticipation,
        tags: ['api', 'sessions', 'certification-candidates'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés',
          'Elle associe un candidat de certification à une session\n' +
            "à un utilisateur à l'aide des informations d'identité de celui-ci (nom, prénom et date de naissance).",
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/sessions/{id}/publish',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.publish,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Publie toutes les certifications courses d'une session",
        ],
        tags: ['api', 'session', 'publication'],
      },
    },
    {
      method: 'POST',
      path: '/api/admin/sessions/publish-in-batch',
      config: {
        validate: {
          payload: Joi.object({
            data: {
              attributes: {
                ids: Joi.array().items(identifiersType.sessionId),
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
        handler: sessionController.publishInBatch,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle PixMaster**\n' +
            "- Permet de publier plusieurs sessions sans problème d'un coup",
        ],
        tags: ['api', 'session', 'publication'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/sessions/{id}/unpublish',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.unpublish,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Dépublie toutes les certifications courses d'une session",
        ],
        tags: ['api', 'session', 'publication'],
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/sessions/{id}/results-sent-to-prescriber',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],

        handler: sessionController.flagResultsAsSentToPrescriber,
        tags: ['api', 'sessions'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle Pix Master**\n' +
            '- Elle permet de marquer le fait que les résultats de la session ont été envoyés au prescripteur,\n',
          '- par le biais de la sauvegarde de la date courante.',
        ],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/sessions/{id}/certification-officer-assignment',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.assignCertificationOfficer,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle PixMaster**\n' +
            '- Assigne la session à un membre du pôle certification (certification-officer)',
        ],
        tags: ['api', 'session', 'assignment'],
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/sessions/{id}/comment',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.commentAsJury,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle PixMaster**\n' +
            "- Ajoute/modifie un commentaire d'un membre du pôle certification (certification-officer)",
        ],
        tags: ['api', 'session', 'assignment'],
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/sessions/{id}/comment',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkUserHasRolePixMaster,
            assign: 'hasRolePixMaster',
          },
        ],
        handler: sessionController.deleteJuryComment,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés avec le rôle PixMaster**\n' +
            "- Supprime le commentaire d'un membre du pôle certification (certification-officer)",
        ],
        tags: ['api', 'session', 'assignment'],
      },
    },
    {
      method: 'PUT',
      path: '/api/sessions/{id}/enroll-students-to-session',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.sessionId,
          }),
        },
        pre: [
          {
            method: authorization.verifySessionAuthorization,
            assign: 'authorizationCheck',
          },
        ],
        handler: sessionController.enrollStudentsToSession,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Dans le cadre du SCO, inscrit un élève à une session de certification',
        ],
        tags: ['api', 'sessions', 'certification-candidates'],
      },
    },
  ]);
};

exports.name = 'sessions-api';
