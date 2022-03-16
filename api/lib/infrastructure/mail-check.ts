// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'promisify'... Remove this comment to see the full error message
const { promisify } = require('util');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const resolveMx = promisify(require('dns').resolveMx);

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkMail(address: any) {
    const domain = address.replace(/.*@/g, '');
    return resolveMx(domain).then(() => true);
  },
};
