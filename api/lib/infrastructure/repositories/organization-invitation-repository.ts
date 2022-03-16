// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const BookshelfOrganizationInvitation = require('../orm-models/OrganizationInvitation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../domain/models/OrganizationInvitation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(bookshelfInvitation: any) {
  if (bookshelfInvitation) {
    return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationInvitation, bookshelfInvitation);
  }
  return null;
}

function _checkNotFoundError(error: any, id: any) {
  if (error instanceof BookshelfOrganizationInvitation.NotFoundError) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Not found organization-invitation for ID ${id}`);
  }
  throw error;
}

function _checkNotFoundErrorWithCode({
  error,
  id,
  code
}: any) {
  if (error instanceof BookshelfOrganizationInvitation.NotFoundError) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    throw new NotFoundError(`Not found organization-invitation for ID ${id} and code ${code}`);
  }
  throw error;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  create({
    organizationId,
    email,
    code,
    role
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
    const status = OrganizationInvitation.StatusType.PENDING;
    return new BookshelfOrganizationInvitation({ organizationId, email, status, code, role }).save().then(_toDomain);
  },

  get(id: any) {
    return BookshelfOrganizationInvitation.where({ id })
      .fetch()
      .then(_toDomain)
      .catch((err: any) => _checkNotFoundError(err, id));
  },

  getByIdAndCode({
    id,
    code
  }: any) {
    return BookshelfOrganizationInvitation.where({ id, code })
      .fetch()
      .then(_toDomain)
      .catch((error: any) => _checkNotFoundErrorWithCode({ error, id, code }));
  },

  markAsAccepted(id: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
    const status = OrganizationInvitation.StatusType.ACCEPTED;

    return new BookshelfOrganizationInvitation({ id })
      .save({ status }, { patch: true, require: true })
      .then((model: any) => model.refresh())
      .then(_toDomain)
      .catch((err: any) => _checkNotFoundError(err, id));
  },

  async markAsCancelled({
    id
  }: any) {
    const [organizationInvitation] = await knex('organization-invitations')
      .where({ id })
      .update({
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
        status: OrganizationInvitation.StatusType.CANCELLED,
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
        updatedAt: new Date(),
      })
      .returning('*');

    if (!organizationInvitation) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Organization invitation of id ${id} is not found.`);
    }
    return new OrganizationInvitation(organizationInvitation);
  },

  findPendingByOrganizationId({
    organizationId
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
    return BookshelfOrganizationInvitation.where({ organizationId, status: OrganizationInvitation.StatusType.PENDING })
      .orderBy('updatedAt', 'desc')
      .fetchAll()
      .then((results: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfOrganizationInvitation, results));
  },

  findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email
  }: any) {
    return BookshelfOrganizationInvitation.query((qb: any) => qb
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
      .where({ organizationId, status: OrganizationInvitation.StatusType.PENDING })
      .whereRaw('LOWER("email") = ?', `${email.toLowerCase()}`)
    )
      .fetch({ require: false })
      .then(_toDomain);
  },

  async updateModificationDate(id: any) {
    const organizationInvitation = await knex('organization-invitations')
      .where({ id })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ updatedAt: new Date() })
      .returning('*')
      .then(_.first);

    if (!organizationInvitation) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Organization invitation of id ${id} is not found.`);
    }
    return new OrganizationInvitation(organizationInvitation);
  },
};
