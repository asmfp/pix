// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../domain/models/TargetProfile');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../domain/models/Stage');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillAdapt... Remove this comment to see the full error message
const skillAdapter = require('./skill-adapter');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  fromDatasourceObjects({
    bookshelfTargetProfile,
    associatedSkillDatasourceObjects
  }: any) {
    const skills = associatedSkillDatasourceObjects.map(skillAdapter.fromDatasourceObject);
    const targetProfileStages = bookshelfTargetProfile.related('stages');
    const hasStages = targetProfileStages && targetProfileStages.models;
    const stages = hasStages ? targetProfileStages.models.map((stage: any) => new Stage(stage.attributes)) : [];

    return new TargetProfile({
      id: bookshelfTargetProfile.get('id'),
      name: bookshelfTargetProfile.get('name'),
      imageUrl: bookshelfTargetProfile.get('imageUrl'),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
      isPublic: Boolean(bookshelfTargetProfile.get('isPublic')),
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
      isSimplifiedAccess: Boolean(bookshelfTargetProfile.get('isSimplifiedAccess')),
      ownerOrganizationId: bookshelfTargetProfile.get('ownerOrganizationId'),
      outdated: bookshelfTargetProfile.get('outdated'),
      skills,
      stages,
    });
  },
};
