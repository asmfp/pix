// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

function generateLink(sending: any, filters = {}) {
  const host = settings.apiManager.url;
  const { dateEnvoi, idEnvoi } = sending;
  const cursor = generateCursor({ idEnvoi, dateEnvoi });
  let link = `${host}/pole-emploi/envois?curseur=${cursor}`;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  if (Object.keys(filters).includes('isSuccessful')) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isSuccessful' does not exist on type '{}... Remove this comment to see the full error message
    link += `&enErreur=${!filters.isSuccessful}`;
  }
  return link;
}

function generateCursor(data: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
  const string = JSON.stringify(data);
  const buffer = new Buffer.from(string);
  return buffer.toString('base64');
}

function decodeCursor(strbase64: any) {
  if (!strbase64) return null;

  const buffer = new Buffer.from(strbase64, 'base64');
  const string = buffer.toString('ascii');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
  return JSON.parse(string);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { generateLink, generateCursor, decodeCursor };
