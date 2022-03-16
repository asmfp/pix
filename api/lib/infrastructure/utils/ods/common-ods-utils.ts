// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const JSZip = require('jszip');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'loadOdsZip... Remove this comment to see the full error message
async function loadOdsZip(odsFilePath: any) {
  const odsFileData = await _openOdsFile(odsFilePath);
  const zip = JSZip();
  return zip.loadAsync(odsFileData);
}

function _openOdsFile(odsFilePath: any) {
  return fs.readFile(odsFilePath);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  loadOdsZip,
};
