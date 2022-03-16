// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateNumericalString(numberOfDigits: any) {
    return randomString.generate({
      charset: 'numeric',
      length: numberOfDigits,
      readable: true,
    });
  },
};
