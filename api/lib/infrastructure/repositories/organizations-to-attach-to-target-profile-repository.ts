// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'foreignKey... Remove this comment to see the full error message
const { foreignKeyConstraintViolated } = require('../utils/knex-utils.js');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async attachOrganizations(targetProfile: any) {
    const rows = targetProfile.organizations.map((organizationId: any) => {
      return {
        organizationId,
        targetProfileId: targetProfile.id,
      };
    });
    const attachedOrganizationIds = await _createTargetProfileShares(rows);

    const duplicatedOrganizationIds = targetProfile.organizations.filter(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type 'unknow... Remove this comment to see the full error message
      (organizationId: any) => !attachedOrganizationIds.includes(organizationId)
    );

    return { duplicatedIds: duplicatedOrganizationIds, attachedIds: attachedOrganizationIds };
  },
};

async function _createTargetProfileShares(targetProfileShares: any) {
  try {
    return await knex('target-profile-shares')
      .insert(targetProfileShares)
      .onConflict(['targetProfileId', 'organizationId'])
      .ignore()
      .returning('organizationId');
  } catch (error) {
    if (foreignKeyConstraintViolated(error)) {
      const organizationId = error.detail.match(/=\((\d+)\)/)[1];
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`L'organization avec l'id ${organizationId} n'existe pas`);
    }
  }
}
