// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path');

/* eslint-disable-next-line no-sync */
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('fs')
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
  .readdirSync(__dirname)
  .forEach(function (file: any) {
    if (file === 'index.js') return;

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
    module.exports[path.basename(file, '.js')] = require(path.join(__dirname, file));
  });
