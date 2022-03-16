// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
const { WrongDateFormatError } = require('../../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
const { isValidDate } = require('../../utils/date-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../domain/models/Session');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(sessions: any, hasSupervisorAccess: any) {
    const attributes = [
      'address',
      'room',
      'examiner',
      'date',
      'time',
      'status',
      'description',
      'accessCode',
      'examinerGlobalComment',
      'finalizedAt',
      'resultsSentToPrescriberAt',
      'publishedAt',
      'certificationCenterId',
      'certificationCandidates',
      'certificationReports',
      'supervisorPassword',
      'hasSupervisorAccess',
    ];
    return new Serializer('session', {
      transform(record: any) {
        if (hasSupervisorAccess !== undefined) {
          record.hasSupervisorAccess = hasSupervisorAccess;
        }
        return record;
      },
      attributes,
      certificationCandidates: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/sessions/${parent.id}/certification-candidates`;
          },
        },
      },
      certificationReports: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/sessions/${parent.id}/certification-reports`;
          },
        },
      },
    }).serialize(sessions);
  },

  serializeForFinalization(sessions: any) {
    return new Serializer('session', {
      attributes: ['status', 'examinerGlobalComment'],
      transform(session: any) {
        return { ...session, status: session.status };
      },
    }).serialize(sessions);
  },

  deserialize(json: any) {
    const attributes = json.data.attributes;
    if (!isValidDate(attributes.date, 'YYYY-MM-DD')) {
      throw new WrongDateFormatError();
    }

    const result = new Session({
      id: json.data.id,
      certificationCenterId: attributes['certification-center-id'],
      address: attributes.address,
      room: attributes.room,
      examiner: attributes.examiner,
      date: attributes.date,
      time: attributes.time,
      status: attributes.status,
      description: attributes.description,
      examinerGlobalComment: attributes['examiner-global-comment'],
    });

    if (_.isEmpty(_.trim(result.examinerGlobalComment))) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'NO_EXAMINER_GLOBAL_COMMENT' does not exi... Remove this comment to see the full error message
      result.examinerGlobalComment = Session.NO_EXAMINER_GLOBAL_COMMENT;
    }

    return result;
  },
};
