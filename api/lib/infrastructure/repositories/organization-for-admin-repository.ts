// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationForAdmin = require('../../domain/models/OrganizationForAdmin');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../domain/models/Tag');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(rawOrganization: any) {
  const organization = new OrganizationForAdmin({
    id: rawOrganization.id,
    name: rawOrganization.name,
    type: rawOrganization.type,
    logoUrl: rawOrganization.logoUrl,
    externalId: rawOrganization.externalId,
    provinceCode: rawOrganization.provinceCode,
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    isManagingStudents: Boolean(rawOrganization.isManagingStudents),
    credit: rawOrganization.credit,
    email: rawOrganization.email,
    documentationUrl: rawOrganization.documentationUrl,
    createdBy: rawOrganization.createdBy,
    showNPS: rawOrganization.showNPS,
    formNPSUrl: rawOrganization.formNPSUrl,
    showSkills: rawOrganization.showSkills,
    archivedAt: rawOrganization.archivedAt,
    archivistFirstName: rawOrganization.archivistFirstName,
    archivistLastName: rawOrganization.archivistLastName,
  });

  organization.tags = rawOrganization.tags || [];

  return organization;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    const organization = await knex('organizations')
      .select({
        id: 'organizations.id',
        name: 'organizations.name',
        type: 'organizations.type',
        logoUrl: 'organizations.logoUrl',
        externalId: 'organizations.externalId',
        provinceCode: 'organizations.provinceCode',
        isManagingStudents: 'organizations.isManagingStudents',
        credit: 'organizations.credit',
        email: 'organizations.email',
        documentationUrl: 'organizations.documentationUrl',
        createdBy: 'organizations.createdBy',
        showNPS: 'organizations.showNPS',
        formNPSUrl: 'organizations.formNPSUrl',
        showSkills: 'organizations.showSkills',
        archivedAt: 'organizations.archivedAt',
        archivistFirstName: 'users.firstName',
        archivistLastName: 'users.lastName',
      })
      .leftJoin('users', 'users.id', 'organizations.archivedBy')
      .where('organizations.id', id)
      .first();

    if (!organization) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Not found organization for ID ${id}`);
    }

    const tags = await knex('tags')
      .select('tags.*')
      .join('organization-tags', 'organization-tags.tagId', 'tags.id')
      .where('organization-tags.organizationId', organization.id);

    organization.tags = tags.map((tag: any) => {
      return new Tag(tag);
    });

    return _toDomain(organization);
  },
};
