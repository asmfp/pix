// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async addTargetProfilesToOrganization({
    organizationId,
    targetProfileIdList
  }: any) {
    const targetProfileShareToAdd = targetProfileIdList.map((targetProfileId: any) => {
      return { organizationId, targetProfileId };
    });

    const attachedTargetProfileIds = await knex('target-profile-shares')
      .insert(targetProfileShareToAdd)
      .onConflict(['targetProfileId', 'organizationId'])
      .ignore()
      .returning('targetProfileId');

    const duplicatedTargetProfileIds = targetProfileIdList.filter(
      (targetProfileId: any) => !attachedTargetProfileIds.includes(targetProfileId)
    );

    return { duplicatedIds: duplicatedTargetProfileIds, attachedIds: attachedTargetProfileIds };
  },
};
