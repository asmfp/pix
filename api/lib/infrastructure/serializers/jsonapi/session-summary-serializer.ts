// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(sessionSummaries: any, meta: any) {
    return new Serializer('session-summary', {
      attributes: [
        'address',
        'room',
        'date',
        'time',
        'examiner',
        'enrolledCandidatesCount',
        'effectiveCandidatesCount',
        'status',
      ],
      meta,
    }).serialize(sessionSummaries);
  },
};
