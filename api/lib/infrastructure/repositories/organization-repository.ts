// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfOrganization = require('../orm-models/Organization');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../domain/models/Organization');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGE_SIZE = 10;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGE_NUMBER = 1;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(rawOrganization: any) {
  const organization = new Organization({
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
  });

  organization.targetProfileShares = rawOrganization.targetProfileShares || [];
  organization.tags = rawOrganization.tags || [];

  return organization;
}

function _setSearchFiltersForQueryBuilder(filter: any, qb: any) {
  const { id, name, type, externalId } = filter;
  if (id) {
    qb.where('organizations.id', id);
  }
  if (name) {
    qb.whereRaw('LOWER("name") LIKE ?', `%${name.toLowerCase()}%`);
  }
  if (type) {
    qb.whereRaw('LOWER("type") LIKE ?', `%${type.toLowerCase()}%`);
  }
  if (externalId) {
    qb.whereRaw('LOWER("externalId") LIKE ?', `%${externalId.toLowerCase()}%`);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create(organization: any) {
    const organizationRawData = _.pick(organization, [
      'name',
      'type',
      'logoUrl',
      'externalId',
      'provinceCode',
      'email',
      'isManagingStudents',
      'createdBy',
      'documentationUrl',
    ]);

    return knex('organizations')
      .insert(organizationRawData)
      .returning('*')
      // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'organization' implicitly has an '... Remove this comment to see the full error message
      .then(([organization]) => _toDomain(organization));
  },

  async batchCreateProOrganizations(organizations: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    const organizationsRawData = organizations.map((organization: any) => _.pick(organization, [
      'name',
      'type',
      'logoUrl',
      'externalId',
      'provinceCode',
      'email',
      'isManagingStudents',
      'credit',
      'createdBy',
      'documentationUrl',
    ])
    );
    return Bookshelf.knex
      .batchInsert('organizations', organizationsRawData)
      .transacting(domainTransaction.knexTransaction)
      .returning(['id', 'externalId', 'email', 'name']);
  },

  update(organization: any) {
    const organizationRawData = _.pick(organization, [
      'name',
      'type',
      'logoUrl',
      'externalId',
      'provinceCode',
      'isManagingStudents',
      'email',
      'credit',
      'documentationUrl',
      'showSkills',
    ]);

    return new BookshelfOrganization({ id: organization.id })
      .save(organizationRawData, { patch: true })
      .then((model: any) => model.refresh({ withRelated: 'tags' }))
      .then((model: any) => model.toJSON())
      .then(_toDomain);
  },

  get(id: any) {
    return BookshelfOrganization.where({ id })
      .fetch({
        withRelated: ['targetProfileShares.targetProfile', 'tags'],
      })
      .then((model: any) => model.toJSON())
      .then(_toDomain)
      .catch((err: any) => {
        if (err instanceof BookshelfOrganization.NotFoundError) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          throw new NotFoundError(`Not found organization for ID ${id}`);
        }
        throw err;
      });
  },

  async getIdByCertificationCenterId(certificationCenterId: any) {
    const bookshelfOrganization = await BookshelfOrganization.query((qb: any) => {
      qb.join('certification-centers', 'certification-centers.externalId', 'organizations.externalId');
      qb.where('certification-centers.id', '=', certificationCenterId);
    }).fetch({ require: false, columns: ['organizations.id'] });

    const id = _.get(bookshelfOrganization, 'attributes.id');
    if (id) return id;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Not found organization for certification center id ${certificationCenterId}`);
  },

  async getScoOrganizationByExternalId(externalId: any) {
    const organizationBookshelf = await BookshelfOrganization.query((qb: any) => qb.where({ type: Organization.types.SCO }).whereRaw('LOWER("externalId") = ?', externalId.toLowerCase())
    ).fetch({ require: false });

    if (organizationBookshelf) {
      return _toDomain(organizationBookshelf.toJSON());
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Could not find organization for externalId ${externalId}.`);
  },

  findByExternalIdsFetchingIdsOnly(externalIds: any) {
    return BookshelfOrganization.where('externalId', 'in', externalIds)
      .fetchAll({ columns: ['id', 'externalId'] })
      .then((organizations: any) => organizations.models.map((model: any) => _toDomain(model.toJSON())));
  },

  findScoOrganizationByUai(uai: any) {
    return BookshelfOrganization.query((qb: any) => qb.where({ type: Organization.types.SCO }).whereRaw('LOWER("externalId") = ? ', `${uai.toLowerCase()}`)
    )
      .fetchAll({ columns: ['id', 'type', 'externalId', 'email'] })
      .then((organizations: any) => organizations.models.map((model: any) => _toDomain(model.toJSON())));
  },

  findPaginatedFiltered({
    filter,
    page
  }: any) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    return BookshelfOrganization.query((qb: any) => _setSearchFiltersForQueryBuilder(filter, qb))
      .fetchPage({
        page: pageNumber,
        pageSize: pageSize,
      })
      .then(({
      models,
      pagination
    }: any) => {
        const organizations = bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganization, models);
        return { models: organizations, pagination };
      });
  },

  async findPaginatedFilteredByTargetProfile({
    targetProfileId,
    filter,
    page
  }: any) {
    const pageSize = page.size ? page.size : DEFAULT_PAGE_SIZE;
    const pageNumber = page.number ? page.number : DEFAULT_PAGE_NUMBER;
    const { models, pagination } = await BookshelfOrganization.query((qb: any) => {
      qb.where({ 'target-profile-shares.targetProfileId': targetProfileId });
      _setSearchFiltersForQueryBuilder(filter, qb);
      qb.innerJoin('target-profile-shares', 'organizations.id', 'target-profile-shares.organizationId');
    }).fetchPage({
      page: pageNumber,
      pageSize,
    });
    const organizations = bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganization, models);
    return { models: organizations, pagination };
  },
};
