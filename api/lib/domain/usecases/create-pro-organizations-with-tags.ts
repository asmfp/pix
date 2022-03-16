// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, map, uniqBy } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../models/Organization');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationTag = require('../models/OrganizationTag');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
  ManyOrganizationsFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationAlreadyExistError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationTagNotFound,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
const ORGANIZATION_TAG_SEPARATOR = '_';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../domain/services/organization-invitation-service');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createProOrganizationsWithTags({
  organizations,
  domainTransaction,
  organizationRepository,
  tagRepository,
  organizationTagRepository,
  organizationInvitationRepository
}: any) {
  _checkIfOrganizationsDataAreNotEmptyAndUnique(organizations);

  await _checkIfOrganizationsAlreadyExistInDatabase(organizations, organizationRepository);

  const organizationsData = _validateAndMapOrganizationsData(organizations);

  const allTags = await tagRepository.findAll();

  let createdOrganizations = null;

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  await domainTransaction.execute(async (domainTransaction: any) => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    const organizationsToCreate = Array.from(organizationsData.values()).map((data: any) => data.organization);

    createdOrganizations = await organizationRepository.batchCreateProOrganizations(
      organizationsToCreate,
      domainTransaction
    );
    const organizationsTags = createdOrganizations.flatMap(({
      id,
      externalId
    }: any) => {
      return organizationsData.get(externalId).tags.map((tagName: any) => {
        const foundTag = allTags.find((tagInDB: any) => tagInDB.name === tagName.toUpperCase());
        if (foundTag) {
          return new OrganizationTag({ organizationId: id, tagId: foundTag.id });
        } else {
          throw new OrganizationTagNotFound();
        }
      });
    });
    await organizationTagRepository.batchCreate(organizationsTags, domainTransaction);
  });

  // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
  const createdOrganizationsWithEmail = createdOrganizations.filter((organization: any) => !!organization.email);

  await bluebird.mapSeries(createdOrganizationsWithEmail, (organization: any) => {
    const { locale, organizationInvitationRole } = organizationsData.get(organization.externalId);
    return organizationInvitationService.createProOrganizationInvitation({
      organizationRepository,
      organizationInvitationRepository,
      organizationId: organization.id,
      name: organization.name,
      email: organization.email,
      role: organizationInvitationRole?.toUpperCase(),
      locale,
    });
  });
  return createdOrganizations;
};

function _checkIfOrganizationsDataAreNotEmptyAndUnique(organizations: any) {
  if (!organizations) {
    throw new ObjectValidationError('Les organisations ne sont pas renseignées.');
  }
  const uniqOrganizations = uniqBy(organizations, 'externalId');

  if (uniqOrganizations.length !== organizations.length) {
    throw new ManyOrganizationsFoundError('Une organisation apparaît plusieurs fois.');
  }
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _checkIfOrganizationsAlreadyExistInDatabase(organizations: any, organizationRepository: any) {
  const organizationIds = await organizationRepository.findByExternalIdsFetchingIdsOnly(
    map(organizations, 'externalId')
  );
  if (!isEmpty(organizationIds)) {
    throw new OrganizationAlreadyExistError();
  }
}

function _validateAndMapOrganizationsData(organizations: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Map'. Do you need to change your... Remove this comment to see the full error message
  const mapOrganizationByExternalId = new Map();

  for (const organization of organizations) {
    if (!organization.externalId) {
      throw new ObjectValidationError('L’externalId de l’organisation n’est pas présent.');
    }
    if (!organization.name) {
      throw new ObjectValidationError('Le nom de l’organisation n’est pas présent.');
    }

    mapOrganizationByExternalId.set(organization.externalId, {
      organization: new Organization({
        ...organization,
        type: Organization.types.PRO,
      }),
      tags: organization.tags.split(ORGANIZATION_TAG_SEPARATOR),
      organizationInvitationRole: organization.organizationInvitationRole,
      locale: organization.locale,
    });
  }
  return mapOrganizationByExternalId;
}
