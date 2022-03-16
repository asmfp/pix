// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateSimplePassword() {
    const letterPart = randomString.generate({
      length: 6,
      charset: 'abcdefghjkmnpqrstuvwxyz',
      capitalization: 'lowercase',
    });
    const numberPart = _.padStart(_.random(99), 2, '0');
    return `${letterPart}${numberPart}`;
  },

  generateComplexPassword() {
    return randomString.generate({
      length: 32,
      charset: 'alphanumeric',
    });
  },
};
