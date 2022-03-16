// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistrationParser = require('../../infrastructure/serializers/csv/schooling-registration-parser');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractSchoolingRegistrationsInformation,
};

async function extractSchoolingRegistrationsInformation(path: any, organization: any, i18n: any) {
  const buffer = await fs.readFile(path);
  const parser = SchoolingRegistrationParser.buildParser(buffer, organization.id, i18n);
  return parser.parse().registrations;
}
