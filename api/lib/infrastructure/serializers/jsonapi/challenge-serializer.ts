// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(challenges: any) {
    return new Serializer('challenge', {
      attributes: [
        'type',
        'instruction',
        'competence',
        'proposals',
        'timer',
        'illustrationUrl',
        'attachments',
        'competence',
        'embedUrl',
        'embedTitle',
        'embedHeight',
        'illustrationAlt',
        'format',
        'autoReply',
        'alternativeInstruction',
        'focused',
      ],
      transform: (record: any) => {
        const challenge = _.pickBy(record, (value: any) => !_.isUndefined(value));

        challenge.competence = challenge.competenceId || 'N/A';

        return challenge;
      },
    }).serialize(challenges);
  },
};
