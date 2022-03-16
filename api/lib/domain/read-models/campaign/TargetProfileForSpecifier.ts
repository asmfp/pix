// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileForSpecifier {
  category: any;
  description: any;
  hasStage: any;
  id: any;
  name: any;
  thematicResultCount: any;
  tubeCount: any;
  constructor({
    id,
    name,
    skills,
    thematicResults,
    hasStage,
    description,
    category
  }: any) {
    this.id = id;
    this.name = name;
    this.tubeCount = _(skills).map('tubeId').uniq().size();
    this.thematicResultCount = thematicResults.length;
    this.hasStage = hasStage;
    this.description = description;
    this.category = category;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileForSpecifier;
