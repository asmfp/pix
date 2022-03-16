// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../models/Organization');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationCreationValidator = require('../validators/organization-creation-validator');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createOrganization({
  createdBy,
  externalId,
  logoUrl,
  name,
  type,
  provinceCode,
  documentationUrl,
  organizationRepository
}: any) {
  organizationCreationValidator.validate({ name, type, documentationUrl });
  const organization = new Organization({ createdBy, name, type, logoUrl, externalId, provinceCode, documentationUrl });
  return organizationRepository.create(organization);
};
