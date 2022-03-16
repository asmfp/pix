// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serializeForPaginatedList(jurySessionsForPaginatedList: any) {
    const { jurySessions, pagination } = jurySessionsForPaginatedList;
    return this.serialize(jurySessions, undefined, pagination);
  },

  serialize(jurySessions: any, hasSupervisorAccess: any, meta: any) {
    return new Serializer('sessions', {
      attributes: [
        'certificationCenterName',
        'certificationCenterType',
        'certificationCenterId',
        'certificationCenterExternalId',
        'address',
        'room',
        'examiner',
        'date',
        'time',
        'accessCode',
        'status',
        'description',
        'examinerGlobalComment',
        'finalizedAt',
        'resultsSentToPrescriberAt',
        'publishedAt',
        'juryComment',
        'juryCommentAuthorId',
        'juryCommentedAt',
        'hasSupervisorAccess',
        // included
        'assignedCertificationOfficer',
        'juryCommentAuthor',
        // links
        'juryCertificationSummaries',
      ],
      juryCertificationSummaries: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/admin/sessions/${parent.id}/jury-certification-summaries`;
          },
        },
      },
      assignedCertificationOfficer: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName'],
      },
      juryCommentAuthor: {
        ref: 'id',
        included: true,
        attributes: ['firstName', 'lastName'],
      },
      transform(jurySession: any) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
        const transformedJurySession = Object.assign({}, jurySession);
        transformedJurySession.status = jurySession.status;
        if (hasSupervisorAccess !== undefined) {
          transformedJurySession.hasSupervisorAccess = hasSupervisorAccess;
        }
        return transformedJurySession;
      },
      typeForAttribute: function (attribute: any) {
        if (attribute === 'assignedCertificationOfficer') {
          return 'user';
        }
        if (attribute === 'juryCommentAuthor') {
          return 'user';
        }
        return attribute;
      },
      meta,
    }).serialize(jurySessions);
  },
};
