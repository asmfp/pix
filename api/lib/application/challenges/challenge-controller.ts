// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'challengeS... Remove this comment to see the full error message
const challengeSerializer = require('../../infrastructure/serializers/jsonapi/challenge-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: any) {
    return challengeRepository.get(request.params.id).then((challenge: any) => challengeSerializer.serialize(challenge));
  },
};
