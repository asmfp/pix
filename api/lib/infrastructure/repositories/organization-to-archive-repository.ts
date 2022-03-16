// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingAtt... Remove this comment to see the full error message
const { MissingAttributesError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async save(organizationToArchive: any) {
    if (!organizationToArchive.archiveDate || !organizationToArchive.archivedBy) {
      throw new MissingAttributesError();
    }

    if (organizationToArchive.newInvitationStatus) {
      await knex('organization-invitations')
        .where({ organizationId: organizationToArchive.id, status: organizationToArchive.previousInvitationStatus })
        .update({ status: organizationToArchive.newInvitationStatus });
    }

    await knex('campaigns')
      .where({ organizationId: organizationToArchive.id, archivedAt: null })
      .update({ archivedAt: organizationToArchive.archiveDate });

    await knex('memberships')
      .where({ organizationId: organizationToArchive.id, disabledAt: null })
      .update({ disabledAt: organizationToArchive.archiveDate });

    await knex('organizations')
      .where({ id: organizationToArchive.id, archivedBy: null })
      .update({ archivedBy: organizationToArchive.archivedBy, archivedAt: organizationToArchive.archiveDate });
  },
};
