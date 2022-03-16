// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SieclePars... Remove this comment to see the full error message
const SiecleParser = require('../../infrastructure/serializers/xml/siecle-parser');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractSchoolingRegistrationsInformationFromSIECLE,
};

async function extractSchoolingRegistrationsInformationFromSIECLE(path: any, organization: any) {
  const parser = new SiecleParser(organization, path);

  return parser.parse();
}
